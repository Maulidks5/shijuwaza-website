<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\DonationPaymentInstructionsMail;
use App\Models\Donation;
use App\Models\SiteSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');

        return Inertia::render('Admin/Donations/Index', [
            'donations' => Donation::query()
                ->when($status !== 'all', fn ($query) => $query->where('status', $status))
                ->latest()
                ->get(),
            'filters' => ['status' => $status],
        ]);
    }

    public function update(Request $request, Donation $donation): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'instructions_sent', 'confirmed', 'cancelled', 'archived'])],
        ]);

        $donation->update($data);

        return back()->with('success', 'Donation status updated.');
    }

    public function show(Donation $donation): Response
    {
        $donation->ensureReferenceNumber();

        return Inertia::render('Admin/Donations/Show', [
            'donation' => $donation,
            'donationSettings' => $this->donationSettings(),
            'organization' => $this->organizationSettings(),
            'logoUrl' => asset('images/shijuwaza-logo-cropped.png'),
        ]);
    }

    public function sendInstructions(Donation $donation): RedirectResponse
    {
        $donation->ensureReferenceNumber();
        $settings = $this->donationSettings();

        try {
            Mail::to($donation->donor_email)->send(new DonationPaymentInstructionsMail($donation, $settings));
        } catch (\Throwable $exception) {
            return back()->with('error', 'Payment instructions were not emailed. Please check mail settings or use the manual copy/WhatsApp option.');
        }

        $donation->update([
            'status' => 'instructions_sent',
            'instructions_sent_at' => now(),
        ]);

        return back()->with('success', 'Payment instructions were sent to the donor email.');
    }

    public function downloadInvoice(Donation $donation)
    {
        $donation->ensureReferenceNumber();

        $pdf = Pdf::loadView('pdf.donation-invoice', [
            'donation' => $donation,
            'settings' => $this->donationSettings(),
            'organization' => $this->organizationSettings(),
            'logoPath' => public_path('images/shijuwaza-logo-cropped.png'),
        ])->setPaper('a4');

        return $pdf->download("{$donation->reference_number}-invoice.pdf");
    }

    public function printInvoice(Donation $donation)
    {
        $donation->ensureReferenceNumber();

        return view('pdf.donation-invoice', [
            'donation' => $donation,
            'settings' => $this->donationSettings(),
            'organization' => $this->organizationSettings(),
            'logoPath' => public_path('images/shijuwaza-logo-cropped.png'),
        ]);
    }

    public function destroy(Donation $donation): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $donation->delete();

        return back()->with('success', 'Donation request deleted.');
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

    private function organizationSettings(): array
    {
        $settings = SiteSetting::pluck('value', 'key')->all();

        return [
            'email' => $settings['organization_email'] ?? $settings['site_email'] ?? 'info@shijuwaza.or.tz',
            'phone' => $settings['organization_phone'] ?? $settings['site_phone'] ?? '+255 000 000 000',
            'location' => $settings['organization_location'] ?? $settings['site_location'] ?? 'Zanzibar, Tanzania',
        ];
    }
}
