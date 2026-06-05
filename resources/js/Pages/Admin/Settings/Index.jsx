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

export default function SettingsIndex({ settings = {} }) {
    const { data, setData, patch, processing, errors } = useForm({ settings });

    const submit = (event) => {
        event.preventDefault();
        patch('/admin/settings');
    };

    return (
        <AdminLayout title="Settings">
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
