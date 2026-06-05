import { Megaphone } from 'lucide-react';

const fallbackAnnouncements = [
    'SHIJUWAZA welcomes partners supporting disability inclusion across Zanzibar.',
    'Join our work in advocacy, capacity building, and inclusive development.',
    'Support OPD-led action for equal rights and meaningful participation.',
];

export default function AnnouncementTicker({ items = [] }) {
    const announcements = (items.length ? items : fallbackAnnouncements)
        .map((item) => (typeof item === 'string' ? { title: item, href: '/announcements' } : { title: item.title || item.excerpt, href: item.href || '/announcements' }))
        .filter((item) => item.title)
        .slice(0, 6);
    const tickerItems = [...announcements, ...announcements];

    if (!tickerItems.length) {
        return null;
    }

    return (
        <section className="border-y border-[#9DD8EA]/55 bg-white" aria-label="Announcements">
            <div className="flex items-center overflow-hidden">
                <div className="flex shrink-0 items-center gap-2 bg-[#9DD8EA] px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#173B49] sm:px-8">
                    <Megaphone aria-hidden="true" size={18} className="text-[#245E73]" />
                    <span className="hidden sm:inline">Announcements</span>
                    <span className="sr-only sm:hidden">Announcements</span>
                </div>
                <div className="relative min-w-0 flex-1 overflow-hidden py-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />
                    <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap px-6 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
                        {tickerItems.map((announcement, index) => {
                            const duplicate = index >= announcements.length;

                            return (
                            <a
                                key={`${announcement.title}-${index}`}
                                href={announcement.href}
                                aria-hidden={duplicate ? 'true' : undefined}
                                tabIndex={duplicate ? -1 : undefined}
                                className="inline-flex items-center gap-8 text-sm font-bold text-slate-700 transition hover:text-[#5BAFCB] sm:text-base"
                            >
                                <span>{announcement.title}</span>
                                <span className="h-2 w-2 rounded-full bg-[#9DD8EA]" aria-hidden="true" />
                            </a>
                        );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
