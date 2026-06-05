import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BriefcaseBusiness,
    ChevronRight,
    FileCheck2,
    FolderPlus,
    Handshake,
    HeartHandshake,
    ImagePlus,
    Images,
    Inbox,
    LibraryBig,
    Megaphone,
    Newspaper,
    ShieldCheck,
    Sparkles,
    UserPlus,
    UsersRound,
} from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

const icons = {
    BarChart3,
    BriefcaseBusiness,
    FileCheck2,
    FolderPlus,
    Handshake,
    HeartHandshake,
    ImagePlus,
    Images,
    Inbox,
    LibraryBig,
    Megaphone,
    Newspaper,
    ShieldCheck,
    Sparkles,
    UserPlus,
    UsersRound,
};

function DashboardIcon({ name, size = 22 }) {
    const Icon = icons[name] || Sparkles;
    return <Icon size={size} aria-hidden="true" />;
}

export default function Dashboard({ cards = [], quickActions = [], sections = [] }) {
    const { auth, adminNotifications = { total: 0, items: [] } } = usePage().props;
    const user = auth.user;
    const role = user?.roles?.[0] || user?.role || 'Admin';

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <section className="overflow-hidden rounded-2xl border border-[#9DD8EA]/55 bg-[#9DD8EA] p-6 text-[#173B49] shadow-sm md:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#245E73]">{role}</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Welcome, {user?.name || 'Admin'}</h1>
                        <p className="mt-3 max-w-2xl leading-7 text-[#245E73]">Manage the modules assigned to your account from one clean workspace.</p>
                    </div>
                    {quickActions.length ? (
                        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
                            {quickActions.slice(0, 4).map((action) => (
                                <Link key={action.href} href={action.href} className="inline-flex items-center justify-between gap-3 rounded-xl bg-white/45 px-4 py-3 font-black text-[#173B49] ring-1 ring-white/45 transition hover:bg-white">
                                    <span className="inline-flex items-center gap-2"><DashboardIcon name={action.icon} size={18} /> {action.label}</span>
                                    <ChevronRight size={18} aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="mt-8 rounded-2xl border border-[#9DD8EA]/45 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-xl font-black text-[#245E73]">Needs Attention</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Requests and messages waiting for admin review.</p>
                    </div>
                    <span className="rounded-full bg-[#9DD8EA]/55 px-4 py-2 text-sm font-black text-[#173B49]">{adminNotifications.total || 0} pending</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {adminNotifications.items?.length ? adminNotifications.items.map((item) => (
                        <Link key={item.key} href={item.href} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-[#9DD8EA] hover:bg-[#F3FBFD]">
                            <p className="text-2xl font-black text-[#245E73]">{item.count}</p>
                            <p className="mt-1 text-sm font-black text-slate-700">{item.label}</p>
                        </Link>
                    )) : (
                        <div className="rounded-xl bg-[#F8FAFC] p-5 text-sm font-bold text-slate-500 md:col-span-2 xl:col-span-5">
                            No urgent requests right now.
                        </div>
                    )}
                </div>
            </section>

            {cards.length ? (
                <section className="mt-8">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-[#245E73]">Your Modules</h2>
                            <p className="mt-1 text-sm font-semibold text-slate-500">Only modules you can access are shown.</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => (
                            <Link key={card.label} href={card.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9DD8EA]/30 hover:shadow-md">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#245E73] transition group-hover:bg-[#9DD8EA] group-hover:text-[#173B49]">
                                        <DashboardIcon name={card.icon} />
                                    </div>
                                    <ChevronRight className="text-slate-300 transition group-hover:text-[#245E73]" size={20} aria-hidden="true" />
                                </div>
                                <p className="mt-5 text-sm font-bold text-slate-500">{card.label}</p>
                                <div className="mt-2 flex items-end justify-between gap-3">
                                    <p className="text-3xl font-black text-[#245E73]">{card.value}</p>
                                    <p className="text-right text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{card.meta}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-2xl font-black text-[#245E73]">No modules assigned</h2>
                    <p className="mt-2 font-semibold text-slate-600">A Super Admin can assign module access to your account.</p>
                </div>
            )}

            {sections.length ? (
                <section className="mt-8">
                    <h2 className="text-xl font-black text-[#245E73]">Recent Work</h2>
                    <div className="mt-4 grid gap-5 xl:grid-cols-3">
                        {sections.slice(0, 6).map((section) => (
                            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-black text-[#245E73]">{section.title}</h3>
                                    <Link href={section.href} className="text-sm font-black text-[#245E73] hover:text-[#173B49]">Open</Link>
                                </div>
                                <div className="mt-4 divide-y divide-slate-100">
                                    {section.items.length ? section.items.slice(0, 3).map((item) => (
                                        <div key={`${section.title}-${item.id}`} className="py-3">
                                            <p className="line-clamp-1 font-black text-slate-800">{item.title}</p>
                                            <p className="mt-1 text-sm capitalize text-slate-500">{item.meta}</p>
                                        </div>
                                    )) : (
                                        <div className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No records yet.</div>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </section>
            ) : null}
        </AdminLayout>
    );
}
