import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function StatsIndex({ stats = [] }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const destroy = (stat) => requestDelete({
        url: `/admin/stats/${stat.id}`,
        title: `Remove ${stat.label}?`,
        description: 'This homepage stat will be permanently removed and cannot be restored.',
    });
    const toggleVisibility = (stat) => router.patch(`/admin/stats/${stat.id}/visibility`, {}, { preserveScroll: true });

    return (
        <AdminLayout title="Homepage Stats" actions={<Link href="/admin/stats/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Stat</Link>}>
            <AdminTable columns={['Label', 'Value', 'Icon', 'Order', 'Status', 'Actions']}>
                {stats.map((stat) => (
                    <tr key={stat.id}>
                        <td className="px-5 py-4 font-black">{stat.label}<p className="font-normal text-slate-500">{stat.description}</p></td>
                        <td className="px-5 py-4 text-2xl font-black text-[#9DD8EA]">{stat.value}</td>
                        <td className="px-5 py-4">{stat.icon}</td>
                        <td className="px-5 py-4">{stat.sort_order}</td>
                        <td className="px-5 py-4"><StatusBadge active={stat.is_active} /></td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                <IconAction href={`/admin/stats/${stat.id}/edit`} icon={Pencil} label={`Edit ${stat.label}`} tone="teal" />
                                {canManageVisibility ? <IconAction onClick={() => toggleVisibility(stat)} icon={stat.is_active ? EyeOff : Eye} label={stat.is_active ? `Hide ${stat.label}` : `Unhide ${stat.label}`} tone="amber" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(stat)} icon={Trash2} label={`Remove ${stat.label} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
