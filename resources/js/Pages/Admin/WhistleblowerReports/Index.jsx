import { router, usePage } from '@inertiajs/react';
import { Archive, CheckCircle2, Eye, ShieldAlert, Trash2 } from 'lucide-react';
import AdminTable from '../../../Components/Admin/AdminTable';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import AdminLayout from '../../../Layouts/AdminLayout';

const statuses = ['all', 'new', 'reviewed', 'closed', 'archived'];

const concernLabels = {
    abuse_or_violence: 'Abuse or violence',
    discrimination: 'Discrimination',
    harassment: 'Harassment',
    accessibility_concern: 'Accessibility concern',
    other: 'Other concern',
};

export default function WhistleblowerReportsIndex({ reports = [], filters = { status: 'all' } }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const setFilter = (status) => router.get('/admin/whistleblower-reports', { status }, { preserveState: true });
    const updateStatus = (report, status) => {
        router.patch(`/admin/whistleblower-reports/${report.id}`, { status }, { preserveScroll: true });
    };

    const destroy = (report) => {
        requestDelete({
            url: `/admin/whistleblower-reports/${report.id}`,
            title: `Delete confidential report #${report.id}?`,
            description: 'This confidential report will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout title="Whistle Blowers">
            <div className="mb-5 rounded-2xl border border-[#9DD8EA]/45 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#245E73]">Confidential reports</p>
                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                            Review sensitive reports carefully. Contact information may be empty when the sender chooses to remain anonymous.
                        </p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9DD8EA] text-[#173B49]">
                        <ShieldAlert aria-hidden="true" size={24} />
                    </div>
                </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(status)}
                        className={`rounded-full px-4 py-2 text-sm font-black ${filters.status === status ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <AdminTable columns={['Concern', 'Message', 'Contact', 'Status', 'Actions']}>
                {reports.map((report) => (
                    <tr key={report.id}>
                        <td className="px-5 py-4">
                            <p className="font-black text-slate-900">{concernLabels[report.concern_type] || report.concern_type}</p>
                            <p className="mt-1 text-sm text-slate-500">{report.location || 'No location shared'}</p>
                        </td>
                        <td className="max-w-lg px-5 py-4">
                            <p className="line-clamp-3 text-slate-600">{report.message}</p>
                        </td>
                        <td className="px-5 py-4">
                            <p className="font-bold text-slate-700">{report.wants_anonymous ? 'Anonymous preferred' : 'Follow-up allowed'}</p>
                            <p className="mt-1 text-sm text-slate-500">{report.contact_details || 'No contact shared'}</p>
                        </td>
                        <td className="px-5 py-4"><StatusBadge active={report.status !== 'archived'}>{report.status}</StatusBadge></td>
                        <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                <IconAction href={`/admin/whistleblower-reports/${report.id}`} icon={Eye} label={`Open confidential report #${report.id}`} tone="teal" />
                                <IconAction onClick={() => updateStatus(report, 'reviewed')} icon={CheckCircle2} label={`Mark confidential report #${report.id} as reviewed`} tone="neutral" />
                                <IconAction onClick={() => updateStatus(report, 'closed')} icon={CheckCircle2} label={`Close confidential report #${report.id}`} tone="emerald" />
                                <IconAction onClick={() => updateStatus(report, 'archived')} icon={Archive} label={`Archive confidential report #${report.id}`} tone="amber" />
                                {isSuperAdmin ? <IconAction onClick={() => destroy(report)} icon={Trash2} label={`Delete confidential report #${report.id}`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!reports.length ? <tr><td colSpan="5" className="px-5 py-10 text-center font-bold text-slate-500">No confidential reports found.</td></tr> : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
