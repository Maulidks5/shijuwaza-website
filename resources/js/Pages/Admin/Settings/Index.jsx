import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

const labels = {
    site_email: 'Email',
    site_phone: 'Phone',
    site_location: 'Location',
    organization_email: 'Organization Email',
    organization_phone: 'Organization Phone',
    organization_location: 'Organization Location',
    office_hours: 'Office Hours',
    donation_bank_name: 'Donation Bank Name',
    donation_account_name: 'Donation Account Name',
    donation_account_number: 'Donation Account Number',
    donation_mobile_money_name: 'Donation Mobile Money Name',
    donation_mobile_money_number: 'Donation Mobile Money Number',
    instagram_url: 'Instagram URL',
    linkedin_url: 'LinkedIn URL',
    youtube_url: 'YouTube URL',
    facebook_url: 'Facebook URL',
};

export default function SettingsIndex({ settings = {}, siteLogoUrl = null }) {
    const { data, setData, post, processing, errors } = useForm({
        settings,
        site_logo: null,
        _method: 'patch',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            onSuccess: () => setData('site_logo', null),
        });
    };

    return (
        <AdminLayout title="Settings">
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <section className="rounded-xl border border-[#9DD8EA]/35 bg-[#F8FAFC] p-5">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">Branding</p>
                    <h2 className="mt-2 text-2xl font-black text-[#245E73]">Organization logo</h2>
                    <div className="mt-5 grid gap-5 md:grid-cols-[0.4fr_0.6fr] md:items-center">
                        <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-[#5BAFCB]/35 bg-white/40 p-4">
                            {siteLogoUrl ? (
                                <img src={siteLogoUrl} alt="Current organization logo" className="max-h-32 max-w-full object-contain mix-blend-multiply" />
                            ) : (
                                <p className="text-sm font-semibold text-slate-500">No logo uploaded yet.</p>
                            )}
                        </div>
                        <Field label="Upload New Logo" error={errors.site_logo}>
                            <input type="file" accept="image/*" onChange={(event) => setData('site_logo', event.target.files[0] || null)} />
                            <p className="text-sm font-semibold text-slate-500">PNG, JPG, JPEG, or WEBP. Maximum 4MB.</p>
                        </Field>
                    </div>
                </section>

                <div className="grid gap-5 md:grid-cols-2">
                    {Object.entries(labels).map(([key, label]) => (
                        <Field key={key} label={label} error={errors[`settings.${key}`]}>
                            <input
                                className={inputClass}
                                value={data.settings[key] || ''}
                                onChange={(event) => setData('settings', { ...data.settings, [key]: event.target.value })}
                            />
                        </Field>
                    ))}
                </div>
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Settings</button>
            </form>
        </AdminLayout>
    );
}
