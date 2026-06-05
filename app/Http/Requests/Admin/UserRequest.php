<?php

namespace App\Http\Requests\Admin;

use App\Support\ModuleAccess;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('Super Admin') ?? false;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $passwordRules = $this->isMethod('post')
            ? ['required', Password::min(8)->mixedCase()->numbers()]
            : ['nullable', Password::min(8)->mixedCase()->numbers()];

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => $passwordRules,
            'role' => ['required', Rule::in(['Super Admin', 'Admin', 'Editor'])],
            'module_permissions' => ['nullable', 'array'],
            'module_permissions.*' => ['string', Rule::in(ModuleAccess::permissions())],
        ];
    }
}
