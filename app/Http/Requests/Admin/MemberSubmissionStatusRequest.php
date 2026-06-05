<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberSubmissionStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage member submissions') ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected', 'archived'])],
            'admin_note' => ['nullable', 'string', 'max:2000'],
            'is_public' => ['nullable', 'boolean'],
        ];
    }
}
