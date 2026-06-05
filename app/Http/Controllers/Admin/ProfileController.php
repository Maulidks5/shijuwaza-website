<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfilePasswordRequest;
use App\Http\Requests\Admin\ProfileUpdateRequest;
use App\Support\PublicUploads;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(): Response
    {
        $user = request()->user()->load('roles:id,name');

        return Inertia::render('Admin/Profile/Show', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'avatar_url' => PublicUploads::url($user->avatar),
                'role' => $user->roles->first()?->name,
                'joined_at' => $user->created_at?->format('F j, Y'),
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->safe()->except('avatar');

        if ($request->hasFile('avatar')) {
            PublicUploads::delete($user->avatar);

            $data['avatar'] = PublicUploads::store($request->file('avatar'), 'avatars');
        }

        $user->update($data);

        return back()->with('success', 'Profile updated.');
    }

    public function updatePassword(ProfilePasswordRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => $request->validated('password'),
        ]);

        return back()->with('success', 'Password changed.');
    }
}
