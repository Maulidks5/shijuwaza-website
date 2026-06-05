import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

export default function PartnersIndex({ partners = [] }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const destroy = (partner) => {
        requestDelete({
            url: `/admin/partners/${partner.id}`,
            title: `Remove ${partner.name}?`,
            description: 'This partner record will be permanently removed from the system. This action cannot be undone.',
        });
    };
    const toggleVisibility = (partner) => router.patch(`/admin/partners/${partner.id}/visibility`, {}, { preserveScroll: true });

    return (
        <AdminLayout title="Partners" actions={<Link href="/admin/partners/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Partner</Link>}>
            <AdminTable columns={['Partner', 'Website', 'Status', 'Actions']}>
                {partners.map((partner) => (
                    <tr key={partner.id}>
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#9DD8EA]/10 bg-[#F3FBFD]">
                                    {partner.logo_url ? (
                                        <img src={partner.logo_url} alt="" className="h-full w-full object-contain p-1.5" />
                                    ) : (
                                        <span className="font-black text-[#9DD8EA]">{partner.name?.slice(0, 2).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{partner.name}</p>
                                    <p className="line-clamp-1 text-sm text-slate-500">{partner.description}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            {partner.website_url ? (
                                <a href={partner.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-black text-[#9DD8EA] transition hover:text-[#245E73]">
                                    Open <ExternalLink size={15} aria-hidden="true" />
                                </a>
                            ) : (
                                <span className="text-slate-400">-</span>
                            )}
                        </td>
                        <td className="px-5 py-4"><StatusBadge active={partner.is_active} /></td>
                        <td className="px-5 py-4"><div className="flex gap-2"><IconAction href={`/admin/partners/${partner.id}/edit`} icon={Pencil} label={`Edit ${partner.name}`} tone="teal" />{canManageVisibility ? <IconAction onClick={() => toggleVisibility(partner)} icon={partner.is_active ? EyeOff : Eye} label={partner.is_active ? `Hide ${partner.name}` : `Unhide ${partner.name}`} tone="amber" /> : null}{isSuperAdmin ? <IconAction onClick={() => destroy(partner)} icon={Trash2} label={`Remove ${partner.name} permanently`} tone="red" /> : null}</div></td>
                    </tr>
                ))}
                {!partners.length ? (
                    <tr>
                        <td colSpan="4" className="px-5 py-10 text-center text-slate-500">
                            No partners yet. Add partner logos and website links to show them on the homepage slider.
                        </td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
