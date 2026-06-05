import { Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function MediaAlbumForm({ album }) {
    const editing = Boolean(album);
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = permissions.includes('manage visibility');
    const { data, setData, post, processing, errors } = useForm({
        name: album?.name || '',
        slug: album?.slug || '',
        description: album?.description || '',
        cover_image: null,
        sort_order: album?.sort_order || 0,
        is_active: album?.is_active ?? true,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/media-albums/${album.id}` : '/admin/media-albums', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Gallery Album' : 'Create Gallery Album'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Album Name" error={errors.name}>
                    <input className={inputClass} value={data.name} onChange={(event) => setData('name', event.target.value)} />
                </Field>

                <Field label="Description" error={errors.description}>
                    <textarea rows="4" className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} />
                </Field>

                <Field label="Cover Image" error={errors.cover_image}>
                    <input type="file" accept="image/*" onChange={(event) => setData('cover_image', event.target.files[0])} />
                </Field>

                {canManageVisibility ? <Toggle label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} /> : null}

                <div className="flex flex-wrap gap-3">
                    <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Album</button>
                    <Link href="/admin/media-albums" className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-700">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
