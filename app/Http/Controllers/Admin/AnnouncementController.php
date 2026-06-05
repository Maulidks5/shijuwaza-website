<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => Announcement::query()
                ->when($status, fn ($query) => $query->where('status', $status))
                ->ordered()
                ->get()
                ->map(fn (Announcement $announcement) => $this->formatAnnouncement($announcement)),
            'filters' => ['status' => $status],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Announcements/Form', ['announcement' => null]);
    }

    public function store(AnnouncementRequest $request): RedirectResponse
    {
        $data = $this->payload($request);
        $data['document_path'] = $this->storeDocument($request);

        Announcement::create($data);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement created.');
    }

    public function edit(Announcement $announcement): Response
    {
        return Inertia::render('Admin/Announcements/Form', [
            'announcement' => $this->formatAnnouncement($announcement),
        ]);
    }

    public function update(AnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $data = $this->payload($request, $announcement);
        $data['document_path'] = $this->replaceDocument($request, $announcement);

        $announcement->update($data);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $this->deleteDocument($announcement->document_path);
        $announcement->delete();

        return back()->with('success', 'Announcement removed permanently.');
    }

    public function archive(Announcement $announcement): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $announcement->update(['status' => 'archived']);

        return back()->with('success', 'Announcement archived.');
    }

    private function payload(AnnouncementRequest $request, ?Announcement $announcement = null): array
    {
        $data = $request->safe()->except('document_path');
        $slug = $data['slug'] ?: Str::slug($data['title']);

        if (($data['status'] ?? null) === 'archived' && ! $request->user()?->can('manage visibility')) {
            abort(403);
        }

        return [
            ...$data,
            'slug' => $this->uniqueSlug($slug, $announcement?->id),
            'sort_order' => $request->integer('sort_order'),
            'is_featured' => $request->boolean('is_featured'),
        ];
    }

    private function storeDocument(Request $request): ?string
    {
        if (! $request->hasFile('document_path')) {
            return null;
        }

        return $request->file('document_path')->store('announcements', 'public');
    }

    private function replaceDocument(Request $request, Announcement $announcement): ?string
    {
        if (! $request->hasFile('document_path')) {
            return $announcement->document_path;
        }

        $this->deleteDocument($announcement->document_path);

        return $this->storeDocument($request);
    }

    private function deleteDocument(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/')) {
            Storage::disk('public')->delete($path);
        }
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug ?: 'announcement';
        $candidate = $base;
        $counter = 2;

        while (Announcement::where('slug', $candidate)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $candidate = "{$base}-{$counter}";
            $counter++;
        }

        return $candidate;
    }

    private function formatAnnouncement(Announcement $announcement): array
    {
        return [
            ...$announcement->toArray(),
            'document_url' => $this->assetUrl($announcement->document_path),
            'published_label' => $announcement->published_at?->format('M d, Y'),
        ];
    }

    private function assetUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') ? $path : asset("storage/{$path}");
    }
}
