import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { inputClass, StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import { Archive, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function NewsIndex({ posts = [], categories = {}, filters = {} }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const destroy = (post) => requestDelete({
        url: `/admin/news/${post.id}`,
        title: `Remove ${post.title}?`,
        description: 'This news post will be permanently removed and cannot be restored.',
    });
    const archive = (post) => router.patch(`/admin/news/${post.id}/archive`, {}, { preserveScroll: true });
    const updateFilter = (key, value) => router.get('/admin/news', { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });

    return (
        <AdminLayout title="Updates & Activities" actions={<Link href="/admin/news/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Update</Link>}>
            <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                <label>
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Category</span>
                    <select className={`${inputClass} mt-2`} value={filters.category || ''} onChange={(event) => updateFilter('category', event.target.value)}>
                        <option value="">All categories</option>
                        {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
                <label>
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</span>
                    <select className={`${inputClass} mt-2`} value={filters.status || ''} onChange={(event) => updateFilter('status', event.target.value)}>
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </label>
            </div>
            <AdminTable columns={['Update', 'Category', 'Status', 'Activity Date', 'Published', 'Actions']}>
                {posts.map((post) => (
                    <tr key={post.id}>
                        <td className="px-5 py-4 font-black">{post.title}<p className="font-normal text-slate-500">{post.excerpt}</p></td>
                        <td className="px-5 py-4 text-sm font-bold text-[#245E73]">{post.category_label}</td>
                        <td className="px-5 py-4"><StatusBadge active={post.status === 'published'}>{post.status}</StatusBadge></td>
                        <td className="px-5 py-4">{post.activity_date_label || '-'}</td>
                        <td className="px-5 py-4">{post.published_label || '-'}</td>
                        <td className="px-5 py-4"><div className="flex gap-2"><IconAction href={`/admin/news/${post.id}/edit`} icon={Pencil} label={`Edit ${post.title}`} tone="teal" />{canManageVisibility && post.status !== 'archived' ? <IconAction onClick={() => archive(post)} icon={Archive} label={`Archive ${post.title}`} tone="amber" /> : null}{isSuperAdmin ? <IconAction onClick={() => destroy(post)} icon={Trash2} label={`Remove ${post.title} permanently`} tone="red" /> : null}</div></td>
                    </tr>
                ))}
                {!posts.length ? <tr><td colSpan="6" className="px-5 py-10 text-center font-bold text-slate-500">No updates found.</td></tr> : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
