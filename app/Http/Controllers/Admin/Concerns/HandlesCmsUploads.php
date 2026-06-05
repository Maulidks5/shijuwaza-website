<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Support\PublicUploads;

trait HandlesCmsUploads
{
    protected function storeImage(Request $request, string $field, string $directory): ?string
    {
        if (! $request->hasFile($field)) {
            return null;
        }

        return PublicUploads::store($request->file($field), $directory);
    }

    protected function replaceImage(Request $request, Model $model, string $field, string $directory): ?string
    {
        if (! $request->hasFile($field)) {
            return $model->{$field};
        }

        $current = $model->{$field};

        PublicUploads::delete($current);

        return $this->storeImage($request, $field, $directory);
    }

    protected function publicUploadUrl(?string $path): ?string
    {
        return PublicUploads::url($path);
    }

    protected function deletePublicUpload(?string $path): void
    {
        PublicUploads::delete($path);
    }
}
