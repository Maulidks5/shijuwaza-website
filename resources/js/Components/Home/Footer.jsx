import { LogIn, Mail, MapPin, Phone, ShieldAlert } from 'lucide-react';
import LogoMark from './LogoMark';
import { useI18n } from '../../lib/i18n';
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons';

const links = [
    ['nav.home', '/'],
    ['nav.about', '/about'],
    ['nav.programs', '/programs'],
    ['nav.members', '/members'],
    ['nav.gallery', '/gallery'],
    ['nav.contact', '/contact'],
];

const socialLinks = (settings) => [
    { label: 'Instagram', icon: InstagramIcon, href: settings.instagram_url || '#' },
    { label: 'Facebook', icon: FacebookIcon, href: settings.facebook_url || '#' },
    { label: 'LinkedIn', icon: LinkedInIcon, href: settings.linkedin_url || '#' },
    { label: 'YouTube', icon: YouTubeIcon, href: settings.youtube_url || '#' },
];

export default function Footer({ settings = {} }) {
    const { t } = useI18n();
    const email = settings.email || 'info@shijuwaza.or.tz';
    const phone = settings.phone || '+255 000 000 000';
    const location = settings.location || 'Zanzibar, Tanzania';

    return (
        <footer className="border-t border-[#9DD8EA]/60 bg-[#9DD8EA] text-[#173B49]">
            <div className="section-shell grid gap-9 py-10 sm:py-12 lg:grid-cols-[1.15fr_0.75fr_1fr] lg:py-14">
                <div>
                    <LogoMark />
                    <p className="mt-5 max-w-md leading-8 text-[#245E73]">
                        {t('footer.mission')}
                    </p>
                    <div className="mt-6 grid gap-3 text-sm font-bold text-[#245E73]">
                        <ContactLink href={`mailto:${email}`} icon={Mail}>{email}</ContactLink>
                        <ContactLink href={`tel:${phone.replaceAll(' ', '')}`} icon={Phone}>{phone}</ContactLink>
                        <ContactItem icon={MapPin}>{location}</ContactItem>
                    </div>
                </div>

                <div>
                    <FooterLinks title={t('footer.quick_links')} links={links} t={t} />
                </div>

                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[#245E73]">Support SHIJUWAZA</h2>
                    <p className="mt-4 max-w-md leading-7 text-[#245E73]">
                        Partner with us, support OPD-led inclusion, or access the secure portal for member and admin work.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                        <a href="/donate" className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-[#173B49] shadow-sm transition hover:bg-[#F3FBFD]">
                            {t('nav.donate')}
                        </a>
                        <a href="/partner-with-us" className="rounded-full border border-white/60 px-5 py-3 text-center text-sm font-black text-[#173B49] transition hover:bg-white/35">
                            {t('nav.partner')}
                        </a>
                    </div>
                    <a href="/login" target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/60 px-5 py-3 text-sm font-black text-[#173B49] transition hover:bg-white/35 sm:w-auto" title={t('footer.portal_login')} aria-label={t('footer.portal_login')}>
                        <LogIn size={16} aria-hidden="true" />
                        {t('footer.login')}
                    </a>
                    <a href="/whistle-blowers" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173B49] px-5 py-3 text-sm font-black text-white transition hover:bg-[#245E73] sm:w-auto">
                        <ShieldAlert size={16} aria-hidden="true" />
                        Whistle Blowers
                    </a>

                    <div className="mt-7 flex flex-wrap gap-3" aria-label="Social media links">
                        {socialLinks(settings).map(({ label, icon: Icon, href }) => (
                            <a key={label} href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'} className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/30 text-[#173B49] transition hover:-translate-y-0.5 hover:bg-white/55">
                                <Icon aria-hidden="true" className="h-5 w-5" />
                                <span className="sr-only">{label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/55 py-5">
                <div className="section-shell flex flex-col gap-3 text-sm text-[#245E73] lg:flex-row lg:items-center lg:justify-between">
                    <p className="leading-6">Copyright &copy; {new Date().getFullYear()} SHIJUWAZA. {t('footer.copyright')}</p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5 lg:justify-end">
                        <a href="https://www.myt.co.tz" target="_blank" rel="noreferrer" className="font-bold leading-6 text-[#173B49] transition hover:text-[#245E73]">
                            Developed by Mwambao Youth Technology (www.myt.co.tz)
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLinks({ title, links, t }) {
    return (
        <div>
            <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[#245E73]">{title}</h2>
            <ul className="mt-4 grid gap-2.5">
                {links.map(([labelKey, href]) => (
                    <li key={labelKey}>
                        <a href={href} className="inline-flex text-sm font-bold text-[#245E73] transition hover:text-[#173B49]">
                            {t(labelKey)}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ContactLink({ href, icon: Icon, children }) {
    return (
        <a href={href} className="inline-flex items-start gap-3 transition hover:text-[#173B49]">
            <Icon aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-[#173B49]" />
            <span className="min-w-0 break-words">{children}</span>
        </a>
    );
}

function ContactItem({ icon: Icon, children }) {
    return (
        <p className="inline-flex items-start gap-3">
            <Icon aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-[#173B49]" />
            <span className="min-w-0 break-words">{children}</span>
        </p>
    );
}
