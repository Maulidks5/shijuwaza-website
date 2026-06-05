<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MediaAlbumRequest;
use App\Models\MediaAlbum;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaAlbumController extends Controller
{
    use HandlesCmsUploads;

    public function index(): Response
    {
        return Inertia::render('Admin/MediaAlbums/Index', [
            'albums' => MediaAlbum::withCount('mediaItems')->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/MediaAlbums/Form', ['album' => null]);
    }

    public function store(MediaAlbumRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('cover_image');
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name']);
        $data['cover_image'] = $this->storeImage($request, 'cover_image', 'media-albums');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_active'] = $request->user()?->can('manage visibility') ? $request->boolean('is_active') : true;

        MediaAlbum::create($data);

        return redirect()->route('admin.media-albums.index')->with('success', 'Gallery album created.');
    }

    public function edit(MediaAlbum $album): Response
    {
        return Inertia::render('Admin/MediaAlbums/Form', ['album' => $album]);
    }

    public function update(MediaAlbumRequest $request, MediaAlbum $album): RedirectResponse
    {
        $data = $request->safe()->except('cover_image');
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name'], $album);
        $data['cover_image'] = $this->replaceImage($request, $album, 'cover_image', 'media-albums');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_active'] = $request->user()?->can('manage visibility') ? $request->boolean('is_active') : $album->is_active;

        $album->update($data);

        return redirect()->route('admin.media-albums.index')->with('success', 'Gallery album updated.');
    }

    public function destroy(MediaAlbum $album): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $album->delete();

        return back()->with('success', 'Gallery album deleted. Media items remain available without an album.');
    }

    public function toggleVisibility(MediaAlbum $album): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $album->update(['is_active' => ! $album->is_active]);

        return back()->with('success', $album->is_active ? 'Gallery album is visible.' : 'Gallery album is hidden.');
    }

    private function uniqueSlug(string $value, ?MediaAlbum $album = null): string
    {
        $base = Str::slug($value) ?: Str::random(8);
        $slug = $base;
        $count = 2;

        while (MediaAlbum::where('slug', $slug)->when($album, fn ($query) => $query->whereKeyNot($album->id))->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }
}
