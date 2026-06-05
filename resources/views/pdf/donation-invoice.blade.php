<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $donation->reference_number }} - SHIJUWAZA Donation Payment Instructions</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; color: #173b49; margin: 0; background: #ffffff; }
        .page { padding: 36px; }
        .header { border-bottom: 4px solid #9dd8ea; padding-bottom: 20px; }
        .logo { width: 138px; height: auto; margin-bottom: 14px; }
        .eyebrow { margin: 0 0 6px; color: #245e73; font-size: 11px; font-weight: bold; letter-spacing: .12em; text-transform: uppercase; }
        h1 { margin: 0; font-size: 27px; color: #173b49; }
        .subtitle { margin: 9px 0 0; color: #475569; font-size: 13px; line-height: 1.6; }
        .summary { width: 100%; border-collapse: collapse; margin-top: 24px; }
        .summary td { width: 33.33%; padding: 12px; border: 1px solid #d8f0f7; background: #f3fbfd; }
        .label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; font-weight: bold; }
        .value { display: block; margin-top: 5px; font-size: 15px; color: #173b49; font-weight: bold; }
        .section { margin-top: 22px; border: 1px solid #d8f0f7; border-radius: 12px; overflow: hidden; }
        .section h2 { margin: 0; padding: 13px 16px; background: #9dd8ea; font-size: 16px; color: #173b49; }
        .pay-table { width: 100%; border-collapse: collapse; }
        .pay-table td { padding: 13px 16px; border-top: 1px solid #e2f3f8; font-size: 13px; }
        .pay-table td:first-child { width: 34%; color: #245e73; font-weight: bold; background: #f8fafc; }
        .pay-table td:last-child { color: #173b49; font-weight: bold; }
        .note { margin-top: 18px; padding: 14px 16px; border-radius: 10px; background: #f3fbfd; color: #245e73; font-weight: bold; line-height: 1.6; }
        .footer { margin-top: 18px; padding-top: 14px; border-top: 1px solid #e2f3f8; font-size: 12px; color: #64748b; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <img class="logo" src="{{ $logoPath }}" alt="SHIJUWAZA logo">
            <p class="eyebrow">Donation Payment Instructions</p>
            <h1>Thank you for supporting SHIJUWAZA</h1>
            <p class="subtitle">Use this simple note to complete your manual donation payment.</p>
        </div>

        <table class="summary">
            <tr>
                <td>
                    <span class="label">Reference</span>
                    <span class="value">{{ $donation->reference_number }}</span>
                </td>
                <td>
                    <span class="label">Amount</span>
                    <span class="value">{{ $donation->currency }} {{ $donation->amount }}</span>
                </td>
                <td>
                    <span class="label">Donor</span>
                    <span class="value">{{ $donation->donor_name }}</span>
                </td>
            </tr>
        </table>

        <div class="section">
            <h2>How to Pay</h2>
            <table class="pay-table">
                <tr>
                    <td>Mobile Money</td>
                    <td>{{ trim(($settings['mobile_money_name'] ?: 'To be confirmed').' '.($settings['mobile_money_number'] ?? '')) }}</td>
                </tr>
                <tr>
                    <td>Bank Account</td>
                    <td>{{ $settings['bank_name'] ?: 'To be confirmed' }} - {{ $settings['account_name'] ?: 'SHIJUWAZA' }} - {{ $settings['account_number'] ?: 'To be confirmed' }}</td>
                </tr>
                <tr>
                    <td>Donor Email</td>
                    <td>{{ $donation->donor_email }}</td>
                </tr>
            </table>
        </div>

        <div class="note">
            Please use the donation Account Number or Phone Number when making payment. Include your donation reference {{ $donation->reference_number }} where a reference or description is requested.
        </div>

        <div class="footer">
            SHIJUWAZA contact: {{ $organization['email'] }} | {{ $organization['phone'] }} | {{ $organization['location'] }}<br>
            Generated on {{ now()->format('F j, Y') }}.
        </div>
    </div>
</body>
</html>
