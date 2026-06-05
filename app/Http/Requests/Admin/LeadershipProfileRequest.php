<?php

namespace App\Http\Requests\Admin;

use App\Models\LeadershipProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LeadershipProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $profileId = $this->route('leadershipProfile')?->id ?? $this->route('leadership_profile')?->id;

        $parentRules = ['nullable', 'integer', Rule::exists('leadership_profiles', 'id')];

        if ($profileId) {
            $parentRules[] = Rule::notIn([$profileId]);
        }

        return [
            'category' => ['required', Rule::in(array_keys(LeadershipProfile::CATEGORIES))],
            'parent_profile_id' => $parentRules,
            'tree_position' => ['nullable', Rule::in(['left', 'down', 'right'])],
            'full_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'short_bio' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
