<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    protected $fillable = [
        'eyebrow',
        'title',
        'subtitle',
        'primary_button_text',
        'primary_button_url',
        'secondary_button_text',
        'secondary_button_url',
        'quote',
        'established_year',
        'established_label',
        'focus_items',
        'slides',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'focus_items' => 'array',
            'slides' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
