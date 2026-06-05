import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function ProgramsIndex({ programs = [] }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const destroy = (program) => requestDelete({
        url: `/admin/programs/${program.id}`,
        title: `Remove ${program.title}?`,
        description: 'This program will be permanently removed from the CMS and cannot be restored.',
    });
    const toggleVisibility = (program) => router.patch(`/admin/programs/${program.id}/visibility`, {}, { preserveScroll: true });

    return (
        <AdminLayout title="Programs" actions={<Link href="/admin/programs/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Program</Link>}>
            <AdminTable columns={['Title', 'Slug', 'Order', 'Featured', 'Status', 'Actions']}>
                {programs.map((program) => (
                    <tr key={program.id}>
                        <td className="px-5 py-4 font-black">{program.title}<p className="font-normal text-slate-500">{program.short_description}</p></td>
                        <td className="px-5 py-4">{program.slug}</td>
                        <td className="px-5 py-4">{program.sort_order}</td>
                        <td className="px-5 py-4"><StatusBadge active={program.is_featured}>{program.is_featured ? 'Featured' : 'Normal'}</StatusBadge></td>
                        <td className="px-5 py-4"><StatusBadge active={program.is_active} /></td>
                        <td className="px-5 py-4"><div className="flex gap-2"><IconAction href={`/admin/programs/${program.id}/edit`} icon={Pencil} label={`Edit ${program.title}`} tone="teal" />{canManageVisibility ? <IconAction onClick={() => toggleVisibility(program)} icon={program.is_active ? EyeOff : Eye} label={program.is_active ? `Hide ${program.title}` : `Unhide ${program.title}`} tone="amber" /> : null}{isSuperAdmin ? <IconAction onClick={() => destroy(program)} icon={Trash2} label={`Remove ${program.title} permanently`} tone="red" /> : null}</div></td>
                    </tr>
                ))}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
