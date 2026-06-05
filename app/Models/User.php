<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'phone', 'avatar', 'password', 'role', 'is_blocked', 'blocked_at', 'blocked_by', 'blocked_reason', 'last_seen_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_blocked' => 'boolean',
            'blocked_at' => 'datetime',
            'last_seen_at' => 'datetime',
        ];
    }

    public function isBlocked(): bool
    {
        return (bool) $this->is_blocked;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin' || $this->hasRole('Super Admin');
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin', 'editor'], true)
            || $this->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function isMember(): bool
    {
        return $this->role === 'member' || $this->hasRole('Member');
    }

    public function memberOrganization(): HasOne
    {
        return $this->hasOne(MemberOrganization::class);
    }
}
