<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class HeroSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage hero section') ?? false;
    }

    public function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:120'],
            'title' => ['required', 'string', 'max:180'],
            'subtitle' => ['nullable', 'string', 'max:700'],
            'primary_button_text' => ['nullable', 'string', 'max:60'],
            'primary_button_url' => ['nullable', 'string', 'max:255'],
            'secondary_button_text' => ['nullable', 'string', 'max:60'],
            'secondary_button_url' => ['nullable', 'string', 'max:255'],
            'quote' => ['nullable', 'string', 'max:180'],
            'established_year' => ['nullable', 'string', 'max:20'],
            'established_label' => ['nullable', 'string', 'max:80'],
            'is_active' => ['boolean'],
            'focus_items' => ['nullable', 'array', 'max:3'],
            'focus_items.*.label' => ['nullable', 'string', 'max:80'],
            'focus_items.*.icon' => ['nullable', 'string', 'max:60'],
            'slides' => ['nullable', 'array', 'max:4'],
            'slides.*.image' => ['nullable', 'string', 'max:255'],
            'slides.*.image_file' => ['nullable', 'image', 'max:4096'],
            'slides.*.alt' => ['nullable', 'string', 'max:180'],
            'slides.*.label' => ['nullable', 'string', 'max:80'],
            'slides.*.title' => ['nullable', 'string', 'max:140'],
        ];
    }
}
