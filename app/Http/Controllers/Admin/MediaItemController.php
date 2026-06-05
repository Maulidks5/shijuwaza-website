<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MediaItemRequest;
use App\Models\MediaAlbum;
use App\Models\MediaItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MediaItemController extends Controller
{
    use HandlesCmsUploads;

    public function index(): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'items' => MediaItem::with('album')->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Media/Form', [
            'item' => null,
            'albums' => MediaAlbum::ordered()->get(['id', 'name']),
        ]);
    }

    public function store(MediaItemRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('image');
        $data['media_album_id'] = $request->integer('media_album_id') ?: null;
        $data['image'] = $this->storeImage($request, 'image', 'media');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->user()?->can('manage visibility') ? $request->boolean('is_active') : true;

        MediaItem::create($data);

        return redirect()->route('admin.media.index')->with('success', 'Media item created.');
    }

    public function edit(MediaItem $medium): Response
    {
        return Inertia::render('Admin/Media/Form', [
            'item' => $medium,
            'albums' => MediaAlbum::ordered()->get(['id', 'name']),
        ]);
    }

    public function update(MediaItemRequest $request, MediaItem $medium): RedirectResponse
    {
        $data = $request->safe()->except('image');
        $data['media_album_id'] = $request->integer('media_album_id') ?: null;
        $data['image'] = $this->replaceImage($request, $medium, 'image', 'media');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->user()?->can('manage visibility') ? $request->boolean('is_active') : $medium->is_active;

        $medium->update($data);

        return redirect()->route('admin.media.index')->with('success', 'Media item updated.');
    }

    public function destroy(MediaItem $medium): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $medium->delete();

        return back()->with('success', 'Media item deleted.');
    }

    public function toggleVisibility(MediaItem $medium): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $medium->update(['is_active' => ! $medium->is_active]);

        return back()->with('success', $medium->is_active ? 'Media item is visible.' : 'Media item is hidden.');
    }
}
