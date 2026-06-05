<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    protected $fillable = [
        'path',
        'url',
        'referrer',
        'ip_hash',
        'visitor_hash',
        'user_agent',
        'device_type',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];
}
