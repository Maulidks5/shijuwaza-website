<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HandlesCmsUploads
{
    protected function storeImage(Request $request, string $field, string $directory): ?string
    {
        if (! $request->hasFile($field)) {
            return null;
        }

        return $request->file($field)->store($directory, 'public');
    }

    protected function replaceImage(Request $request, Model $model, string $field, string $directory): ?string
    {
        if (! $request->hasFile($field)) {
            return $model->{$field};
        }

        $current = $model->{$field};

        if ($current && ! str_starts_with($current, '/')) {
            Storage::disk('public')->delete($current);
        }

        return $this->storeImage($request, $field, $directory);
    }
}
