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

        $path = ltrim($path, '/');
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));

        return "/uploaded-files/{$encodedPath}";
    }

    public static function absolutePath(string $path): string
    {
        $path = ltrim($path, '/');

        if (str_starts_with($path, 'storage/')) {
            $relativePath = substr($path, strlen('storage/'));
            $primaryPath = self::storagePath($relativePath);

            if (is_file($primaryPath)) {
                return $primaryPath;
            }

            $fallbackPath = storage_path('app/public/'.str_replace('/', DIRECTORY_SEPARATOR, $relativePath));

            if (is_file($fallbackPath)) {
                return $fallbackPath;
            }

            return $primaryPath;
        }

        return self::storagePath($path);
    }

    public static function storagePath(string $folder = ''): string
    {
        $folder = trim($folder, '/');
        $base = env('PUBLIC_STORAGE_PATH');

        if (! $base) {
            $publicHtmlStorage = base_path('../public_html/storage');
            $base = is_dir(dirname($publicHtmlStorage)) ? $publicHtmlStorage : storage_path('app/public');
        }

        $base = rtrim((string) $base, DIRECTORY_SEPARATOR);

        return $folder ? $base.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $folder) : $base;
    }

    private static function publicRoot(): string
    {
        return dirname(self::storagePath());
    }
}
