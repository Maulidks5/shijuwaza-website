import { Link, router, usePage } from '@inertiajs/react';
import { Archive, CheckCircle2, Eye, Trash2, XCircle } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import StatusPill from '../../../Components/StatusPill';

const statuses = ['all', 'pending', 'approved', 'rejected', 'archived'];

export default function MemberSubmissionsIndex({ submissions = [], filters = { status: 'all' } }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { dialog, ask, close } = useConfirmDelete();

    const updateStatus = (submission, status) => {
        router.patch(`/admin/member-submissions/${submission.id}`, { status, is_public: status === 'approved' }, { preserveScroll: true });
    };

    const destroy = (submission) => ask({
        title: `Remove "${submission.title}" permanently?`,
        message: 'This will permanently delete the member submission and any uploaded document.',
        confirmLabel: 'Remove Permanently',
        onConfirm: () => router.delete(`/admin/member-submissions/${submission.id}`),
    });

    return (
        <AdminLayout title="Member Submissions">
            <div className="mb-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                    <Link
                        key={status}
                        href={`/admin/member-submissions?status=${status}`}
                        className={`rounded-full px-4 py-2 text-sm font-black capitalize ${filters.status === status ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700 shadow-sm'}`}
                    >
                        {status}
                    </Link>
                ))}
            </div>

            <AdminTable columns={['Member', 'Title', 'Type', 'Submitted', 'Status', 'Actions']}>
                {submissions.map((submission) => (
                    <tr key={submission.id}>
                        <td className="px-5 py-4">
                            <p className="font-black text-slate-900">{submission.member.acronym || submission.member.name}</p>
                            <p className="text-sm text-slate-500">{submission.member.name}</p>
                        </td>
                        <td className="px-5 py-4 font-black text-slate-900">{submission.title}</td>
                        <td className="px-5 py-4 capitalize text-slate-600">{submission.submission_type}</td>
                        <td className="px-5 py-4 text-slate-600">{submission.created_at}</td>
                        <td className="px-5 py-4"><StatusPill status={submission.status} /></td>
                        <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                <IconAction href={`/admin/member-submissions/${submission.id}`} icon={Eye} label={`Open ${submission.title}`} tone="teal" />
                                {submission.status !== 'approved' ? <IconAction onClick={() => updateStatus(submission, 'approved')} icon={CheckCircle2} label={`Approve ${submission.title}`} tone="emerald" /> : null}
                                {submission.status !== 'rejected' ? <IconAction onClick={() => updateStatus(submission, 'rejected')} icon={XCircle} label={`Reject ${submission.title}`} tone="red" /> : null}
                                {submission.status !== 'archived' ? <IconAction onClick={() => updateStatus(submission, 'archived')} icon={Archive} label={`Archive ${submission.title}`} tone="amber" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(submission)} icon={Trash2} label={`Remove ${submission.title} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!submissions.length ? (
                    <tr>
                        <td colSpan="6" className="px-5 py-8 text-center font-semibold text-slate-500">No member submissions found.</td>
                    </tr>
                ) : null}
            </AdminTable>
            <ConfirmDialog dialog={dialog} onClose={close} />
        </AdminLayout>
    );
}
