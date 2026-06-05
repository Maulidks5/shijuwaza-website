<?php

namespace App\Mail;

use App\Models\Donation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonationPaymentInstructionsMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public Donation $donation,
        public array $settings,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your SHIJUWAZA Donation Payment Instructions',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.donation-payment-instructions',
            with: [
                'donation' => $this->donation,
                'settings' => $this->settings,
                'logoUrl' => asset('images/shijuwaza-logo-cropped.png'),
            ],
        );
    }
}
