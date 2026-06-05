<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_email' => ['required', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:50'],
            'amount' => ['required', 'numeric', 'min:1000', 'max:999999999'],
            'currency' => ['required', 'string', 'max:8'],
            'donation_type' => ['required', Rule::in(['one_time', 'monthly'])],
            'payment_method' => ['required', Rule::in(['manual', 'bank_transfer', 'mobile_money'])],
            'message' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
