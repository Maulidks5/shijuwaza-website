import { useForm } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import StatusNotice from '../../Components/Public/StatusNotice';

const partnershipTypes = ['funding', 'training', 'advocacy', 'research', 'media', 'technical_support', 'other'];

export default function PartnerWithUs() {
    const { data, setData, post, processing, errors, reset } = useForm({
        organization_name: '',
        contact_person: '',
        email: '',
        phone: '',
        partnership_type: 'funding',
        message: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/partner-with-us', { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <SeoHead title="Partner With Us" description="Partner with SHIJUWAZA through funding, training, advocacy, research, media, or technical support for disability inclusion." />
            <PageHero eyebrow="Partner With Us" title="Collaborate with an OPD-led federation trusted across Zanzibar.">
                SHIJUWAZA welcomes funding, training, advocacy, research, media, and technical partnerships that strengthen disability-inclusive development.
            </PageHero>
            <section className="bg-white py-20">
                <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <p className="eyebrow">Partnership pathways</p>
                        <h2 className="section-title mt-3">Bring resources, expertise, or platforms into inclusive action.</h2>
                        <div className="mt-8 grid gap-3">
                            {partnershipTypes.slice(0, 6).map((type) => (
                                <div key={type} className="rounded-2xl bg-[#F8FAFC] p-5 font-black capitalize text-[#245E73]">{type.replaceAll('_', ' ')}</div>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={submit} className="surface-card grid gap-4 rounded-2xl bg-white p-7">
                        <StatusNotice />
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input label="Organization name" value={data.organization_name} error={errors.organization_name} onChange={(value) => setData('organization_name', value)} />
                            <Input label="Contact person" value={data.contact_person} error={errors.contact_person} onChange={(value) => setData('contact_person', value)} />
                            <Input label="Email" type="email" value={data.email} error={errors.email} onChange={(value) => setData('email', value)} />
                            <Input label="Phone" value={data.phone} error={errors.phone} onChange={(value) => setData('phone', value)} />
                        </div>
                        <label className="grid gap-2">
                            <span className="text-sm font-black text-slate-700">Partnership type</span>
                            <select value={data.partnership_type} onChange={(event) => setData('partnership_type', event.target.value)} aria-invalid={errors.partnership_type ? 'true' : 'false'} className="rounded-lg border border-slate-200 px-4 py-3">
                                {partnershipTypes.map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}
                            </select>
                            {errors.partnership_type ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.partnership_type}</span> : null}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm font-black text-slate-700">Message</span>
                            <textarea rows="6" value={data.message} onChange={(event) => setData('message', event.target.value)} aria-invalid={errors.message ? 'true' : 'false'} className="rounded-lg border border-slate-200 px-4 py-3" />
                            {errors.message ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.message}</span> : null}
                        </label>
                        <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">Submit Partnership Request</button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}

function Input({ label, type = 'text', value, error, onChange }) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{label}</span>
            <input type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={error ? 'true' : 'false'} className="rounded-lg border border-slate-200 px-4 py-3" />
            {error ? <span role="alert" className="text-sm font-semibold text-red-600">{error}</span> : null}
        </label>
    );
}
