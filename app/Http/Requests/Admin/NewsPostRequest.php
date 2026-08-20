<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\NewsPost;

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
            'category' => ['required', Rule::in(array_keys(NewsPost::CATEGORIES))],
            'excerpt' => ['required', 'string', 'max:1200'],
            'body' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'gallery_photos' => ['nullable', 'array', 'max:24'],
            'gallery_photos.*' => ['image', 'max:8192'],
            'activity_date' => ['nullable', 'date'],
            'published_at' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'related_link_type' => ['nullable', Rule::in(array_keys(NewsPost::RELATED_LINK_TYPES))],
            'related_link_url' => ['nullable', 'url', 'max:2048', 'required_with:related_link_type'],
            'related_link_label' => ['nullable', 'string', 'max:80'],
        ];
    }
}
