import { ExternalLink } from 'lucide-react';

const fallbackPartners = [
    { name: 'Government Institutions' },
    { name: 'Civil Society Organizations' },
    { name: 'Media Partners' },
    { name: 'Development Partners' },
    { name: 'OPD Network' },
    { name: 'Community Organizations' },
];

export default function PartnersSection({ partners = [] }) {
    const items = partners.length ? partners : fallbackPartners;
    const sliderItems = [...items, ...items, ...items];
    const scrollDuration = `${Math.max(items.length * 5, 30)}s`;

    return (
        <section id="partners" className="overflow-hidden bg-[#F8FCFD] py-14 lg:py-16">
            <div className="section-shell">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="eyebrow">Our Partners</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#245E73] sm:text-3xl">Trusted organizations moving with us</h2>
                    </div>
                    <p className="max-w-xl leading-7 text-slate-600">SHIJUWAZA collaborates with institutions, OPDs, civil society, media, and development partners supporting inclusive progress.</p>
                </div>

                <div className="relative border-y border-[#5BAFCB]/12 bg-white py-5 shadow-[0_18px_45px_rgba(36,94,115,0.06)]">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20 md:w-32" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20 md:w-32" />
                    <div
                        className="partner-slider flex w-max gap-4 px-4"
                        style={{ '--partner-scroll-duration': scrollDuration }}
                        aria-label="SHIJUWAZA partner logos"
                    >
                        {sliderItems.map((partner, index) => (
                            <PartnerCard key={`${partner.name}-${index}`} partner={partner} duplicate={index >= items.length} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PartnerCard({ partner, duplicate = false }) {
    const initials = partner.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    const content = (
        <article
            aria-hidden={duplicate ? 'true' : undefined}
            className="group relative flex h-20 w-44 shrink-0 items-center justify-center rounded-lg border border-[#5BAFCB]/12 bg-white px-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#5BAFCB]/35 hover:shadow-md sm:h-24 sm:w-64 sm:px-5"
        >
            <div className="grid h-16 w-full place-items-center">
                {partner.logo_url ? (
                    <img src={partner.logo_url} alt={`${partner.name} logo`} className="max-h-14 w-full object-contain transition duration-200 group-hover:scale-[1.03]" loading="lazy" />
                ) : (
                    <span className="inline-flex h-14 min-w-14 items-center justify-center rounded-lg bg-[#F3FBFD] px-4 text-lg font-black text-[#087D96]">{initials || 'P'}</span>
                )}
            </div>
            <span className="sr-only">{partner.name}</span>
            {partner.website_url ? <ExternalLink className="absolute right-3 top-3 text-[#5BAFCB] opacity-0 transition group-hover:opacity-100" size={14} aria-hidden="true" /> : null}
        </article>
    );

    if (partner.website_url) {
        return (
            <a
                href={partner.website_url}
                target="_blank"
                rel="noreferrer"
                aria-hidden={duplicate ? 'true' : undefined}
                aria-label={`Open ${partner.name} website`}
                tabIndex={duplicate ? -1 : undefined}
            >
                {content}
            </a>
        );
    }

    return content;
}
