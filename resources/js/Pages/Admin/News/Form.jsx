import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function NewsForm({ post, categories = {} }) {
    const editing = Boolean(post);
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = permissions.includes('manage visibility');
    const dateValue = post?.published_at ? post.published_at.slice(0, 16) : '';
    const { data, setData, post: submitPost, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        category: post?.category || 'activity',
        excerpt: post?.excerpt || '',
        body: post?.body || '',
        featured_image: null,
        activity_date: post?.activity_date_value || '',
        published_at: dateValue,
        status: post?.status || 'draft',
        sort_order: post?.sort_order || 0,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        submitPost(editing ? `/admin/news/${post.id}` : '/admin/news', { forceFormData: true });
    };

    return (
        <AdminLayout title={editing ? 'Edit Update / Activity' : 'Create Update / Activity'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Title" error={errors.title}><input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} /></Field>
                <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Category" error={errors.category}>
                        <select className={inputClass} value={data.category} onChange={(event) => setData('category', event.target.value)}>
                            {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </Field>
                    <Field label="Activity Date" error={errors.activity_date}><input type="date" className={inputClass} value={data.activity_date} onChange={(event) => setData('activity_date', event.target.value)} /></Field>
                    <Field label="Status" error={errors.status}><select className={inputClass} value={data.status} onChange={(event) => setData('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option>{canManageVisibility ? <option value="archived">Archived</option> : null}</select></Field>
                </div>
                <Field label="Short Summary" error={errors.excerpt}><textarea rows="3" className={inputClass} value={data.excerpt} onChange={(event) => setData('excerpt', event.target.value)} /></Field>
                <Field label="Activity Details" error={errors.body}><textarea rows="9" className={inputClass} value={data.body} onChange={(event) => setData('body', event.target.value)} /></Field>
                <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Published At" error={errors.published_at}><input type="datetime-local" className={inputClass} value={data.published_at} onChange={(event) => setData('published_at', event.target.value)} /></Field>
                    <Field label="Featured Image" error={errors.featured_image}><input type="file" accept="image/*" onChange={(event) => setData('featured_image', event.target.files[0])} /></Field>
                </div>
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Update</button>
            </form>
        </AdminLayout>
    );
}
