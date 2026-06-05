import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
    ChevronDown,
} from 'lucide-react';
import LogoMark from './LogoMark';
import { useI18n } from '../../lib/i18n';
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons';

const navLinks = [
    ['nav.home', '/'],
    ['nav.about', '/about'],
    ['nav.programs', '/programs'],
    ['nav.members', '/members'],
    ['nav.gallery', '/gallery'],
    ['nav.news', '/news'],
    ['nav.contact', '/contact'],
];
const publicationLinks = [
    ['footer.reports', '/reports'],
    ['footer.newsletters', '/newsletters'],
    ['footer.strategic_plan', '/strategic-plan'],
    ['footer.articles', '/articles'],
];
const socialLinks = (settings) => [
    { label: 'Instagram', icon: InstagramIcon, href: settings.instagram_url || '#' },
    { label: 'Facebook', icon: FacebookIcon, href: settings.facebook_url || '#' },
    { label: 'LinkedIn', icon: LinkedInIcon, href: settings.linkedin_url || '#' },
    { label: 'YouTube', icon: YouTubeIcon, href: settings.youtube_url || '#' },
];

function Logo() {
    return (
        <a href="/" className="flex items-center rounded-md focus-visible:outline">
            <LogoMark />
        </a>
    );
}

export default function Navbar({ settings = {} }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();
    const { t } = useI18n();
    const email = settings.email || 'info@shijuwaza.or.tz';
    const phone = settings.phone || '+255 000 000 000';
    const location = settings.location || 'Zanzibar, Tanzania';

    return (
        <header className="sticky top-0 z-50 border-b border-[#9DD8EA]/55 bg-white/92 shadow-[0_12px_34px_rgba(74,136,154,0.12)] backdrop-blur-xl">
            <div className="hidden bg-[#9DD8EA] text-[#173B49] md:block">
                <div className="section-shell flex min-h-10 flex-wrap items-center justify-between gap-3 py-2 text-sm">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[#173B49]">
                        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full bg-white/30 px-3 py-1.5 transition hover:bg-white/48">
                            <Mail aria-hidden="true" size={14} />
                            {email}
                        </a>
                        <a href={`tel:${phone.replaceAll(' ', '')}`} className="inline-flex items-center gap-2 rounded-full bg-white/30 px-3 py-1.5 transition hover:bg-white/48">
                            <Phone aria-hidden="true" size={14} />
                            {phone}
                        </a>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/30 px-3 py-1.5">
                            <MapPin aria-hidden="true" size={14} />
                            {location}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-3 sm:flex" aria-label="Social media links">
                            {socialLinks(settings).map(({ label, icon: Icon, href }) => (
                                <a key={label} href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'} className="grid h-8 w-8 place-items-center rounded-full bg-white/30 text-[#173B49] transition hover:-translate-y-0.5 hover:bg-white/50">
                                    <Icon aria-hidden="true" className="h-4 w-4" />
                                    <span className="sr-only">{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <nav aria-label="Main navigation" className="section-shell flex min-h-16 items-center justify-between gap-3 py-2.5 sm:gap-5">
                <Logo />

                <div className="hidden items-center gap-1 rounded-full border border-[#5BAFCB]/10 bg-[#F8FAFC]/80 p-1 shadow-inner lg:flex">
                    {navLinks.slice(0, 3).map(([labelKey, href]) => {
                        const active = href === '/' ? url === '/' : url.startsWith(href);

                        return (
                        <a
                            key={labelKey}
                            href={href}
                            className={`rounded-full px-3.5 py-2 text-sm font-black transition ${
                                active
                                    ? 'bg-white text-[#245E73] shadow-sm ring-1 ring-[#5BAFCB]/10'
                                    : 'text-slate-600 hover:bg-white/100 hover:text-[#5BAFCB]'
                            }`}
                            aria-current={active ? 'page' : undefined}
                        >
                            {t(labelKey)}
                        </a>
                    );
                    })}
                    <div className="group relative">
                        <button
                            type="button"
                            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-black transition ${
                                publicationLinks.some(([, href]) => url.startsWith(href))
                                    ? 'bg-white text-[#245E73] shadow-sm ring-1 ring-[#5BAFCB]/10'
                                    : 'text-slate-600 hover:bg-white hover:text-[#5BAFCB]'
                            }`}
                            aria-haspopup="true"
                        >
                            {t('nav.publications')}
                            <ChevronDown aria-hidden="true" size={15} className="transition group-hover:rotate-180" />
                        </button>
                        <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-3xl border border-[#5BAFCB]/10 bg-white p-3 opacity-0 shadow-[0_24px_70px_rgba(10,61,98,0.18)] transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                            <div className="mb-2 rounded-2xl bg-[#F3FBFD] px-4 py-3">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{t('nav.publications')}</p>
                            </div>
                            {publicationLinks.map(([labelKey, href]) => {
                                const active = url.startsWith(href);

                                return (
                                    <a
                                        key={labelKey}
                                        href={href}
                                        className={`block rounded-2xl px-4 py-3 text-sm font-black transition ${
                                            active ? 'bg-[#245E73] text-white' : 'text-slate-700 hover:bg-[#F8FAFC] hover:text-[#5BAFCB]'
                                        }`}
                                    >
                                        {t(labelKey)}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    {navLinks.slice(3).map(([labelKey, href]) => {
                        const active = url.startsWith(href);

                        return (
                            <a
                                key={labelKey}
                                href={href}
                                className={`rounded-full px-3.5 py-2 text-sm font-black transition ${
                                    active
                                        ? 'bg-white text-[#245E73] shadow-sm ring-1 ring-[#5BAFCB]/10'
                                        : 'text-slate-600 hover:bg-white/100 hover:text-[#5BAFCB]'
                                }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {t(labelKey)}
                            </a>
                        );
                    })}
                </div>

                <div className="hidden items-center gap-2 lg:flex">
                    <a href="/donate" className="rounded-full bg-[#9DD8EA] px-4 py-2.5 text-sm font-black text-[#173B49] shadow-[0_10px_24px_rgba(42,212,236,0.24)] transition hover:-translate-y-0.5 hover:bg-[#7CC8DE]">
                        {t('nav.donate')}
                    </a>
                    <a href="/partner-with-us" className="rounded-full border border-[#9DD8EA]/55 px-4 py-2.5 text-sm font-black text-[#245E73] transition hover:-translate-y-0.5 hover:bg-[#F3FBFD]">
                        {t('nav.partner')}
                    </a>
                </div>

                <button
                    type="button"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5BAFCB]/15 bg-[#F8FAFC] text-[#245E73] shadow-sm lg:hidden"
                    aria-controls="mobile-menu"
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
                    <span className="sr-only">{t('nav.toggle')}</span>
                </button>
            </nav>

            {open ? (
                <div id="mobile-menu" className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-[#5BAFCB]/10 bg-white/95 shadow-2xl lg:hidden">
                    <div className="section-shell grid gap-2 py-4">
                        <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-3">
                            <div className="min-w-0 text-sm font-bold text-[#245E73]">
                                <a href={`tel:${phone.replaceAll(' ', '')}`} className="block truncate">{phone}</a>
                                <a href={`mailto:${email}`} className="mt-1 block truncate text-[#5BAFCB]">{email}</a>
                            </div>
                        </div>
                        {navLinks.slice(0, 3).map(([labelKey, href]) => {
                            const active = href === '/' ? url === '/' : url.startsWith(href);

                            return (
                            <a
                                key={labelKey}
                                href={href}
                                className={`rounded-xl px-4 py-2.5 font-black transition ${
                                    active ? 'bg-[#F3FBFD] text-[#245E73]' : 'text-slate-700 hover:bg-[#F3FBFD] hover:text-[#245E73]'
                                }`}
                                onClick={() => setOpen(false)}
                            >
                                {t(labelKey)}
                            </a>
                        );
                        })}
                        <div className="rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-2">
                            <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{t('nav.publications')}</p>
                            <div className="grid gap-1">
                                {publicationLinks.map(([labelKey, href]) => {
                                    const active = url.startsWith(href);

                                    return (
                                        <a
                                            key={labelKey}
                                            href={href}
                                            className={`rounded-lg px-3 py-2.5 font-black transition ${
                                                active ? 'bg-white text-[#245E73] shadow-sm' : 'text-slate-700 hover:bg-white hover:text-[#245E73]'
                                            }`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {t(labelKey)}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                        {navLinks.slice(3).map(([labelKey, href]) => {
                            const active = url.startsWith(href);

                            return (
                                <a
                                    key={labelKey}
                                    href={href}
                                    className={`rounded-xl px-4 py-2.5 font-black transition ${
                                        active ? 'bg-[#F3FBFD] text-[#245E73]' : 'text-slate-700 hover:bg-[#F3FBFD] hover:text-[#245E73]'
                                    }`}
                                    onClick={() => setOpen(false)}
                                >
                                    {t(labelKey)}
                                </a>
                            );
                        })}
                        <a href="/donate" className="mt-3 rounded-2xl bg-[#9DD8EA] px-5 py-3 text-center font-black text-[#173B49] shadow-sm" onClick={() => setOpen(false)}>
                            {t('nav.donate')}
                        </a>
                        <a href="/partner-with-us" className="rounded-2xl border border-[#9DD8EA]/55 px-5 py-3 text-center font-black text-[#245E73] shadow-sm" onClick={() => setOpen(false)}>
                            {t('nav.partner')}
                        </a>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
