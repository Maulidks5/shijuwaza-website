import { Link, usePage } from '@inertiajs/react';
import { FilePlus2, Files, LayoutDashboard, LogOut, User } from 'lucide-react';
import SessionSecurity from '../Components/Security/SessionSecurity';

const navItems = [
    { label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'My Submissions', href: '/member/submissions', icon: Files, exact: true },
    { label: 'Submit Update', href: '/member/submissions/create', icon: FilePlus2 },
    { label: 'My Profile', href: '/member/profile', icon: User },
];

export default function MemberLayout({ title, actions, children }) {
    const page = usePage();
    const { auth, flash } = page.props;
    const url = page.url;
    const initials = auth.user?.name
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen bg-sky-50 text-slate-900">
            <SessionSecurity />
            <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sky-700 bg-sky-950 text-white lg:block">
                <div className="border-b border-white/10 bg-sky-900/45 p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">SHIJUWAZA Members</p>
                    <h1 className="mt-2 text-2xl font-black">Member Portal</h1>
                </div>
                <nav className="grid gap-1 p-4">
                    {navItems.map(({ label, href, icon: Icon, exact }) => {
                        const active = exact ? url === href : url.startsWith(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                                    active ? 'bg-white text-sky-950 shadow-sm' : 'text-sky-50 hover:bg-white/10'
                                }`}
                            >
                                <Icon aria-hidden="true" size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/95 backdrop-blur">
                    <div className="flex min-h-18 items-center justify-between gap-4 px-5 py-3 lg:px-8">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Welcome, {auth.user?.name}</p>
                            <h2 className="text-2xl font-bold tracking-tight text-sky-950">{title}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            {actions}
                            <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
                                {auth.user?.avatar_url ? (
                                    <img src={auth.user.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-sky-700 text-sm font-black text-white">
                                        {initials || <User aria-hidden="true" size={18} />}
                                    </span>
                                )}
                                <span>
                                    <span className="block text-sm font-black text-slate-800">{auth.user?.name}</span>
                                    <span className="text-xs font-black uppercase tracking-[0.14em] text-sky-600">Member</span>
                                </span>
                            </div>
                            <Link href="/logout" method="post" as="button" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 font-black text-red-700 hover:bg-red-100">
                                <LogOut aria-hidden="true" size={18} />
                                <span className="sr-only">Logout</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto border-t border-sky-100 px-4 py-3 lg:hidden">
                        {navItems.map(({ label, href, exact }) => {
                            const active = exact ? url === href : url.startsWith(href);

                            return (
                                <Link key={href} href={href} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${active ? 'bg-sky-700 text-white' : 'bg-sky-50 text-sky-900'}`}>
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </header>

                <main className="p-5 lg:p-8">
                    {flash.success ? <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800 shadow-sm">{flash.success}</div> : null}
                    {flash.error ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-800 shadow-sm">{flash.error}</div> : null}
                    {children}
                </main>
            </div>
        </div>
    );
}
