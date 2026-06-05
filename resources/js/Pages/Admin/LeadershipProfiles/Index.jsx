import { Link, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff, Pencil, Trash2, UserRound } from 'lucide-react';
import AdminTable from '../../../Components/Admin/AdminTable';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function LeadershipProfilesIndex({ profiles = [], categories = {} }) {
    const roles = usePage().props.auth.user?.roles || [];
    const permissions = usePage().props.auth.user?.permissions || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const destroy = (profile) => {
        requestDelete({
            url: `/admin/leadership-profiles/${profile.id}`,
            title: `Remove ${profile.full_name}?`,
            description: 'This profile will be permanently removed from the system. This action cannot be undone.',
        });
    };

    const toggleVisibility = (profile) => router.patch(`/admin/leadership-profiles/${profile.id}/visibility`, {}, { preserveScroll: true });

    return (
        <AdminLayout title="Leadership Profiles" actions={<Link href="/admin/leadership-profiles/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Profile</Link>}>
            <div className="mb-5 rounded-2xl border border-[#9DD8EA]/45 bg-white p-5 shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#245E73]">About Us profiles</p>
                <h2 className="mt-2 text-2xl font-black text-[#173B49]">Secretariat, Board and NEC members</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                    Add each member profile with photo, full name, position, short bio, and full history shown from the About page.
                </p>
            </div>

            <AdminTable columns={['Profile', 'Group', 'Reports Under', 'Tree Position', 'Position', 'Status', 'Actions']}>
                {profiles.map((profile) => (
                    <tr key={profile.id}>
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#9DD8EA]/30 bg-[#F3FBFD]">
                                    {profile.photo_url ? (
                                        <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <UserRound aria-hidden="true" className="text-[#245E73]" size={24} />
                                    )}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{profile.full_name}</p>
                                    <p className="line-clamp-1 text-sm text-slate-500">{profile.short_bio}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{categories[profile.category] || profile.category_label}</td>
                        <td className="px-5 py-4 text-slate-600">{profile.parent_name || 'Top level'}</td>
                        <td className="px-5 py-4 capitalize text-slate-600">{profile.tree_position || 'down'}</td>
                        <td className="px-5 py-4 text-slate-600">{profile.position}</td>
                        <td className="px-5 py-4"><StatusBadge active={profile.is_active} /></td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                <IconAction href={`/admin/leadership-profiles/${profile.id}/edit`} icon={Pencil} label={`Edit ${profile.full_name}`} tone="teal" />
                                {canManageVisibility ? <IconAction onClick={() => toggleVisibility(profile)} icon={profile.is_active ? EyeOff : Eye} label={profile.is_active ? `Hide ${profile.full_name}` : `Unhide ${profile.full_name}`} tone="amber" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(profile)} icon={Trash2} label={`Remove ${profile.full_name} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!profiles.length ? (
                    <tr>
                        <td colSpan="7" className="px-5 py-10 text-center font-bold text-slate-500">
                            No leadership profiles yet. Add profiles for Secretariat, Board and NEC members.
                        </td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
