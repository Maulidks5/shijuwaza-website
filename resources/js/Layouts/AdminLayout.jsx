import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    BookOpenText,
    Megaphone,
    Image,
    Inbox,
    ShieldAlert,
    LayoutDashboard,
    LogOut,
    HandHeart,
    LayoutPanelTop,
    Newspaper,
    Settings,
    Shapes,
    User,
    UserPlus,
    IdCard,
    UsersRound,
} from 'lucide-react';
import RoleBadge from '../Components/Admin/RoleBadge';
import SessionSecurity from '../Components/Security/SessionSecurity';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'view dashboard' },
    { label: 'Users', href: '/admin/users', icon: UserPlus, permission: 'manage users' },
    { label: 'Hero Section', href: '/admin/hero-section', icon: LayoutPanelTop, permission: 'manage hero section' },
    { label: 'Homepage Stats', href: '/admin/stats', icon: BarChart3, permission: 'manage homepage stats' },
    { label: 'Programs', href: '/admin/programs', icon: Shapes, permission: 'manage programs' },
    { label: 'Updates & Activities', href: '/admin/news', icon: Newspaper, permission: 'manage news' },
    { label: 'Announcements', href: '/admin/announcements', icon: Megaphone, permission: 'manage announcements' },
    { label: 'Resources', href: '/admin/resources', icon: BookOpenText, permission: 'manage resources' },
    { label: 'Media Gallery', href: '/admin/media', icon: Image, permission: 'manage media' },
    { label: 'Members', href: '/admin/members', icon: UsersRound, permission: 'manage members' },
    { label: 'Leadership Profiles', href: '/admin/leadership-profiles', icon: IdCard, permission: 'manage leadership profiles' },
    { label: 'Partners', href: '/admin/partners', icon: UsersRound, permission: 'manage partners' },
    { label: 'Contact Messages', href: '/admin/contact-messages', icon: Inbox, permission: 'manage contact messages' },
    { label: 'Whistle Blowers', href: '/admin/whistleblower-reports', icon: ShieldAlert, permission: 'manage whistleblower reports' },
    { label: 'Donations', href: '/admin/donations', icon: HandHeart, permission: 'manage donations' },
    { label: 'Partnership Requests', href: '/admin/partnership-requests', icon: UserPlus, permission: 'manage partnership requests' },
    { label: 'Visitors', href: '/admin/visitors', icon: BarChart3, permission: 'manage visitor analytics' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, permission: 'manage settings' },
];

export default function AdminLayout({ title, actions, children }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const page = usePage();
    const { auth, flash, adminNotifications = { total: 0, items: [], badges: {} } } = page.props;
    const url = page.url;
    const permissions = auth.user?.permissions || [];
    const primaryRole = auth.user?.roles?.[0];
    const isSuperAdmin = auth.user?.roles?.includes('Super Admin');
    const visibleNavItems = navItems.filter((item) => isSuperAdmin || permissions.includes(item.permission));
    const initials = auth.user?.name
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="admin-shell min-h-screen bg-[#F3FBFD] text-slate-900">
            <SessionSecurity />
            <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[#9DD8EA]/50 bg-white text-[#173B49] shadow-[12px_0_45px_rgba(74,136,154,0.08)] lg:block">
                <div className="border-b border-[#9DD8EA]/45 bg-[#9DD8EA]/45 p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#245E73]">SHIJUWAZA CMS</p>
                    <h1 className="mt-2 text-2xl font-black text-[#173B49]">Admin Panel</h1>
                </div>
                <nav className="grid gap-1 p-4">
                    {visibleNavItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        const badgeCount = adminNotifications.badges?.[href] || 0;

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                                    active ? 'bg-[#9DD8EA] text-[#173B49] shadow-sm' : 'text-[#245E73] hover:bg-[#F3FBFD] hover:text-[#173B49]'
                                }`}
                            >
                                <Icon aria-hidden="true" size={18} />
                                <span className="min-w-0 flex-1">{label}</span>
                                {badgeCount ? <Badge count={badgeCount} /> : null}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-[#9DD8EA]/45 bg-white/95 backdrop-blur">
                    <div className="flex min-h-18 flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-8">
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">Welcome, {auth.user?.name}</p>
                            <h2 className="truncate text-xl font-bold tracking-tight text-[#245E73] sm:text-2xl">{title}</h2>
                        </div>
                        <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-end sm:gap-3">
                            {actions ? <div className="admin-header-actions flex min-w-0 flex-1 flex-wrap gap-2 sm:flex-none sm:justify-end">{actions}</div> : null}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setNotificationsOpen((value) => !value)}
                                    className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[#245E73] shadow-sm hover:bg-slate-50"
                                    aria-expanded={notificationsOpen}
                                    aria-haspopup="menu"
                                    aria-label="Admin notifications"
                                >
                                    <Bell aria-hidden="true" size={20} />
                                    {adminNotifications.total ? (
                                        <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1.5 text-[10px] font-black text-white">
                                            {adminNotifications.total > 99 ? '99+' : adminNotifications.total}
                                        </span>
                                    ) : null}
                                </button>
                                {notificationsOpen ? (
                                    <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" role="menu">
                                        <div className="border-b border-slate-100 bg-[#F3FBFD] p-4">
                                            <p className="font-black text-[#173B49]">Needs Attention</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">{adminNotifications.total || 0} pending item{adminNotifications.total === 1 ? '' : 's'}</p>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto p-2">
                                            {adminNotifications.items?.length ? adminNotifications.items.map((item) => (
                                                <Link key={item.key} href={item.href} className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 font-bold text-slate-700 hover:bg-[#F3FBFD]" role="menuitem">
                                                    <span>{item.label}</span>
                                                    <Badge count={item.count} />
                                                </Link>
                                            )) : (
                                                <p className="rounded-lg px-3 py-5 text-center text-sm font-bold text-slate-500">No urgent requests right now.</p>
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen((value) => !value)}
                                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm hover:bg-slate-50"
                                    aria-expanded={profileOpen}
                                    aria-haspopup="menu"
                                >
                                    {auth.user?.avatar_url ? (
                                        <img src={auth.user.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                                    ) : (
                                            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#9DD8EA] text-sm font-black text-[#173B49]">
                                            {initials || <User aria-hidden="true" size={18} />}
                                        </span>
                                    )}
                                    <span className="hidden sm:block">
                                        <span className="block text-sm font-black text-slate-800">{auth.user?.name}</span>
                                        <span className="mt-1 block"><RoleBadge role={primaryRole} /></span>
                                    </span>
                                </button>
                                {profileOpen ? (
                                    <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-2rem)] max-w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" role="menu">
                                        <div className="border-b border-slate-100 p-4">
                                            <p className="font-black text-slate-900">{auth.user?.name}</p>
                                            <p className="mt-1 text-sm text-slate-500">{auth.user?.email}</p>
                                        </div>
                                        <Link href="/admin/profile" className="flex items-center gap-2 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50" role="menuitem">
                                            <User aria-hidden="true" size={17} />
                                            Profile
                                        </Link>
                                        <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-2 px-4 py-3 text-left font-bold text-red-700 hover:bg-red-50" role="menuitem">
                                            <LogOut aria-hidden="true" size={17} />
                                            Logout
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 lg:hidden">
                        {visibleNavItems.map(({ label, href }) => (
                            <Link key={href} href={href} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold shadow-sm ${url.startsWith(href) ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'}`}>
                                {label}
                                {adminNotifications.badges?.[href] ? <Badge count={adminNotifications.badges[href]} /> : null}
                            </Link>
                        ))}
                    </div>
                </header>

                <main className="p-4 sm:p-5 lg:p-8">
                    {flash.success ? <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800 shadow-sm">{flash.success}</div> : null}
                    {flash.error ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-800 shadow-sm">{flash.error}</div> : null}
                    {children}
                </main>
            </div>
        </div>
    );
}

function Badge({ count }) {
    return (
        <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#173B49] px-1.5 text-[10px] font-black leading-none text-white">
            {count > 99 ? '99+' : count}
        </span>
    );
}
