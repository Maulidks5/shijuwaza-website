import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function MemberForm({ member }) {
    const editing = Boolean(member);
    const { data, setData, post, processing, errors } = useForm({
        name: member?.name || '',
        acronym: member?.acronym || '',
        description: member?.description || '',
        logo: null,
        email: member?.email || '',
        phone: member?.phone || '',
        location: member?.location || 'Zanzibar, Tanzania',
        website_url: member?.website_url || '',
        sort_order: member?.sort_order || 0,
        is_active: member?.is_active ?? true,
        account_name: member?.account_name || '',
        account_email: member?.account_email || '',
        account_password: '',
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/members/${member.id}` : '/admin/members', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Member' : 'Create Member'}>
            <form onSubmit={submit} className="grid max-w-5xl gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <section>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Member Organization</p>
                    <h2 className="mt-2 text-2xl font-black text-[#245E73]">Public profile details</h2>
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <Field label="Organization Name" error={errors.name}>
                            <input className={inputClass} value={data.name} onChange={(event) => setData('name', event.target.value)} />
                        </Field>
                        <Field label="Acronym" error={errors.acronym}>
                            <input className={inputClass} value={data.acronym} onChange={(event) => setData('acronym', event.target.value)} placeholder="e.g. JUWAUZA" />
                        </Field>
                    </div>
                    <div className="mt-5">
                        <Field label="Description" error={errors.description}>
                            <textarea rows="5" className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} />
                        </Field>
                    </div>
                    <div className="mt-5 grid gap-5 md:grid-cols-3">
                        <Field label="Logo" error={errors.logo}>
                            <input type="file" accept="image/*" onChange={(event) => setData('logo', event.target.files[0])} />
                            {member?.logo_url ? <img src={member.logo_url} alt="" className="mt-3 h-16 w-16 rounded-xl object-cover" /> : null}
                        </Field>
                        <Field label="Sort Order" error={errors.sort_order}>
                            <input type="number" className={inputClass} value={data.sort_order} onChange={(event) => setData('sort_order', event.target.value)} />
                        </Field>
                        <Toggle label="Visible on website" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                    </div>
                </section>

                <section className="border-t border-slate-100 pt-6">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Contact Information</p>
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <Field label="Public Email" error={errors.email}>
                            <input type="email" className={inputClass} value={data.email} onChange={(event) => setData('email', event.target.value)} />
                        </Field>
                        <Field label="Phone" error={errors.phone}>
                            <input className={inputClass} value={data.phone} onChange={(event) => setData('phone', event.target.value)} />
                        </Field>
                        <Field label="Location" error={errors.location}>
                            <input className={inputClass} value={data.location} onChange={(event) => setData('location', event.target.value)} />
                        </Field>
                        <Field label="Website URL" error={errors.website_url}>
                            <input className={inputClass} value={data.website_url} onChange={(event) => setData('website_url', event.target.value)} />
                        </Field>
                    </div>
                </section>

                <section className="rounded-2xl border border-[#9DD8EA]/10 bg-[#F8FAFC] p-5">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Member Login Account</p>
                    <h2 className="mt-2 text-xl font-black text-[#245E73]">Credentials for member portal</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                        This account will use the Member role and will only access the member portal.
                    </p>
                    <div className="mt-5 grid gap-5 md:grid-cols-3">
                        <Field label="Account Name" error={errors.account_name}>
                            <input className={inputClass} value={data.account_name} onChange={(event) => setData('account_name', event.target.value)} />
                        </Field>
                        <Field label="Login Email" error={errors.account_email}>
                            <input type="email" className={inputClass} value={data.account_email} onChange={(event) => setData('account_email', event.target.value)} />
                        </Field>
                        <Field label={editing ? 'Password (leave blank to keep)' : 'Password'} error={errors.account_password}>
                            <input type="password" className={inputClass} value={data.account_password} onChange={(event) => setData('account_password', event.target.value)} />
                        </Field>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-500">
                        Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                    </p>
                </section>

                <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">Save Member</button>
            </form>
        </AdminLayout>
    );
}
