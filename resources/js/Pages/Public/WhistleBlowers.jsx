import { useForm } from '@inertiajs/react';
import { AlertTriangle, LockKeyhole, ShieldCheck } from 'lucide-react';
import PageHero from '../../Components/Public/PageHero';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/Public/SeoHead';
import StatusNotice from '../../Components/Public/StatusNotice';

const concernTypes = [
    ['abuse_or_violence', 'Abuse or violence'],
    ['discrimination', 'Discrimination'],
    ['harassment', 'Harassment'],
    ['accessibility_concern', 'Accessibility concern'],
    ['other', 'Other concern'],
];

export default function WhistleBlowers() {
    const { data, setData, post, processing, errors, reset } = useForm({
        concern_type: '',
        message: '',
        location: '',
        contact_details: '',
        wants_anonymous: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/whistle-blowers', { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <SeoHead
                title="Sema na SHIJUWAZA / Whistle Blowers"
                description="Submit a confidential report to SHIJUWAZA about abuse, violence, discrimination, harassment, accessibility concerns, or other sensitive issues."
            />
            <PageHero eyebrow="Confidential reporting" title="Sema na SHIJUWAZA / Whistle Blowers">
                Use this simple and confidential form to report abuse, violence, discrimination, harassment, or other concerns.
            </PageHero>

            <section className="bg-[#F3FBFD] py-14 lg:py-16">
                <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                    <div className="rounded-2xl border border-[#9DD8EA]/45 bg-white p-7 shadow-sm">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9DD8EA] text-[#173B49]">
                            <LockKeyhole aria-hidden="true" size={24} />
                        </div>
                        <h1 className="mt-5 text-3xl font-black leading-tight text-[#173B49]">Your report will be handled confidentially</h1>
                        <p className="mt-4 leading-8 text-slate-700">
                            You may submit this form without sharing your name or contact details. Please share only what you feel safe to share.
                        </p>
                        <div className="mt-6 grid gap-3">
                            <InfoNote icon={ShieldCheck}>Contact details are optional.</InfoNote>
                            <InfoNote icon={AlertTriangle}>If this is an emergency, contact trusted local emergency support immediately.</InfoNote>
                        </div>
                    </div>

                    <form onSubmit={submit} className="surface-card grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:p-7">
                        <StatusNotice />

                        <label className="grid gap-2">
                            <span className="text-sm font-black text-slate-700">What is this about?</span>
                            <select
                                value={data.concern_type}
                                onChange={(event) => setData('concern_type', event.target.value)}
                                aria-invalid={errors.concern_type ? 'true' : 'false'}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-[#7CC8DE] focus:outline-none focus:ring-2 focus:ring-[#9DD8EA]/45"
                            >
                                <option value="">Select a concern</option>
                                {concernTypes.map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.concern_type ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.concern_type}</span> : null}
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-black text-slate-700">Tell us what happened</span>
                            <textarea
                                value={data.message}
                                onChange={(event) => setData('message', event.target.value)}
                                rows="7"
                                aria-invalid={errors.message ? 'true' : 'false'}
                                className="rounded-lg border border-slate-200 px-4 py-3 text-slate-800 focus:border-[#7CC8DE] focus:outline-none focus:ring-2 focus:ring-[#9DD8EA]/45"
                                placeholder="Share the key details in your own words."
                            />
                            {errors.message ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.message}</span> : null}
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2">
                                <span className="text-sm font-black text-slate-700">Where did it happen? <span className="font-semibold text-slate-500">(optional)</span></span>
                                <input
                                    value={data.location}
                                    onChange={(event) => setData('location', event.target.value)}
                                    type="text"
                                    aria-invalid={errors.location ? 'true' : 'false'}
                                    className="rounded-lg border border-slate-200 px-4 py-3 text-slate-800 focus:border-[#7CC8DE] focus:outline-none focus:ring-2 focus:ring-[#9DD8EA]/45"
                                />
                                {errors.location ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.location}</span> : null}
                            </label>

                            <label className="grid gap-2">
                                <span className="text-sm font-black text-slate-700">Your contact <span className="font-semibold text-slate-500">(optional)</span></span>
                                <input
                                    value={data.contact_details}
                                    onChange={(event) => setData('contact_details', event.target.value)}
                                    type="text"
                                    aria-invalid={errors.contact_details ? 'true' : 'false'}
                                    className="rounded-lg border border-slate-200 px-4 py-3 text-slate-800 focus:border-[#7CC8DE] focus:outline-none focus:ring-2 focus:ring-[#9DD8EA]/45"
                                    placeholder="Phone or email"
                                />
                                {errors.contact_details ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.contact_details}</span> : null}
                            </label>
                        </div>

                        <label className="flex items-start gap-3 rounded-xl border border-[#9DD8EA]/45 bg-[#F3FBFD] p-4">
                            <input
                                checked={data.wants_anonymous}
                                onChange={(event) => setData('wants_anonymous', event.target.checked)}
                                type="checkbox"
                                className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5BAFCB] focus:ring-[#9DD8EA]"
                            />
                            <span>
                                <span className="block font-black text-[#173B49]">I want to remain anonymous</span>
                                <span className="mt-1 block text-sm leading-6 text-slate-600">Leave contact details empty if you do not want follow-up.</span>
                            </span>
                        </label>

                        <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">
                            {processing ? 'Submitting...' : 'Submit Confidential Report'}
                        </button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}

function InfoNote({ icon: Icon, children }) {
    return (
        <p className="flex gap-3 rounded-xl border border-[#9DD8EA]/35 bg-[#F3FBFD] p-4 font-bold leading-7 text-[#245E73]">
            <Icon aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-[#173B49]" />
            <span>{children}</span>
        </p>
    );
}
