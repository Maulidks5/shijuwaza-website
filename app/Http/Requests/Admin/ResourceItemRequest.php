<?php

namespace App\Http\Requests\Admin;

use App\Models\ResourceItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResourceItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage resources') ?? false;
    }

    public function rules(): array
    {
        $resourceId = $this->route('resource')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('resource_items', 'slug')->ignore($resourceId)],
            'category' => ['required', Rule::in(array_keys(ResourceItem::CATEGORIES))],
            'excerpt' => ['required', 'string', 'max:1200'],
            'body' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'file_path' => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt', 'max:20480'],
            'published_at' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'file_path.uploaded' => 'The document file failed to upload. Please check PHP upload_max_filesize supports 20MB uploads.',
            'file_path.max' => 'The document file must be 20MB or smaller.',
        ];
    }

    public function attributes(): array
    {
        return [
            'file_path' => 'document file',
        ];
    }
}
