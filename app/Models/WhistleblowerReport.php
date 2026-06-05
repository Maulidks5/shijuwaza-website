<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhistleblowerReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'concern_type',
        'message',
        'location',
        'contact_details',
        'wants_anonymous',
        'status',
    ];

    protected $casts = [
        'wants_anonymous' => 'boolean',
    ];
}
