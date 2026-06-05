<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\MemberProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(): Response
    {
        $user = request()->user();
        $member = $user->memberOrganization;

        if (! $member) {
            return Inertia::render('Member/Profile/Show', [
                'profile' => null,
                'setupRequired' => true,
            ]);
        }

        return Inertia::render('Member/Profile/Show', [
            'profile' => [
                'name' => $member->name,
                'acronym' => $member->acronym,
                'description' => $member->description,
                'logo_url' => $member->logo ? (str_starts_with($member->logo, '/') ? $member->logo : asset("storage/{$member->logo}")) : null,
                'email' => $member->email,
                'phone' => $member->phone,
                'location' => $member->location,
                'website_url' => $member->website_url,
                'public_url' => route('members.show', $member->slug),
                'account_name' => $user->name,
                'account_email' => $user->email,
            ],
        ]);
    }

    public function update(MemberProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $member = $user->memberOrganization;
        $data = $request->validated();

        DB::transaction(function () use ($request, $user, $member, $data): void {
            $logo = $member->logo;

            if ($request->hasFile('logo')) {
                if ($logo && ! str_starts_with($logo, '/')) {
                    Storage::disk('public')->delete($logo);
                }

                $logo = $request->file('logo')->store('members', 'public');
            }

            $member->update([
                'name' => $data['name'],
                'acronym' => $data['acronym'] ?? null,
                'description' => $data['description'] ?? null,
                'logo' => $logo,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'location' => $data['location'] ?? null,
                'website_url' => $data['website_url'] ?? null,
            ]);

            $user->fill([
                'name' => $data['account_name'],
                'email' => $data['account_email'],
            ]);

            if (filled($data['password'] ?? null)) {
                $user->password = $data['password'];
            }

            $user->save();
        });

        return back()->with('success', 'Profile information updated.');
    }
}
