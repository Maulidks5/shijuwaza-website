<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewsPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $newsPostId = $this->route('news')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('news_posts', 'slug')->ignore($newsPostId)],
            'category' => ['required', Rule::in(array_keys(\App\Models\NewsPost::CATEGORIES))],
            'excerpt' => ['required', 'string', 'max:1200'],
            'body' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'activity_date' => ['nullable', 'date'],
            'published_at' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
