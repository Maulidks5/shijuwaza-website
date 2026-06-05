import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowLeft, Download, FileText, Megaphone } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PublicCta from '../../Components/Public/PublicCta';

export default function AnnouncementShow({ announcement, relatedAnnouncements = [] }) {
    return (
        <PublicLayout>
            <SeoHead title={announcement.title} description={announcement.excerpt} type="article" />
            <article className="bg-white py-20">
                <div className="section-shell max-w-4xl">
                    <Link href="/announcements" className="inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                        <ArrowLeft aria-hidden="true" size={17} />
                        Back to Announcements
                    </Link>

                    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F3FBFD] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#5BAFCB]">
                        <Megaphone aria-hidden="true" size={17} />
                        {announcement.published_label || 'Announcement'}
                    </div>
                    <h1 className="section-title mt-5">{announcement.title}</h1>
                    <p className="mt-6 text-xl leading-relaxed text-slate-600">{announcement.excerpt}</p>

                    {announcement.document_url ? (
                        <div className="mt-8 rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-6 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                        <FileText aria-hidden="true" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#245E73]">Announcement document</h2>
                                        <p className="mt-1 leading-6 text-slate-600">Open or download the attached official document.</p>
                                    </div>
                                </div>
                                <a href={announcement.document_url} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center justify-center gap-2">
                                    <Download aria-hidden="true" size={18} />
                                    Open Document
                                </a>
                            </div>
                        </div>
                    ) : null}

                    <div className="section-copy mt-8 whitespace-pre-line">{announcement.body || announcement.excerpt}</div>
                </div>
            </article>

            {relatedAnnouncements.length ? (
                <section className="bg-[#F8FAFC] py-20">
                    <div className="section-shell">
                        <p className="eyebrow">More announcements</p>
                        <h2 className="section-title mt-3">Recent notices</h2>
                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {relatedAnnouncements.map((item) => (
                                <Link key={item.id} href={item.href} className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                    <Megaphone aria-hidden="true" size={25} className="text-[#5BAFCB]" />
                                    <h3 className="mt-5 text-xl font-black text-[#245E73]">{item.title}</h3>
                                    <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{item.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
            <PublicCta />
        </PublicLayout>
    );
}
