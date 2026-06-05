<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'member_organization_id',
    'submitted_by',
    'title',
    'submission_type',
    'body',
    'document_path',
    'original_filename',
    'status',
    'admin_note',
    'is_public',
    'approved_at',
    'approved_by',
])]
class MemberSubmission extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'is_public' => 'boolean',
        ];
    }

    public function scopeApprovedPublic(Builder $query): Builder
    {
        return $query->where('status', 'approved')->where('is_public', true);
    }

    public function memberOrganization(): BelongsTo
    {
        return $this->belongsTo(MemberOrganization::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
