<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('Member') && $this->user()?->memberOrganization()->exists();
    }

    public function rules(): array
    {
        $submission = $this->route('submission');
        $documentRequired = ! $submission?->document_path;

        return [
            'title' => ['required', 'string', 'max:255'],
            'submission_type' => ['required', Rule::in(['text', 'document'])],
            'body' => ['nullable', 'required_if:submission_type,text', 'string', 'max:10000'],
            'document' => [$documentRequired ? 'required_if:submission_type,document' : 'nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
        ];
    }
}
