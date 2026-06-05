<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WhistleblowerReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'concern_type' => ['required', Rule::in([
                'abuse_or_violence',
                'discrimination',
                'harassment',
                'accessibility_concern',
                'other',
            ])],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'location' => ['nullable', 'string', 'max:255'],
            'contact_details' => ['nullable', 'string', 'max:255'],
            'wants_anonymous' => ['boolean'],
        ];
    }
}
