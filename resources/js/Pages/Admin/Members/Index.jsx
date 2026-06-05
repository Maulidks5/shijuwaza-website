import { Link, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff, FileCheck2, Lock, LockOpen, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import { StatusBadge } from '../../../Components/Admin/FormControls';

export default function MembersIndex({ members = [] }) {
    const [accountFilter, setAccountFilter] = useState('all');
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const permissions = usePage().props.auth.user?.permissions || [];
    const canManageVisibility = isSuperAdmin || permissions.includes('manage visibility');
    const canReviewSubmissions = isSuperAdmin || permissions.includes('manage member submissions');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const [blockTarget, setBlockTarget] = useState(null);
    const [blocking, setBlocking] = useState(false);

    const toggleVisibility = (member) => router.patch(`/admin/members/${member.id}/visibility`, {}, { preserveScroll: true });
    const toggleAccountBlock = () => {
        if (!blockTarget) {
            return;
        }

        setBlocking(true);
        router.patch(`/admin/members/${blockTarget.id}/account-block`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setBlocking(false);
                setBlockTarget(null);
            },
        });
    };
    const destroy = (member) => requestDelete({
        url: `/admin/members/${member.id}`,
        title: `Remove ${member.acronym || member.name} permanently?`,
        description: 'This will remove the member profile and linked submissions. This action cannot be undone.',
    });
    const totalSubmissions = members.reduce((total, member) => total + Number(member.submissions_count || 0), 0);
    const pendingSubmissions = members.reduce((total, member) => total + Number(member.pending_submissions_count || 0), 0);
    const withAccounts = members.filter((member) => Boolean(member.account_email));
    const blockedAccounts = members.filter((member) => member.account_blocked);
    const visibleMembers = members.filter((member) => {
        if (accountFilter === 'with_account') {
            return Boolean(member.account_email);
        }

        if (accountFilter === 'blocked') {
            return member.account_blocked;
        }

        return true;
    });
    const accountTabs = [
        { key: 'all', label: 'All Members', count: members.length },
        { key: 'with_account', label: 'With Accounts', count: withAccounts.length },
        { key: 'blocked', label: 'Blocked Accounts', count: blockedAccounts.length },
    ];

    return (
        <AdminLayout
            title="Members"
            actions={
                <div className="flex flex-wrap gap-2">
                    {canReviewSubmissions ? (
                        <Link href="/admin/member-submissions" className="inline-flex items-center gap-2 rounded-lg border border-[#9DD8EA]/15 bg-white px-4 py-2 font-black text-[#245E73] shadow-sm hover:bg-[#F3FBFD]">
                            <FileCheck2 aria-hidden="true" size={18} />
                            Review Submissions
                        </Link>
                    ) : null}
                    <Link href="/admin/members/create" className="rounded-lg bg-[#9DD8EA] px-4 py-2 font-black text-[#173B49]">Add Member</Link>
                </div>
            }
        >
            <section className="mb-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Member OPDs</p>
                    <p className="mt-2 text-3xl font-black text-[#245E73]">{members.length}</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Submissions</p>
                    <p className="mt-2 text-3xl font-black text-[#245E73]">{totalSubmissions}</p>
                </article>
                <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-700">Pending Review</p>
                    <p className="mt-2 text-3xl font-black text-[#245E73]">{pendingSubmissions}</p>
                    {canReviewSubmissions ? <Link href="/admin/member-submissions?status=pending" className="mt-2 inline-flex text-sm font-black text-[#9DD8EA]">Open pending submissions</Link> : null}
                </article>
            </section>
            <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {accountTabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setAccountFilter(tab.key)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                            accountFilter === tab.key ? 'bg-[#9DD8EA] text-[#173B49] shadow-sm' : 'text-slate-600 hover:bg-[#F3FBFD] hover:text-[#245E73]'
                        }`}
                    >
                        {tab.key === 'blocked' ? <Lock size={15} strokeWidth={3} aria-hidden="true" /> : tab.key === 'with_account' ? <LockOpen size={15} strokeWidth={3} aria-hidden="true" /> : null}
                        {tab.label}
                        <span className={`rounded-full px-2 py-0.5 text-xs ${accountFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>
                    </button>
                ))}
            </div>
            <AdminTable columns={['Member', 'Login Account', 'Submissions', 'Status', 'Actions']}>
                {visibleMembers.map((member) => (
                    <tr key={member.id}>
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                {member.logo_url ? (
                                    <img src={member.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
                                ) : (
                                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#9DD8EA] font-black">
                                        {(member.acronym || member.name).slice(0, 2)}
                                    </span>
                                )}
                                <div>
                                    <p className="font-black text-slate-900">{member.acronym || member.name}</p>
                                    <p className="inline-flex items-center gap-2 text-sm text-slate-500">
                                        {member.account_blocked ? (
                                            <button
                                                type="button"
                                                onClick={() => setBlockTarget(member)}
                                                className="rounded-full text-red-700 transition hover:bg-red-50"
                                                title="Click to unblock member login"
                                                aria-label={`Unblock login for ${member.name}`}
                                            >
                                                <Lock size={15} strokeWidth={3} />
                                            </button>
                                        ) : null}
                                        {member.name}
                                    </p>
                                    <a href={`/members/${member.slug}`} target="_blank" rel="noreferrer" className="text-xs font-black text-[#9DD8EA]">View public profile</a>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">{member.account_name || 'No account'}</p>
                            <p className="text-sm text-slate-500">{member.account_email || 'Not linked'}</p>
                            <button
                                type="button"
                                onClick={() => member.account_email ? setBlockTarget(member) : null}
                                disabled={!member.account_email}
                                className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black transition ${
                                    member.account_blocked
                                        ? 'bg-red-100 text-red-800 ring-1 ring-red-200 hover:bg-red-200'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                } ${!member.account_email ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                title={member.account_blocked ? 'Click to unblock member login' : 'Click to block member login'}
                            >
                                {member.account_blocked ? <Lock size={15} strokeWidth={3} aria-hidden="true" /> : <LockOpen size={15} strokeWidth={3} aria-hidden="true" />}
                                {member.account_blocked ? 'Login blocked' : 'Login active'}
                            </button>
                        </td>
                        <td className="px-5 py-4">
                            {canReviewSubmissions ? (
                                <Link href="/admin/member-submissions" className="font-black text-[#245E73] hover:text-[#9DD8EA]">{member.submissions_count}</Link>
                            ) : (
                                <p className="font-black text-[#245E73]">{member.submissions_count}</p>
                            )}
                            <p className="text-sm text-slate-500">{member.pending_submissions_count} pending</p>
                        </td>
                        <td className="px-5 py-4"><StatusBadge active={member.is_active}>{member.is_active ? 'Visible' : 'Hidden'}</StatusBadge></td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                <IconAction href={`/admin/members/${member.id}/edit`} icon={Pencil} label={`Edit ${member.name}`} tone="teal" />
                                {canManageVisibility ? (
                                    <IconAction
                                        onClick={() => toggleVisibility(member)}
                                        icon={member.is_active ? EyeOff : Eye}
                                        label={member.is_active ? `Hide ${member.name}` : `Unhide ${member.name}`}
                                        tone="amber"
                                    />
                                ) : null}
                                {member.account_email ? (
                                    <IconAction
                                        onClick={() => setBlockTarget(member)}
                                        icon={member.account_blocked ? LockOpen : Lock}
                                        label={member.account_blocked ? `Unblock login for ${member.name}` : `Block login for ${member.name}`}
                                        tone={member.account_blocked ? 'emerald' : 'red'}
                                    />
                                ) : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(member)} icon={Trash2} label={`Remove ${member.name} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!visibleMembers.length ? (
                    <tr>
                        <td colSpan="5" className="px-5 py-8 text-center font-semibold text-slate-500">
                            No members found for this account filter.
                        </td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
            <ConfirmDialog
                open={Boolean(blockTarget)}
                title={blockTarget?.account_blocked ? `Unblock ${blockTarget.acronym || blockTarget?.name}?` : `Block ${blockTarget?.acronym || blockTarget?.name}?`}
                description={blockTarget?.account_blocked ? 'This member will be able to log in to the member portal again.' : 'This member will be prevented from logging in and any active portal session will end.'}
                confirmLabel={blockTarget?.account_blocked ? 'Unblock Account' : 'Block Account'}
                processingLabel={blockTarget?.account_blocked ? 'Unblocking...' : 'Blocking...'}
                onCancel={() => setBlockTarget(null)}
                onConfirm={toggleAccountBlock}
                processing={blocking}
            />
        </AdminLayout>
    );
}
