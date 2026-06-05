<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PublicUploads
{
    public static function store(UploadedFile $file, string $folder): string
    {
        $folder = trim($folder, '/');
        $targetDirectory = self::storagePath($folder);

        if (! file_exists($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = Str::slug($baseName) ?: 'upload';
        $filename = $filename.'-'.Str::random(10).($extension ? ".{$extension}" : '');

        $file->move($targetDirectory, $filename);

        return "storage/{$folder}/{$filename}";
    }

    public static function delete(?string $path): void
    {
        if (! $path || str_starts_with($path, '/') || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        $filePath = self::absolutePath($path);

        if (is_file($filePath)) {
            unlink($filePath);
        }
    }

    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return str_starts_with($path, 'storage/') ? "/{$path}" : "/storage/{$path}";
    }

    public static function absolutePath(string $path): string
    {
        $path = ltrim($path, '/');

        if (str_starts_with($path, 'storage/')) {
            return self::publicRoot().DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $path);
        }

        return self::storagePath($path);
    }

    public static function storagePath(string $folder = ''): string
    {
        $folder = trim($folder, '/');
        $base = rtrim((string) env('PUBLIC_STORAGE_PATH', base_path('../public_html/storage')), DIRECTORY_SEPARATOR);

        return $folder ? $base.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $folder) : $base;
    }

    private static function publicRoot(): string
    {
        return dirname(self::storagePath());
    }
}
