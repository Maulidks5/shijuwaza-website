<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>SHIJUWAZA Donation Payment Instructions</title>
</head>
<body style="margin:0;background:#f3fbfd;font-family:Arial,sans-serif;color:#173b49;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3fbfd;padding:24px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #d8f0f7;border-radius:18px;overflow:hidden;">
                    <tr>
                        <td style="background:#9dd8ea;padding:24px;">
                            <img src="{{ $logoUrl }}" alt="SHIJUWAZA logo" style="width:150px;max-width:100%;height:auto;display:block;margin-bottom:16px;">
                            <h1 style="margin:0;font-size:26px;line-height:1.2;color:#173b49;">Donation Payment Instructions</h1>
                            <p style="margin:10px 0 0;color:#245e73;font-size:15px;line-height:1.6;">Thank you for supporting disability inclusion and OPD-led work in Zanzibar.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px;">
                            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hello {{ $donation->donor_name }},</p>
                            <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">Please use the details below to complete your manual donation payment.</p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 22px;">
                                @foreach([
                                    'Donation Reference' => $donation->reference_number,
                                    'Amount' => $donation->currency.' '.$donation->amount,
                                    'Donation Type' => str_replace('_', ' ', $donation->donation_type),
                                    'Preferred Method' => str_replace('_', ' ', $donation->payment_method),
                                    'Bank' => $settings['bank_name'] ?: 'To be confirmed',
                                    'Account Name' => $settings['account_name'] ?: 'SHIJUWAZA',
                                    'Account Number' => $settings['account_number'] ?: 'To be confirmed',
                                    'Mobile Money' => trim(($settings['mobile_money_name'] ?: 'To be confirmed').' '.($settings['mobile_money_number'] ?? '')),
                                ] as $label => $value)
                                    <tr>
                                        <td style="padding:11px 12px;border:1px solid #e2f3f8;background:#f8fafc;font-size:13px;font-weight:bold;color:#245e73;">{{ $label }}</td>
                                        <td style="padding:11px 12px;border:1px solid #e2f3f8;font-size:14px;font-weight:bold;color:#173b49;">{{ $value }}</td>
                                    </tr>
                                @endforeach
                            </table>

                            <p style="margin:0 0 14px;padding:14px;border-radius:12px;background:#f3fbfd;font-size:14px;line-height:1.6;color:#245e73;">
                                Please use the donation Account Number or Phone Number when making payment. Include your donation reference <strong>{{ $donation->reference_number }}</strong> where a reference or description is requested.
                            </p>
                            <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">If you have any questions, reply to this email or contact SHIJUWAZA for support.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
