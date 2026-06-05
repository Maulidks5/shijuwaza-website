<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\DonationRequest;
use App\Models\Donation;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Public/Donate', [
            'donationSettings' => $this->donationSettings(),
        ]);
    }

    public function store(DonationRequest $request): RedirectResponse
    {
        Donation::create([
            ...$request->validated(),
            'status' => 'pending',
        ]);

        return back()->with('success', 'Thank you. Your donation intention has been received, and our team will follow up with payment instructions.');
    }

    private function donationSettings(): array
    {
        $settings = SiteSetting::pluck('value', 'key')->all();

        return [
            'bank_name' => $settings['donation_bank_name'] ?? '',
            'account_name' => $settings['donation_account_name'] ?? '',
            'account_number' => $settings['donation_account_number'] ?? '',
            'mobile_money_name' => $settings['donation_mobile_money_name'] ?? '',
            'mobile_money_number' => $settings['donation_mobile_money_number'] ?? '',
        ];
    }
}
