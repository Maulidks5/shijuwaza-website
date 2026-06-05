import { Link, router, usePage } from '@inertiajs/react';
import { Archive, ExternalLink, FileText, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { StatusBadge, inputClass } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function ResourcesIndex({ resources = [], categories = {}, filters = {} }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const updateFilter = (key, value) => {
        router.get('/admin/resources', { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });
    };

    const archive = (resource) => router.patch(`/admin/resources/${resource.id}/archive`, {}, { preserveScroll: true });
    const destroy = (resource) => requestDelete({
        url: `/admin/resources/${resource.id}`,
        title: `Remove ${resource.title}?`,
        description: 'This resource will be permanently removed, including uploaded files, and cannot be restored.',
    });

    return (
        <AdminLayout title="Knowledge & Resources" actions={<Link href="/admin/resources/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Resource</Link>}>
            <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
                <div>
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Category</label>
                    <select className={`${inputClass} mt-2`} value={filters.category || ''} onChange={(event) => updateFilter('category', event.target.value)}>
                        <option value="">All categories</option>
                        {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</label>
                    <select className={`${inputClass} mt-2`} value={filters.status || ''} onChange={(event) => updateFilter('status', event.target.value)}>
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <Link href="/admin/resources" className="rounded-lg border border-slate-200 px-4 py-3 font-black text-slate-700 hover:bg-slate-50">Clear Filters</Link>
                </div>
            </div>

            <AdminTable columns={['Resource', 'Category', 'Status', 'Published', 'Order', 'Actions']}>
                {resources.map((resource) => (
                    <tr key={resource.id}>
                        <td className="px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#9DD8EA]">
                                    <FileText aria-hidden="true" size={21} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{resource.title}</p>
                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{resource.excerpt}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{resource.category_label}</td>
                        <td className="px-5 py-4"><StatusBadge active={resource.status === 'published'}>{resource.status}</StatusBadge></td>
                        <td className="px-5 py-4">{resource.published_label || '-'}</td>
                        <td className="px-5 py-4">{resource.sort_order}</td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                {resource.file_url ? (
                                    <a
                                        href={resource.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 hover:shadow-md"
                                        title={`Open ${resource.title}`}
                                        aria-label={`Open ${resource.title}`}
                                    >
                                        <ExternalLink aria-hidden="true" size={18} />
                                    </a>
                                ) : null}
                                <IconAction href={`/admin/resources/${resource.id}/edit`} icon={Pencil} label={`Edit ${resource.title}`} tone="teal" />
                                {canManageVisibility && resource.status !== 'archived' ? <IconAction onClick={() => archive(resource)} icon={Archive} label={`Archive ${resource.title}`} tone="amber" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(resource)} icon={Trash2} label={`Remove ${resource.title} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!resources.length ? (
                    <tr>
                        <td colSpan="6" className="px-5 py-10 text-center">
                            <h3 className="text-xl font-black text-[#245E73]">No resources yet</h3>
                            <p className="mt-2 text-slate-500">Add newsletters, reports, strategic plans, articles, and success stories here.</p>
                        </td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
