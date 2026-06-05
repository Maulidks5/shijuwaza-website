import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function AnnouncementForm({ announcement }) {
    const editing = Boolean(announcement);
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = permissions.includes('manage visibility');
    const dateValue = announcement?.published_at ? announcement.published_at.slice(0, 16) : '';
    const { data, setData, post, processing, errors } = useForm({
        title: announcement?.title || '',
        slug: announcement?.slug || '',
        excerpt: announcement?.excerpt || '',
        body: announcement?.body || '',
        document_path: null,
        published_at: dateValue,
        status: announcement?.status || 'draft',
        sort_order: announcement?.sort_order || 0,
        is_featured: Boolean(announcement?.is_featured),
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/announcements/${announcement.id}` : '/admin/announcements', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Announcement' : 'Create Announcement'}>
            <form onSubmit={submit} className="grid max-w-5xl gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Title" error={errors.title}><input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} /></Field>
                <Field label="Short Announcement Text" error={errors.excerpt}><textarea rows="3" className={inputClass} value={data.excerpt} onChange={(event) => setData('excerpt', event.target.value)} /></Field>
                <Field label="Full Text Details" error={errors.body}><textarea rows="9" className={inputClass} value={data.body} onChange={(event) => setData('body', event.target.value)} /></Field>

                <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Status" error={errors.status}>
                        <select className={inputClass} value={data.status} onChange={(event) => setData('status', event.target.value)}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            {canManageVisibility ? <option value="archived">Archived</option> : null}
                        </select>
                    </Field>
                    <Field label="Published At" error={errors.published_at}><input type="datetime-local" className={inputClass} value={data.published_at} onChange={(event) => setData('published_at', event.target.value)} /></Field>
                    <Field label="Document" error={errors.document_path}>
                        <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" onChange={(event) => setData('document_path', event.target.files[0])} />
                        {announcement?.document_url ? <a href={announcement.document_url} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-black text-[#9DD8EA]">Current document</a> : null}
                    </Field>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 font-bold text-slate-700">
                    <input type="checkbox" checked={data.is_featured} onChange={(event) => setData('is_featured', event.target.checked)} />
                    Feature this announcement
                </label>

                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Announcement</button>
            </form>
        </AdminLayout>
    );
}
