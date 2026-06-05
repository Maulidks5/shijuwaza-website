import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function ProgramForm({ program }) {
    const editing = Boolean(program);
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = permissions.includes('manage visibility');
    const { data, setData, post, processing, errors } = useForm({
        title: program?.title || '',
        slug: program?.slug || '',
        short_description: program?.short_description || '',
        description: program?.description || '',
        icon: program?.icon || 'Landmark',
        image: null,
        sort_order: program?.sort_order || 0,
        is_featured: program?.is_featured ?? false,
        is_active: program?.is_active ?? true,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/programs/${program.id}` : '/admin/programs', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Program' : 'Create Program'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Title" error={errors.title}><input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} /></Field>
                <Field label="Short Description" error={errors.short_description}><textarea rows="3" className={inputClass} value={data.short_description} onChange={(event) => setData('short_description', event.target.value)} /></Field>
                <Field label="Full Description" error={errors.description}><textarea rows="7" className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} /></Field>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Image" error={errors.image}><input type="file" accept="image/*" onChange={(event) => setData('image', event.target.files[0])} /></Field>
                    <Toggle label="Featured" checked={data.is_featured} onChange={(value) => setData('is_featured', value)} />
                </div>
                {canManageVisibility ? <Toggle label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} /> : null}
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Program</button>
            </form>
        </AdminLayout>
    );
}
