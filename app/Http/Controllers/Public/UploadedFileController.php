<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Support\PublicUploads;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class UploadedFileController extends Controller
{
    public function show(string $path): BinaryFileResponse|Response
    {
        abort_if(str_contains($path, '..') || str_starts_with($path, '/'), 404);

        $filePath = PublicUploads::absolutePath($path);

        abort_unless(is_file($filePath), 404);

        return response()->file($filePath);
    }
}
