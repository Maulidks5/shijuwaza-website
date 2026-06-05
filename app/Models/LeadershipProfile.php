<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class LeadershipProfile extends Model
{
    public const CATEGORIES = [
        'secretariat' => 'Secretariat of SHIJUWAZA',
        'board' => 'Board Members of SHIJUWAZA',
        'nec' => 'National Executive Committee (NEC) Members',
    ];

    protected $fillable = [
        'category',
        'parent_profile_id',
        'tree_position',
        'full_name',
        'position',
        'short_bio',
        'bio',
        'photo',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_profile_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_profile_id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('category')
            ->orderByRaw("CASE tree_position WHEN 'left' THEN 0 WHEN 'down' THEN 1 WHEN 'right' THEN 2 ELSE 1 END")
            ->orderBy('sort_order')
            ->orderBy('full_name');
    }
}
