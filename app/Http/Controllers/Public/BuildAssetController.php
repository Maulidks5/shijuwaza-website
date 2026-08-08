<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BuildAssetController extends Controller
{
    public function show(string $path): BinaryFileResponse|Response
    {
        abort_if(str_contains($path, '..') || str_starts_with($path, '/'), 404);

        $filePath = base_path('public/build/'.ltrim($path, '/'));

        abort_unless(is_file($filePath), 404);

        return response()
            ->file($filePath)
            ->setMaxAge(31536000)
            ->setPublic();
    }
}
