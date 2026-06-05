<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'donor_name',
        'donor_email',
        'donor_phone',
        'amount',
        'currency',
        'donation_type',
        'payment_method',
        'message',
        'status',
        'instructions_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'instructions_sent_at' => 'datetime',
        ];
    }

    public function ensureReferenceNumber(): string
    {
        if ($this->reference_number) {
            return $this->reference_number;
        }

        $referenceNumber = 'SHJ-DON-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);

        try {
            $this->forceFill([
                'reference_number' => $referenceNumber,
            ])->save();
        } catch (\Throwable) {
            $this->forceFill(['reference_number' => $referenceNumber]);
        }

        return $this->reference_number;
    }
}
