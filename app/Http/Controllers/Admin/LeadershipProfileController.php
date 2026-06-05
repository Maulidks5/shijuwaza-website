<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LeadershipProfileRequest;
use App\Models\LeadershipProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LeadershipProfileController extends Controller
{
    use HandlesCmsUploads;

    public function index(): Response
    {
        return Inertia::render('Admin/LeadershipProfiles/Index', [
            'profiles' => LeadershipProfile::ordered()
                ->with('parent:id,full_name')
                ->get()
                ->map(fn (LeadershipProfile $profile) => $this->payload($profile)),
            'categories' => LeadershipProfile::CATEGORIES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/LeadershipProfiles/Form', [
            'profile' => null,
            'categories' => LeadershipProfile::CATEGORIES,
            'parentOptions' => $this->parentOptions(),
        ]);
    }

    public function store(LeadershipProfileRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('photo');
        $data['parent_profile_id'] = $request->input('parent_profile_id') ?: null;
        $data['photo'] = $this->storeImage($request, 'photo', 'leadership-profiles');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_active'] = $request->boolean('is_active');

        LeadershipProfile::create($data);

        return redirect()->route('admin.leadership-profiles.index')->with('success', 'Profile created.');
    }

    public function edit(LeadershipProfile $leadershipProfile): Response
    {
        return Inertia::render('Admin/LeadershipProfiles/Form', [
            'profile' => $this->payload($leadershipProfile),
            'categories' => LeadershipProfile::CATEGORIES,
            'parentOptions' => $this->parentOptions($leadershipProfile),
        ]);
    }

    public function update(LeadershipProfileRequest $request, LeadershipProfile $leadershipProfile): RedirectResponse
    {
        $data = $request->safe()->except('photo');
        $data['parent_profile_id'] = $request->input('parent_profile_id') ?: null;
        $data['photo'] = $this->replaceImage($request, $leadershipProfile, 'photo', 'leadership-profiles');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_active'] = $request->boolean('is_active');

        $leadershipProfile->update($data);

        return redirect()->route('admin.leadership-profiles.index')->with('success', 'Profile updated.');
    }

    public function destroy(LeadershipProfile $leadershipProfile): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $this->deleteStoredPhoto($leadershipProfile->photo);
        $leadershipProfile->delete();

        return back()->with('success', 'Profile deleted.');
    }

    public function clearPhoto(LeadershipProfile $leadershipProfile): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage leadership profiles'), 403);

        $this->deleteStoredPhoto($leadershipProfile->photo);
        $leadershipProfile->update(['photo' => null]);

        return back()->with('success', 'Current photo cleared.');
    }

    public function toggleVisibility(LeadershipProfile $leadershipProfile): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $leadershipProfile->update(['is_active' => ! $leadershipProfile->is_active]);

        return back()->with('success', $leadershipProfile->is_active ? 'Profile is visible.' : 'Profile is hidden.');
    }

    private function payload(LeadershipProfile $profile): array
    {
        return [
            ...$profile->toArray(),
            'parent_name' => $profile->parent?->full_name,
            'category_label' => LeadershipProfile::CATEGORIES[$profile->category] ?? $profile->category,
            'photo_url' => $profile->photo
                ? (str_starts_with($profile->photo, '/') ? $profile->photo : asset("storage/{$profile->photo}"))
                : null,
        ];
    }

    private function deleteStoredPhoto(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/')) {
            Storage::disk('public')->delete($path);
        }
    }

    private function parentOptions(?LeadershipProfile $current = null)
    {
        return LeadershipProfile::ordered()
            ->when($current, fn ($query) => $query->whereKeyNot($current->id))
            ->get(['id', 'category', 'full_name', 'position'])
            ->map(fn (LeadershipProfile $profile) => [
                'id' => $profile->id,
                'category' => $profile->category,
                'label' => "{$profile->full_name} - {$profile->position}",
            ]);
    }
}
