import { Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Ban, Banknote, CheckCircle2, Copy, CreditCard, Download, Mail, MessageCircle, Phone, Printer, Repeat, Send, Trash2, UserRound } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function DonationShow({ donation, donationSettings = {}, organization = {}, logoUrl = '/images/shijuwaza-logo-cropped.png' }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const isAdmin = roles.includes('Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const updateStatus = (status) => {
        router.patch(`/admin/donations/${donation.id}`, { status }, { preserveScroll: true });
    };
    const sendInstructions = () => {
        router.post(`/admin/donations/${donation.id}/send-instructions`, {}, { preserveScroll: true });
    };
    const paymentMessage = buildPaymentMessage(donation, donationSettings);
    const whatsappUrl = donation.donor_phone
        ? `https://wa.me/${donation.donor_phone.replace(/\D/g, '')}?text=${encodeURIComponent(paymentMessage)}`
        : `https://wa.me/?text=${encodeURIComponent(paymentMessage)}`;
    const copyPaymentMessage = async () => {
        await navigator.clipboard?.writeText(paymentMessage);
    };

    const destroy = () => {
        requestDelete({
            url: `/admin/donations/${donation.id}`,
            title: `Remove donation from ${donation.donor_name}?`,
            description: 'This donation request will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout
            title="Donation Details"
            actions={<Link href="/admin/donations" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-black text-slate-700 shadow-sm hover:bg-slate-50"><ArrowLeft aria-hidden="true" size={18} /> Back</Link>}
        >
            <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Donation Request</p>
                                <h2 className="mt-2 text-3xl font-black text-[#245E73]">{donation.donor_name}</h2>
                                <p className="mt-2 text-2xl font-black text-[#9DD8EA]">{donation.currency} {donation.amount}</p>
                            </div>
                            <StatusBadge active={donation.status === 'confirmed'}>{donation.status}</StatusBadge>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
                        <InfoCard icon={UserRound} label="Donor" value={donation.donor_name} />
                        <InfoCard icon={Mail} label="Email" value={donation.donor_email} href={`mailto:${donation.donor_email}`} />
                        <InfoCard icon={Phone} label="Phone" value={donation.donor_phone || 'Not provided'} href={donation.donor_phone ? `tel:${donation.donor_phone}` : null} />
                        <InfoCard icon={Banknote} label="Amount" value={`${donation.currency} ${donation.amount}`} />
                        <InfoCard icon={Repeat} label="Donation Type" value={donation.donation_type.replaceAll('_', ' ')} />
                        <InfoCard icon={CreditCard} label="Payment Method" value={donation.payment_method.replaceAll('_', ' ')} />
                    </div>

                    <div className="border-t border-slate-100 p-6">
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-slate-500">Donor Message</p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="whitespace-pre-line text-lg leading-8 text-slate-700">{donation.message || 'No message was provided.'}</p>
                        </div>
                    </div>
                </section>

                <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-black text-[#245E73]">Donation Actions</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        Use these actions after confirming the donor intention or payment details.
                    </p>
                    <div className="mt-5 grid gap-2">
                        <button type="button" onClick={sendInstructions} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9DD8EA] px-4 py-3 font-black text-[#173B49] hover:bg-[#7CC8DE]">
                            <Send aria-hidden="true" size={18} />
                            Send Instructions Email
                        </button>
                        <button type="button" onClick={copyPaymentMessage} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50">
                            <Copy aria-hidden="true" size={18} />
                            Copy Payment Message
                        </button>
                        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 font-black text-emerald-800 hover:bg-emerald-100">
                            <MessageCircle aria-hidden="true" size={18} />
                            Send via WhatsApp
                        </a>
                        <button type="button" onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50">
                            <Printer aria-hidden="true" size={18} />
                            Print Invoice
                        </button>
                        <a href={`/admin/donations/${donation.id}/invoice.pdf`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50">
                            <Download aria-hidden="true" size={18} />
                            Download PDF
                        </a>
                        <button type="button" onClick={() => updateStatus('confirmed')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700">
                            <CheckCircle2 aria-hidden="true" size={18} />
                            Confirm Donation
                        </button>
                        <button type="button" onClick={() => updateStatus('cancelled')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9DD8EA] px-4 py-3 font-black text-[#245E73] hover:bg-[#7CC8DE]">
                            <Ban aria-hidden="true" size={18} />
                            Cancel Donation
                        </button>
                        {isAdmin ? (
                            <button type="button" onClick={() => updateStatus('archived')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50">
                                <Archive aria-hidden="true" size={18} />
                                Archive Donation
                            </button>
                        ) : null}
                        {isSuperAdmin ? <IconAction onClick={destroy} icon={Trash2} label={`Remove donation from ${donation.donor_name} permanently`} tone="red" /> : null}
                    </div>
                </aside>
            </div>
            <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:shadow-none">
                <div className="border-b-4 border-[#9DD8EA] bg-white p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                            <img src={logoUrl} alt="SHIJUWAZA logo" className="h-16 w-28 object-contain" />
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#245E73]">Donation Payment Instructions</p>
                                <h2 className="mt-1 text-2xl font-black text-[#173B49]">Thank you for supporting SHIJUWAZA</h2>
                                <p className="mt-2 text-sm font-semibold text-slate-500">Simple payment note for the donor.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-3 p-6 md:grid-cols-3">
                    <InvoiceSummary label="Reference" value={donation.reference_number} />
                    <InvoiceSummary label="Amount" value={`${donation.currency} ${donation.amount}`} />
                    <InvoiceSummary label="Donor" value={donation.donor_name} />
                </div>
                <div className="px-6 pb-6">
                    <div className="overflow-hidden rounded-xl border border-[#D8F0F7]">
                        <h3 className="bg-[#9DD8EA] px-5 py-3 text-lg font-black text-[#173B49]">How to Pay</h3>
                        <div className="divide-y divide-[#E2F3F8]">
                            <InvoiceLine label="Mobile Money" value={`${donationSettings.mobile_money_name || 'To be confirmed'} ${donationSettings.mobile_money_number || ''}`.trim()} />
                            <InvoiceLine label="Bank Account" value={`${donationSettings.bank_name || 'To be confirmed'} - ${donationSettings.account_name || 'SHIJUWAZA'} - ${donationSettings.account_number || 'To be confirmed'}`} />
                            <InvoiceLine label="Donor Email" value={donation.donor_email} />
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-100 p-6">
                    <p className="rounded-xl bg-[#F3FBFD] p-4 font-bold leading-7 text-[#245E73]">
                        Please use the donation <span className="font-black text-[#173B49]">Account Number or Phone Number</span> when making payment. Include reference <span className="font-black text-[#173B49]">{donation.reference_number}</span> where requested.
                    </p>
                    <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                        SHIJUWAZA contact: {organization.email} | {organization.phone} | {organization.location}
                    </p>
                </div>
            </section>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}

function buildPaymentMessage(donation, settings) {
    return [
        `Hello ${donation.donor_name},`,
        'Thank you for supporting SHIJUWAZA.',
        '',
        `Donation Reference: ${donation.reference_number}`,
        `Amount: ${donation.currency} ${donation.amount}`,
        `Donation Type: ${donation.donation_type.replaceAll('_', ' ')}`,
        `Payment Method: ${donation.payment_method.replaceAll('_', ' ')}`,
        '',
        'Mobile Money:',
        `Name: ${settings.mobile_money_name || 'To be confirmed'}`,
        `Number: ${settings.mobile_money_number || 'To be confirmed'}`,
        '',
        'Bank:',
        `Bank: ${settings.bank_name || 'To be confirmed'}`,
        `Account Name: ${settings.account_name || 'SHIJUWAZA'}`,
        `Account Number: ${settings.account_number || 'To be confirmed'}`,
        '',
        `Please use the donation Account Number or Phone Number when making payment. Include reference ${donation.reference_number} where requested.`,
    ].join('\n');
}

function InvoiceSummary({ label, value }) {
    return (
        <div className="rounded-xl border border-[#D8F0F7] bg-[#F3FBFD] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-1 break-words text-lg font-black text-[#173B49]">{value}</p>
        </div>
    );
}

function InvoiceLine({ label, value }) {
    return (
        <div className="grid gap-2 bg-white p-4 sm:grid-cols-[0.32fr_0.68fr]">
            <p className="font-black text-[#245E73]">{label}</p>
            <p className="break-words font-black text-[#173B49]">{value}</p>
        </div>
    );
}

function InfoCard({ icon: Icon, label, value, href }) {
    const content = (
        <>
            <Icon aria-hidden="true" size={20} className="text-[#9DD8EA]" />
            <span>
                <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</span>
                <span className="mt-1 block break-words font-black capitalize text-slate-900">{value}</span>
            </span>
        </>
    );

    if (href) {
        return <a href={href} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#9DD8EA]/30 hover:bg-[#F3FBFD]">{content}</a>;
    }

    return <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">{content}</div>;
}
