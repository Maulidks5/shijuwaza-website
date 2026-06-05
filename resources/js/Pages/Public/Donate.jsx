import { useForm } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import StatusNotice from '../../Components/Public/StatusNotice';
import { ArrowRight, Building2, HeartHandshake, Phone, ShieldCheck, UsersRound, WalletCards } from 'lucide-react';

export default function Donate({ donationSettings = {} }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        amount: '',
        currency: 'TZS',
        donation_type: 'one_time',
        payment_method: 'mobile_money',
        message: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/donate', { onSuccess: () => reset('donor_name', 'donor_email', 'donor_phone', 'amount', 'message') });
    };

    return (
        <PublicLayout>
            <SeoHead title="Donate" description="Support SHIJUWAZA's work to expand accessibility, opportunity, dignity, and disability inclusion across Zanzibar." />
            <PageHero eyebrow="Donate" title="Support OPD-led inclusion and disability rights in Zanzibar.">
                Your donation intention helps SHIJUWAZA coordinate advocacy, training, community engagement, and organizational accountability.
            </PageHero>
            <section className="bg-[#F8FAFC] py-20">
                <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="grid gap-5 self-start">
                        <article className="overflow-hidden rounded-2xl border border-[#9DD8EA]/45 bg-white shadow-sm">
                            <div className="bg-[#9DD8EA] p-7 text-[#173B49]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/55">
                                    <HeartHandshake aria-hidden="true" size={25} />
                                </div>
                                <h2 className="mt-5 text-3xl font-black leading-tight">Your support expands inclusion across Zanzibar.</h2>
                                <p className="mt-4 leading-8 text-[#245E73]">
                                    For over a decade, SHIJUWAZA has worked to advance economic empowerment, access to essential services, and positive attitudes toward disability.
                                </p>
                            </div>
                            <div className="grid gap-4 p-7">
                                <p className="leading-8 text-slate-700">
                                    As Zanzibar grows, the number of persons with disabilities and the challenges they face continue to increase. We are seeking committed partners to help expand inclusion and improve access to rights for persons with disabilities across Zanzibar.
                                </p>
                                <div className="grid gap-3">
                                    <SupportPoint icon={UsersRound}>Economic empowerment and OPD-led advocacy</SupportPoint>
                                    <SupportPoint icon={ShieldCheck}>Access to essential services and disability rights</SupportPoint>
                                    <SupportPoint icon={HeartHandshake}>Community engagement and inclusive partnerships</SupportPoint>
                                </div>
                                <a href="#donation-form" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173B49] px-5 py-3 text-sm font-black text-white transition hover:bg-[#245E73]">
                                    Donate Now
                                    <ArrowRight aria-hidden="true" size={16} />
                                </a>
                            </div>
                        </article>
                        <article className="overflow-hidden rounded-2xl border border-[#9DD8EA]/45 bg-white shadow-sm">
                            <div className="flex items-center gap-3 border-b border-[#9DD8EA]/35 bg-[#F3FBFD] p-5">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#9DD8EA] text-[#173B49]">
                                    <WalletCards aria-hidden="true" size={22} />
                                </div>
                                <div>
                                    <p className="eyebrow">Payment references</p>
                                    <h3 className="mt-1 text-xl font-black text-[#173B49]">Official contribution details</h3>
                                </div>
                            </div>
                            <div className="grid gap-3 p-5">
                                <PaymentReference icon={Building2} label="Bank" value={donationSettings.bank_name || 'To be confirmed'} />
                                <PaymentReference icon={ShieldCheck} label="Account name" value={donationSettings.account_name || 'SHIJUWAZA'} />
                                <PaymentReference icon={WalletCards} label="Account number" value={donationSettings.account_number || 'To be confirmed'} />
                                <PaymentReference icon={Phone} label="Mobile money" value={`${donationSettings.mobile_money_name || 'To be confirmed'} ${donationSettings.mobile_money_number || ''}`.trim()} />
                                <p className="mt-2 rounded-xl bg-[#9DD8EA]/25 p-4 text-sm font-bold leading-6 text-[#245E73]">
                                    Submit your donation intention first. Our team will send clear payment instructions to your email.
                                </p>
                            </div>
                        </article>
                    </div>
                    <form id="donation-form" onSubmit={submit} className="surface-card scroll-mt-32 grid gap-4 rounded-2xl bg-white p-7 lg:sticky lg:top-28">
                        <StatusNotice />
                        <div className="border-b border-slate-100 pb-4">
                            <p className="eyebrow">Donation details</p>
                            <h2 className="mt-2 text-2xl font-black text-[#245E73]">Submit your donation intention</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Fill in the details below and our team will follow up with payment instructions.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input label="Donor name" autoComplete="name" value={data.donor_name} error={errors.donor_name} onChange={(value) => setData('donor_name', value)} />
                            <Input label="Donor email" type="email" autoComplete="email" value={data.donor_email} error={errors.donor_email} onChange={(value) => setData('donor_email', value)} />
                            <Input label="Phone" type="tel" autoComplete="tel" value={data.donor_phone} error={errors.donor_phone} onChange={(value) => setData('donor_phone', value)} />
                            <Input label="Amount" type="number" min="1" value={data.amount} error={errors.amount} onChange={(value) => setData('amount', value)} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Select label="Currency" value={data.currency} error={errors.currency} onChange={(value) => setData('currency', value)} options={['TZS', 'USD']} />
                            <Select label="Donation type" value={data.donation_type} error={errors.donation_type} onChange={(value) => setData('donation_type', value)} options={['one_time', 'monthly']} />
                            <Select label="Payment method" value={data.payment_method} error={errors.payment_method} onChange={(value) => setData('payment_method', value)} options={['manual', 'bank_transfer', 'mobile_money']} />
                        </div>
                        <label className="grid gap-2">
                            <span className="text-sm font-black text-slate-700">Message</span>
                            <textarea rows="5" className="rounded-lg border border-slate-200 px-4 py-3" value={data.message} onChange={(event) => setData('message', event.target.value)} aria-invalid={errors.message ? 'true' : 'false'} />
                            {errors.message ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.message}</span> : null}
                        </label>
                        <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">{processing ? 'Submitting...' : 'Donate Now'}</button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}

function PaymentReference({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F3FBFD] text-[#245E73]">
                <Icon aria-hidden="true" size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
                <p className="mt-1 break-words font-black text-[#173B49]">{value}</p>
            </div>
        </div>
    );
}

function SupportPoint({ icon: Icon, children }) {
    return (
        <p className="flex items-start gap-3 rounded-xl bg-[#F3FBFD] p-4 font-bold leading-6 text-[#245E73]">
            <Icon aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-[#173B49]" />
            <span>{children}</span>
        </p>
    );
}

function Input({ label, type = 'text', value, error, onChange, autoComplete, min }) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{label}</span>
            <input type={type} min={min} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={error ? 'true' : 'false'} className="rounded-lg border border-slate-200 px-4 py-3" />
            {error ? <span role="alert" className="text-sm font-semibold text-red-600">{error}</span> : null}
        </label>
    );
}

function Select({ label, value, error, onChange, options }) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{label}</span>
            <select value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={error ? 'true' : 'false'} className="rounded-lg border border-slate-200 px-4 py-3">
                {options.map((option) => <option key={option} value={option}>{formatOption(option)}</option>)}
            </select>
            {error ? <span role="alert" className="text-sm font-semibold text-red-600">{error}</span> : null}
        </label>
    );
}

function formatOption(option) {
    return option.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
