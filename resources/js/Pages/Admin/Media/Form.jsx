import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function MediaForm({ item, albums = [] }) {
    const editing = Boolean(item);
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = permissions.includes('manage visibility');
    const { data, setData, post, processing, errors } = useForm({
        title: item?.title || '',
        media_album_id: item?.media_album_id || '',
        type: item?.type || 'image',
        image: null,
        video_url: item?.video_url || '',
        description: item?.description || '',
        sort_order: item?.sort_order || 0,
        is_featured: item?.is_featured ?? false,
        is_active: item?.is_active ?? true,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/media/${item.id}` : '/admin/media', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Media Item' : 'Create Media Item'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Title" error={errors.title}><input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} /></Field>
                    <Field label="Type" error={errors.type}><select className={inputClass} value={data.type} onChange={(event) => setData('type', event.target.value)}><option value="image">Image</option><option value="video">Video</option></select></Field>
                </div>
                <Field label="Gallery Album" error={errors.media_album_id}>
                    <select className={inputClass} value={data.media_album_id} onChange={(event) => setData('media_album_id', event.target.value)}>
                        <option value="">Unassigned</option>
                        {albums.map((album) => <option key={album.id} value={album.id}>{album.name}</option>)}
                    </select>
                </Field>
                <Field label="Description" error={errors.description}><textarea rows="4" className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} /></Field>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Image" error={errors.image}><input type="file" accept="image/*" onChange={(event) => setData('image', event.target.files[0])} /></Field>
                    <Field label="Video URL" error={errors.video_url}><input className={inputClass} value={data.video_url} onChange={(event) => setData('video_url', event.target.value)} /></Field>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    <Toggle label="Featured" checked={data.is_featured} onChange={(value) => setData('is_featured', value)} />
                    {canManageVisibility ? <Toggle label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} /> : null}
                </div>
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Media Item</button>
            </form>
        </AdminLayout>
    );
}
