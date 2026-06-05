import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowRight, Download, Megaphone } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import PublicCta from '../../Components/Public/PublicCta';

export default function Announcements({ announcements = { data: [], links: [] } }) {
    const items = announcements.data || announcements;

    return (
        <PublicLayout>
            <SeoHead title="Announcements" description="View official SHIJUWAZA announcements, opportunities, document notices, and organizational updates." />
            <PageHero eyebrow="Announcements" title="Organizational notices and opportunities">
                Read official SHIJUWAZA announcements, opportunities, document notices, and coordination updates.
            </PageHero>

            <section className="bg-[#F8FAFC] py-20">
                <div className="section-shell">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {items.length ? items.map((announcement) => (
                            <Link key={announcement.id} href={announcement.href} className="group flex h-full flex-col rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="flex items-start gap-3">
                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                        <Megaphone aria-hidden="true" size={23} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{announcement.published_label || 'Announcement'}</p>
                                        <h2 className="mt-2 text-xl font-black leading-tight text-[#245E73]">{announcement.title}</h2>
                                    </div>
                                </div>
                                <p className="mt-4 line-clamp-4 flex-1 leading-7 text-slate-600">{announcement.description}</p>
                                <span className="mt-6 inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                                    View Details
                                    {announcement.document_url ? <Download aria-hidden="true" size={17} /> : <ArrowRight aria-hidden="true" size={17} className="transition group-hover:translate-x-1" />}
                                </span>
                            </Link>
                        )) : (
                            <div className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-8 shadow-sm md:col-span-2 xl:col-span-3">
                                <h2 className="text-2xl font-black text-[#245E73]">No announcements published yet</h2>
                                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
                                    Official announcements will appear here after they are published by SHIJUWAZA.
                                </p>
                            </div>
                        )}
                    </div>

                    {announcements.links?.length > 3 ? (
                        <div className="mt-10 flex flex-wrap gap-2">
                            {announcements.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-full px-4 py-2 text-sm font-bold ${link.active ? 'bg-[#5BAFCB] text-white' : 'bg-white text-slate-700'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>
            <PublicCta title="Need more information?" copy="Contact SHIJUWAZA for clarification on announcements, opportunities, and organizational notices." primaryHref="/contact" primaryLabel="Contact Us" />
        </PublicLayout>
    );
}
