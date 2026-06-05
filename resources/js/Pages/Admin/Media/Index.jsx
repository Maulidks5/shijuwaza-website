import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import { Eye, EyeOff, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function MediaIndex({ items = [] }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const destroy = (item) => requestDelete({
        url: `/admin/media/${item.id}`,
        title: `Remove ${item.title}?`,
        description: 'This media item will be permanently removed from the gallery and cannot be restored.',
    });
    const toggleVisibility = (item) => router.patch(`/admin/media/${item.id}/visibility`, {}, { preserveScroll: true });

    return (
        <AdminLayout
            title="Media Gallery"
            actions={(
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/media-albums" className="inline-flex items-center gap-2 rounded-lg border border-[#9DD8EA]/20 px-4 py-2 font-black text-[#245E73]">
                        <FolderOpen size={17} aria-hidden="true" /> Albums
                    </Link>
                    <Link href="/admin/media/create" className="inline-flex items-center gap-2 rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">
                        <Plus size={17} aria-hidden="true" /> Add Media
                    </Link>
                </div>
            )}
        >
            <AdminTable columns={['Title', 'Album', 'Type', 'Order', 'Featured', 'Status', 'Actions']}>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td className="px-5 py-4 font-black">{item.title}<p className="font-normal text-slate-500">{item.description}</p></td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-600">{item.album?.name || 'Unassigned'}</td>
                        <td className="px-5 py-4">{item.type}</td>
                        <td className="px-5 py-4">{item.sort_order}</td>
                        <td className="px-5 py-4"><StatusBadge active={item.is_featured}>{item.is_featured ? 'Featured' : 'Normal'}</StatusBadge></td>
                        <td className="px-5 py-4"><StatusBadge active={item.is_active} /></td>
                        <td className="px-5 py-4"><div className="flex gap-2"><IconAction href={`/admin/media/${item.id}/edit`} icon={Pencil} label={`Edit ${item.title}`} tone="teal" />{canManageVisibility ? <IconAction onClick={() => toggleVisibility(item)} icon={item.is_active ? EyeOff : Eye} label={item.is_active ? `Hide ${item.title}` : `Unhide ${item.title}`} tone="amber" /> : null}{isSuperAdmin ? <IconAction onClick={() => destroy(item)} icon={Trash2} label={`Remove ${item.title} permanently`} tone="red" /> : null}</div></td>
                    </tr>
                ))}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
