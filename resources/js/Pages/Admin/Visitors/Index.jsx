import { router } from '@inertiajs/react';
import { BarChart3, CalendarDays, MonitorSmartphone, MousePointerClick, UsersRound } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

const periods = [
    ['today', 'Today'],
    ['week', 'Week'],
    ['month', 'Month'],
    ['year', 'Year'],
    ['all', 'All time'],
];

export default function VisitorsIndex({ summary = {}, filters = { period: 'month', label: 'This month' }, deviceSummary = [] }) {
    const setPeriod = (period) => router.get('/admin/visitors', { period }, { preserveState: true });

    return (
        <AdminLayout title="Visitors">
            <section className="rounded-2xl border border-[#9DD8EA]/50 bg-[#9DD8EA] p-6 text-[#173B49] shadow-sm">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#245E73]">Website analytics</p>
                        <h1 className="mt-2 text-3xl font-black">Visitor overview</h1>
                        <p className="mt-3 max-w-2xl font-semibold leading-7 text-[#245E73]">
                            Track public website visits by day, week, month, and other periods. IP addresses are stored as hashes for privacy.
                        </p>
                    </div>
                    <BarChart3 aria-hidden="true" size={52} className="text-[#173B49]/80" />
                </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={CalendarDays} label="Today" value={summary.today || 0} meta={`${summary.unique_today || 0} unique`} />
                <MetricCard icon={MousePointerClick} label="This Week" value={summary.week || 0} meta="visits" />
                <MetricCard icon={UsersRound} label="This Month" value={summary.month || 0} meta={`${summary.unique_month || 0} unique`} />
                <MetricCard icon={BarChart3} label="Total Visits" value={summary.total || 0} meta="all time" />
            </section>

            <div className="mt-7 flex flex-wrap gap-2">
                {periods.map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setPeriod(value)}
                        className={`rounded-full px-4 py-2 text-sm font-black ${filters.period === value ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <section className="mt-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-black text-[#245E73]">Devices</h2>
                            <p className="mt-1 text-sm font-semibold text-slate-500">{filters.label}</p>
                        </div>
                        <MonitorSmartphone aria-hidden="true" className="text-[#9DD8EA]" size={30} />
                    </div>
                    <div className="mt-5 grid gap-3">
                        {deviceSummary.map((device) => (
                            <div key={device.device_type || 'unknown'} className="flex items-center justify-between rounded-xl bg-[#F3FBFD] px-4 py-3">
                                <span className="font-black capitalize text-[#173B49]">{device.device_type || 'unknown'}</span>
                                <span className="font-black text-[#245E73]">{device.visits}</span>
                            </div>
                        ))}
                        {!deviceSummary.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No device data yet.</p> : null}
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}

function MetricCard({ icon: Icon, label, value, meta }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#245E73]">
                    <Icon aria-hidden="true" size={22} />
                </div>
                <span className="rounded-full bg-[#9DD8EA]/55 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#173B49]">{meta}</span>
            </div>
            <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#245E73]">{value}</p>
        </div>
    );
}
