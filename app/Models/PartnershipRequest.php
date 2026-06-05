<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnershipRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_name',
        'contact_person',
        'email',
        'phone',
        'partnership_type',
        'message',
        'status',
    ];
}
