import { useForm, usePage } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import StatusNotice from '../../Components/Public/StatusNotice';
import { Mail, MapPin, Phone, Clock, ShieldAlert } from 'lucide-react';

export default function Contact() {
    const { siteSettings = {} } = usePage().props;
    const contactItems = [
        [Mail, siteSettings.organization_email || siteSettings.email || 'info@shijuwaza.or.tz'],
        [Phone, siteSettings.organization_phone || siteSettings.phone || '+255 000 000 000'],
        [MapPin, siteSettings.organization_location || siteSettings.location || 'Zanzibar, Tanzania'],
        [Clock, siteSettings.office_hours || 'Monday - Friday'],
    ];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/contact', { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <SeoHead title="Contact" description="Contact SHIJUWAZA for disability inclusion partnerships, programs, media, member coordination, and organizational support." />
            <PageHero eyebrow="Contact" title="Talk to SHIJUWAZA about inclusion, advocacy, and partnership.">
                Send a clear message to our team and we will route it to the right program or leadership contact.
            </PageHero>
            <section className="bg-[#F8FAFC] py-20">
                <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="eyebrow">Reach us</p>
                        <h1 className="section-title mt-3">Work with us to build a more inclusive Zanzibar</h1>
                        <p className="section-copy mt-5">Use the form or contact details below. The form is accessible, labeled, and designed for clear follow-up.</p>
                        <a href="/whistle-blowers" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173B49] px-5 py-3 text-sm font-black text-white transition hover:bg-[#245E73]">
                            <ShieldAlert aria-hidden="true" size={17} />
                            Confidential report / Whistle Blowers
                        </a>
                        <div className="mt-8 grid gap-4">
                            {contactItems.map(([Icon, value]) => (
                                <div key={value} className="flex gap-3 rounded-2xl bg-white p-5 shadow-sm">
                                    <Icon aria-hidden="true" className="mt-1 shrink-0 text-[#5BAFCB]" size={22} />
                                    <p className="font-bold leading-7 text-slate-700">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={submit} className="surface-card grid gap-4 rounded-2xl bg-white p-7">
                        <StatusNotice />
                        {['name', 'email', 'phone', 'subject'].map((field) => (
                            <label key={field} className="grid gap-2">
                                <span className="text-sm font-black capitalize text-slate-700">{field}</span>
                                <input
                                    value={data[field]}
                                    onChange={(event) => setData(field, event.target.value)}
                                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                                    autoComplete={field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'name' ? 'name' : undefined}
                                    aria-invalid={errors[field] ? 'true' : 'false'}
                                    className="rounded-lg border border-slate-200 px-4 py-3"
                                />
                                {errors[field] ? <span role="alert" className="text-sm font-semibold text-red-600">{errors[field]}</span> : null}
                            </label>
                        ))}
                        <label className="grid gap-2">
                            <span className="text-sm font-black text-slate-700">Message</span>
                            <textarea value={data.message} onChange={(event) => setData('message', event.target.value)} rows="6" aria-invalid={errors.message ? 'true' : 'false'} className="rounded-lg border border-slate-200 px-4 py-3" />
                            {errors.message ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.message}</span> : null}
                        </label>
                        <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">{processing ? 'Sending...' : 'Send Message'}</button>
                    </form>
                </div>
            </section>
            <section className="bg-white py-16">
                <div className="section-shell">
                    <div className="rounded-2xl border border-[#9DD8EA]/35 bg-[#F3FBFD] p-8">
                        <p className="eyebrow">Office</p>
                        <h2 className="mt-3 text-3xl font-black text-[#245E73]">{siteSettings.organization_location || siteSettings.location || 'Zanzibar, Tanzania'}</h2>
                        <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                            Contact SHIJUWAZA before visiting so the right team member can be available to support your inquiry.
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
