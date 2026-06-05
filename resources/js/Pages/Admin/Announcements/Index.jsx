import { Link, router, usePage } from '@inertiajs/react';
import { Archive, ExternalLink, Megaphone, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { StatusBadge, inputClass } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function AnnouncementsIndex({ announcements = [], filters = {} }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const updateStatus = (status) => {
        router.get('/admin/announcements', { status }, { preserveState: true, preserveScroll: true });
    };

    const archive = (announcement) => router.patch(`/admin/announcements/${announcement.id}/archive`, {}, { preserveScroll: true });
    const destroy = (announcement) => requestDelete({
        url: `/admin/announcements/${announcement.id}`,
        title: `Remove ${announcement.title}?`,
        description: 'This announcement will be permanently removed, including its document if uploaded.',
    });

    return (
        <AdminLayout title="Announcements" actions={<Link href="/admin/announcements/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Announcement</Link>}>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
                <div className="max-w-xs flex-1">
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</label>
                    <select className={`${inputClass} mt-2`} value={filters.status || ''} onChange={(event) => updateStatus(event.target.value)}>
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <Link href="/admin/announcements" className="rounded-lg border border-slate-200 px-4 py-3 font-black text-slate-700 hover:bg-slate-50">Clear</Link>
            </div>

            <AdminTable columns={['Announcement', 'Status', 'Published', 'Type', 'Order', 'Actions']}>
                {announcements.map((announcement) => (
                    <tr key={announcement.id}>
                        <td className="px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#9DD8EA]">
                                    <Megaphone aria-hidden="true" size={21} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{announcement.title}</p>
                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{announcement.excerpt}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge active={announcement.status === 'published'}>{announcement.status}</StatusBadge></td>
                        <td className="px-5 py-4">{announcement.published_label || '-'}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{announcement.document_url ? 'Document' : 'Text'}</td>
                        <td className="px-5 py-4">{announcement.sort_order}</td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                <IconAction href={`/admin/announcements/${announcement.id}/edit`} icon={Pencil} label={`Edit ${announcement.title}`} tone="teal" />
                                {announcement.document_url ? (
                                    <a href={announcement.document_url} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 hover:shadow-md" aria-label={`Open ${announcement.title}`} title={`Open ${announcement.title}`}>
                                        <ExternalLink aria-hidden="true" size={18} />
                                    </a>
                                ) : null}
                                {canManageVisibility && announcement.status !== 'archived' ? <IconAction onClick={() => archive(announcement)} icon={Archive} label={`Archive ${announcement.title}`} tone="amber" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(announcement)} icon={Trash2} label={`Remove ${announcement.title} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!announcements.length ? (
                    <tr>
                        <td colSpan="6" className="px-5 py-10 text-center">
                            <h3 className="text-xl font-black text-[#245E73]">No announcements yet</h3>
                            <p className="mt-2 text-slate-500">Publish organizational notices, opportunities, and document announcements here.</p>
                        </td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
