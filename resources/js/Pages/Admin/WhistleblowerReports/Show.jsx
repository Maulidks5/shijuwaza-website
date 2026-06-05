import { Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, CheckCircle2, MapPin, ShieldAlert, Trash2, UserRound } from 'lucide-react';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import AdminLayout from '../../../Layouts/AdminLayout';

const concernLabels = {
    abuse_or_violence: 'Abuse or violence',
    discrimination: 'Discrimination',
    harassment: 'Harassment',
    accessibility_concern: 'Accessibility concern',
    other: 'Other concern',
};

export default function WhistleblowerReportShow({ report }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const updateStatus = (status) => {
        router.patch(`/admin/whistleblower-reports/${report.id}`, { status }, { preserveScroll: true });
    };

    const destroy = () => {
        requestDelete({
            url: `/admin/whistleblower-reports/${report.id}`,
            title: `Delete confidential report #${report.id}?`,
            description: 'This confidential report will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout
            title="Confidential Report"
            actions={<Link href="/admin/whistleblower-reports" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-black text-slate-700 shadow-sm hover:bg-slate-50"><ArrowLeft aria-hidden="true" size={18} /> Back</Link>}
        >
            <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-[#F3FBFD] p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#245E73]">Sema na SHIJUWAZA / Whistle Blowers</p>
                                <h2 className="mt-2 text-3xl font-black text-[#173B49]">{concernLabels[report.concern_type] || report.concern_type}</h2>
                            </div>
                            <StatusBadge active={report.status !== 'archived'}>{report.status}</StatusBadge>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 sm:grid-cols-3">
                        <InfoCard icon={ShieldAlert} label="Report ID" value={`#${report.id}`} />
                        <InfoCard icon={MapPin} label="Location" value={report.location || 'Not provided'} />
                        <InfoCard icon={UserRound} label="Contact" value={report.contact_details || 'Not provided'} />
                    </div>

                    <div className="border-t border-slate-100 p-6">
                        <div className="mb-4 rounded-xl border border-[#9DD8EA]/45 bg-[#F3FBFD] p-4">
                            <p className="font-black text-[#173B49]">{report.wants_anonymous ? 'The sender prefers to remain anonymous.' : 'The sender did not select anonymous preference.'}</p>
                        </div>
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-slate-500">Report Details</p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="whitespace-pre-line text-lg leading-8 text-slate-700">{report.message}</p>
                        </div>
                    </div>
                </section>

                <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-black text-[#245E73]">Report Actions</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        Update the status after reviewing this confidential report.
                    </p>
                    <div className="mt-5 grid gap-2">
                        <button type="button" onClick={() => updateStatus('reviewed')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50">
                            <CheckCircle2 aria-hidden="true" size={18} />
                            Mark as Reviewed
                        </button>
                        <button type="button" onClick={() => updateStatus('closed')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700">
                            <CheckCircle2 aria-hidden="true" size={18} />
                            Close Report
                        </button>
                        <button type="button" onClick={() => updateStatus('archived')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9DD8EA] px-4 py-3 font-black text-[#245E73] hover:bg-[#7CC8DE]">
                            <Archive aria-hidden="true" size={18} />
                            Archive Report
                        </button>
                        {isSuperAdmin ? <IconAction onClick={destroy} icon={Trash2} label={`Delete confidential report #${report.id}`} tone="red" /> : null}
                    </div>
                </aside>
            </div>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <Icon aria-hidden="true" size={20} className="text-[#9DD8EA]" />
            <span>
                <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</span>
                <span className="mt-1 block break-words font-black text-slate-900">{value}</span>
            </span>
        </div>
    );
}
