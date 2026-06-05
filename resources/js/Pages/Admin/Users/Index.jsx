import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import RoleBadge from '../../../Components/Admin/RoleBadge';
import IconAction from '../../../Components/Admin/IconAction';
import { Lock, LockOpen, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function UsersIndex({ users, filters = { search: '' }, modules = [] }) {
    const { data, setData, get } = useForm({ search: filters.search || '' });
    const { dialogProps, requestDelete } = useConfirmDelete();
    const [blockTarget, setBlockTarget] = useState(null);
    const [blocking, setBlocking] = useState(false);

    const submit = (event) => {
        event.preventDefault();
        get('/admin/users', { preserveState: true });
    };

    const destroy = (user) => requestDelete({
        url: `/admin/users/${user.id}`,
        title: `Remove ${user.name}?`,
        description: 'This will permanently remove the user account and cannot be undone.',
    });

    const confirmBlock = () => {
        if (!blockTarget) {
            return;
        }

        setBlocking(true);
        router.patch(`/admin/users/${blockTarget.id}/block`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setBlocking(false);
                setBlockTarget(null);
            },
        });
    };

    return (
        <AdminLayout title="Users" actions={<Link href="/admin/users/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add User</Link>}>
            <form onSubmit={submit} className="mb-5 flex max-w-xl gap-2">
                <input
                    value={data.search}
                    onChange={(event) => setData('search', event.target.value)}
                    placeholder="Search users by name or email"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3"
                />
                <button className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49]">Search</button>
            </form>

            <AdminTable columns={['Name', 'Email', 'Role', 'Access', 'Status', 'Created', 'Actions']}>
                {users.data.map((user) => {
                    const role = user.roles?.[0]?.name;
                    const moduleCount = user.module_permissions?.length || 0;
                    const accessLabel = role === 'Super Admin'
                        ? 'All modules'
                        : moduleCount === 1
                            ? '1 module'
                            : `${moduleCount} modules`;

                    return (
                        <tr key={user.id}>
                            <td className="px-5 py-4">
                                <span className="inline-flex items-center gap-2 font-black">
                                    {user.is_blocked ? <Lock className="text-red-700" size={16} strokeWidth={3} aria-label="Blocked account" /> : null}
                                    {user.name}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600">{user.email}</td>
                            <td className="px-5 py-4"><RoleBadge role={role} /></td>
                            <td className="px-5 py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-black ${moduleCount ? 'bg-[#F3FBFD] text-[#245E73]' : 'bg-slate-100 text-slate-500'}`}>
                                    {moduleCount ? accessLabel : 'No modules'}
                                </span>
                            </td>
                            <td className="px-5 py-4">
                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${user.is_blocked ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-emerald-50 text-emerald-700'}`}>
                                    {user.is_blocked ? <Lock size={15} strokeWidth={3} aria-hidden="true" /> : <LockOpen size={15} strokeWidth={3} aria-hidden="true" />}
                                    {user.is_blocked ? 'Blocked' : 'Active'}
                                </span>
                                {user.last_seen_at ? <p className="mt-1 text-xs text-slate-400">Seen {new Date(user.last_seen_at).toLocaleDateString()}</p> : null}
                            </td>
                            <td className="px-5 py-4 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    <IconAction href={`/admin/users/${user.id}/edit`} icon={Pencil} label={`Edit ${user.name}`} tone="teal" />
                                    <IconAction onClick={() => setBlockTarget(user)} icon={user.is_blocked ? LockOpen : Lock} label={user.is_blocked ? `Unblock ${user.name}` : `Block ${user.name}`} tone={user.is_blocked ? 'emerald' : 'amber'} />
                                    <IconAction onClick={() => destroy(user)} icon={Trash2} label={`Remove ${user.name} permanently`} tone="red" />
                                </div>
                            </td>
                        </tr>
                    );
                })}
                {!users.data.length ? <tr><td colSpan="7" className="px-5 py-10 text-center font-bold text-slate-500">No users found.</td></tr> : null}
            </AdminTable>

            {users.links?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                    {users.links.map((link, index) => (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded-full px-4 py-2 text-sm font-bold ${link.active ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            ) : null}
            <ConfirmDialog {...dialogProps} />
            <ConfirmDialog
                open={Boolean(blockTarget)}
                title={blockTarget?.is_blocked ? `Unblock ${blockTarget.name}?` : `Block ${blockTarget?.name}?`}
                description={blockTarget?.is_blocked ? 'This account will be allowed to sign in again.' : 'This account will be prevented from signing in and any active sessions will end.'}
                confirmLabel={blockTarget?.is_blocked ? 'Unblock Account' : 'Block Account'}
                processingLabel={blockTarget?.is_blocked ? 'Unblocking...' : 'Blocking...'}
                onCancel={() => setBlockTarget(null)}
                onConfirm={confirmBlock}
                processing={blocking}
            />
        </AdminLayout>
    );
}
