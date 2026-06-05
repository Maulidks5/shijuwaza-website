import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

const maxDocumentFileSize = 20 * 1024 * 1024;

export default function ResourceForm({ resource, categories = {} }) {
    const editing = Boolean(resource);
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = permissions.includes('manage visibility');
    const dateValue = resource?.published_at ? resource.published_at.slice(0, 16) : '';
    const { data, setData, post, processing, errors, progress, setError, clearErrors } = useForm({
        title: resource?.title || '',
        slug: resource?.slug || '',
        category: resource?.category || 'newsletter',
        excerpt: resource?.excerpt || '',
        body: resource?.body || '',
        cover_image: null,
        file_path: null,
        published_at: dateValue,
        status: resource?.status || 'draft',
        sort_order: resource?.sort_order || 0,
        is_featured: Boolean(resource?.is_featured),
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/resources/${resource.id}` : '/admin/resources', { forceFormData: true });
    };

    const updateDocumentFile = (event) => {
        const file = event.target.files[0] || null;

        if (file && file.size > maxDocumentFileSize) {
            event.target.value = '';
            setData('file_path', null);
            setError('file_path', 'Document file must be 20MB or smaller.');
            return;
        }

        clearErrors('file_path');
        setData('file_path', file);
    };

    return (
        <AdminLayout title={editing ? 'Edit Resource' : 'Create Resource'}>
            <form onSubmit={submit} className="grid max-w-5xl gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Title" error={errors.title}><input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} /></Field>

                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Category" error={errors.category}>
                        <select className={inputClass} value={data.category} onChange={(event) => setData('category', event.target.value)}>
                            {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </Field>
                    <Field label="Status" error={errors.status}>
                        <select className={inputClass} value={data.status} onChange={(event) => setData('status', event.target.value)}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            {canManageVisibility ? <option value="archived">Archived</option> : null}
                        </select>
                    </Field>
                    <Field label="Published At" error={errors.published_at}><input type="datetime-local" className={inputClass} value={data.published_at} onChange={(event) => setData('published_at', event.target.value)} /></Field>
                </div>

                <Field label="Short Description" error={errors.excerpt}><textarea rows="3" className={inputClass} value={data.excerpt} onChange={(event) => setData('excerpt', event.target.value)} /></Field>
                <Field label="Full Text / Notes" error={errors.body}><textarea rows="8" className={inputClass} value={data.body} onChange={(event) => setData('body', event.target.value)} /></Field>

                <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Document File" error={errors.file_path}>
                        <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" onChange={updateDocumentFile} />
                        <p className="mt-2 text-sm font-semibold text-slate-500">Accepted: PDF, Word, Excel, PowerPoint, TXT. Maximum upload 20MB.</p>
                        {progress ? (
                            <div className="mt-3 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-2 rounded-full bg-[#5BAFCB] transition-all" style={{ width: `${progress.percentage || 0}%` }} />
                            </div>
                        ) : null}
                        {resource?.file_url ? <a href={resource.file_url} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-black text-[#9DD8EA]">Current document</a> : null}
                    </Field>
                    <Field label="Cover Image" error={errors.cover_image}>
                        <input type="file" accept="image/*" onChange={(event) => setData('cover_image', event.target.files[0])} />
                        {resource?.cover_image_url ? <img src={resource.cover_image_url} alt="" className="mt-3 h-20 w-32 rounded-lg object-cover" /> : null}
                    </Field>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 font-bold text-slate-700">
                    <input type="checkbox" checked={data.is_featured} onChange={(event) => setData('is_featured', event.target.checked)} />
                    Feature this publication
                </label>

                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Resource</button>
            </form>
        </AdminLayout>
    );
}
