<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingRequest;
use App\Models\SiteSetting;
use App\Support\PublicUploads;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    private array $editableKeys = [
        'site_email' => 'contact',
        'site_phone' => 'contact',
        'site_location' => 'contact',
        'organization_email' => 'contact',
        'organization_phone' => 'contact',
        'organization_location' => 'contact',
        'office_hours' => 'contact',
        'donation_bank_name' => 'donation',
        'donation_account_name' => 'donation',
        'donation_account_number' => 'donation',
        'donation_mobile_money_name' => 'donation',
        'donation_mobile_money_number' => 'donation',
        'instagram_url' => 'social',
        'linkedin_url' => 'social',
        'youtube_url' => 'social',
        'facebook_url' => 'social',
        'x_url' => 'social',
    ];

    public function index(): Response
    {
        $settings = SiteSetting::whereIn('key', [...array_keys($this->editableKeys), 'site_logo'])
            ->pluck('value', 'key');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => collect($this->editableKeys)
                ->mapWithKeys(fn ($group, $key) => [$key => $settings[$key] ?? ''])
                ->all(),
            'siteLogoUrl' => PublicUploads::url($settings['site_logo'] ?? null) ?: asset('images/shijuwaza-logo-horizontal.png'),
        ]);
    }

    public function update(SiteSettingRequest $request): RedirectResponse
    {
        foreach ($this->editableKeys as $key => $group) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $request->input("settings.{$key}"), 'group' => $group],
            );
        }

        if ($request->hasFile('site_logo')) {
            $currentLogo = SiteSetting::where('key', 'site_logo')->value('value');
            PublicUploads::delete($currentLogo);

            SiteSetting::updateOrCreate(
                ['key' => 'site_logo'],
                ['value' => PublicUploads::store($request->file('site_logo'), 'settings'), 'group' => 'branding'],
            );
        }

        return back()->with('success', 'Settings updated.');
    }
}
