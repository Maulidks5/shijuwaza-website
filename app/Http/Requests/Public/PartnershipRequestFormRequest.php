<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartnershipRequestFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'organization_name' => ['required', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'partnership_type' => ['required', Rule::in([
                'funding',
                'training',
                'advocacy',
                'research',
                'media',
                'technical_support',
                'other',
            ])],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
