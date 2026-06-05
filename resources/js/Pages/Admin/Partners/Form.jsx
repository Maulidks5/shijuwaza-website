import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function PartnerForm({ partner }) {
    const editing = Boolean(partner);
    const { data, setData, post, processing, errors } = useForm({
        name: partner?.name || '',
        logo: null,
        website_url: partner?.website_url || '',
        description: partner?.description || '',
        sort_order: partner?.sort_order || 0,
        is_active: partner?.is_active ?? true,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/partners/${partner.id}` : '/admin/partners', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Partner' : 'Create Partner'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Name" error={errors.name}><input className={inputClass} value={data.name} onChange={(event) => setData('name', event.target.value)} /></Field>
                    <Field label="Website URL" error={errors.website_url}><input className={inputClass} value={data.website_url} onChange={(event) => setData('website_url', event.target.value)} /></Field>
                </div>
                <Field label="Description" error={errors.description}><textarea rows="5" className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} /></Field>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Logo" error={errors.logo}>
                        <input type="file" accept="image/*" onChange={(event) => setData('logo', event.target.files[0])} />
                        {partner?.logo_url ? (
                            <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#9DD8EA]/10 bg-[#F3FBFD] p-3">
                                <img src={partner.logo_url} alt="" className="h-14 w-24 rounded-lg bg-white object-contain p-2" />
                                <span className="text-sm font-bold text-slate-500">Current logo</span>
                            </div>
                        ) : null}
                    </Field>
                    <Toggle label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                </div>
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Partner</button>
            </form>
        </AdminLayout>
    );
}
