<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProgramRequest;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    use HandlesCmsUploads;

    public function index(): Response
    {
        return Inertia::render('Admin/Programs/Index', [
            'programs' => Program::ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Programs/Form', ['program' => null]);
    }

    public function store(ProgramRequest $request): RedirectResponse
    {
        $data = $this->payload($request);
        $data['image'] = $this->storeImage($request, 'image', 'programs');

        Program::create($data);

        return redirect()->route('admin.programs.index')->with('success', 'Program created.');
    }

    public function edit(Program $program): Response
    {
        return Inertia::render('Admin/Programs/Form', ['program' => $program]);
    }

    public function update(ProgramRequest $request, Program $program): RedirectResponse
    {
        $data = $this->payload($request, $program);
        $data['image'] = $this->replaceImage($request, $program, 'image', 'programs');

        $program->update($data);

        return redirect()->route('admin.programs.index')->with('success', 'Program updated.');
    }

    public function destroy(Program $program): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $program->delete();

        return back()->with('success', 'Program deleted.');
    }

    public function toggleVisibility(Program $program): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $program->update(['is_active' => ! $program->is_active]);

        return back()->with('success', $program->is_active ? 'Program is visible.' : 'Program is hidden.');
    }

    private function payload(ProgramRequest $request, ?Program $program = null): array
    {
        $data = $request->safe()->except('image');
        $slug = $data['slug'] ?: Str::slug($data['title']);

        $canManageVisibility = $request->user()?->can('manage visibility');

        return [
            ...$data,
            'slug' => $this->uniqueSlug($slug, $program?->id),
            'sort_order' => $request->integer('sort_order'),
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $canManageVisibility ? $request->boolean('is_active') : ($program?->is_active ?? true),
        ];
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug ?: 'program';
        $candidate = $base;
        $counter = 2;

        while (Program::where('slug', $candidate)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $candidate = "{$base}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
