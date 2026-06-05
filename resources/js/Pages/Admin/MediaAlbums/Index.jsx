import { Link, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import IconAction from '../../../Components/Admin/IconAction';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import { StatusBadge } from '../../../Components/Admin/FormControls';

export default function MediaAlbumIndex({ albums = [] }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const destroy = (album) => requestDelete({
        url: `/admin/media-albums/${album.id}`,
        title: `Remove ${album.name}?`,
        description: 'This album will be permanently removed. Media items will remain available, but without this album.',
    });

    const toggleVisibility = (album) => router.patch(`/admin/media-albums/${album.id}/visibility`, {}, { preserveScroll: true });

    return (
        <AdminLayout
            title="Gallery Albums"
            actions={(
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/media" className="inline-flex items-center gap-2 rounded-lg border border-[#9DD8EA]/20 px-4 py-2 font-black text-[#245E73]">
                        <FolderOpen size={17} aria-hidden="true" /> Media Items
                    </Link>
                    <Link href="/admin/media-albums/create" className="inline-flex items-center gap-2 rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">
                        <Plus size={17} aria-hidden="true" /> Add Album
                    </Link>
                </div>
            )}
        >
            <AdminTable columns={['Album', 'Photos', 'Order', 'Status', 'Actions']}>
                {albums.map((album) => (
                    <tr key={album.id}>
                        <td className="px-5 py-4">
                            <p className="font-black text-slate-900">{album.name}</p>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{album.description || 'No description added yet.'}</p>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{album.media_items_count}</td>
                        <td className="px-5 py-4">{album.sort_order}</td>
                        <td className="px-5 py-4"><StatusBadge active={album.is_active} /></td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                <IconAction href={`/admin/media-albums/${album.id}/edit`} icon={Pencil} label={`Edit ${album.name}`} tone="teal" />
                                {canManageVisibility ? <IconAction onClick={() => toggleVisibility(album)} icon={album.is_active ? EyeOff : Eye} label={album.is_active ? `Hide ${album.name}` : `Unhide ${album.name}`} tone="amber" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(album)} icon={Trash2} label={`Remove ${album.name} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!albums.length ? (
                    <tr>
                        <td colSpan="5" className="px-5 py-10 text-center text-slate-500">Create gallery albums to organize photos by activity, year, or program.</td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
