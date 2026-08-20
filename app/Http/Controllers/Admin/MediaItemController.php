<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Models\MediaItem;
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
}
