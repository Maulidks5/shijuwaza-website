import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { Download, FileText } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import MemberUpdateTextModal from '../../Components/Public/MemberUpdateTextModal';

export default function MemberUpdates({ updates = { data: [], links: [] } }) {
    const items = updates.data || updates;
    const [openUpdate, setOpenUpdate] = useState(null);

    return (
        <PublicLayout>
            <SeoHead title="Member Updates" description="Read approved text updates and documents submitted by SHIJUWAZA member OPDs." />
            <PageHero eyebrow="Member Updates" title="Approved updates from SHIJUWAZA member OPDs.">
                Documents and text updates published here have been reviewed and approved by SHIJUWAZA admin.
            </PageHero>

            <section className="bg-[#F8FAFC] py-16 lg:py-20">
                <div className="section-shell">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {items.length ? items.map((update) => (
                            <article key={update.id} className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="flex items-start gap-3">
                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                        {update.type === 'document' ? <Download aria-hidden="true" size={23} /> : <FileText aria-hidden="true" size={23} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{update.member?.acronym || 'Member OPD'}</p>
                                        <h2 className="mt-2 text-xl font-black leading-tight text-[#245E73]">{update.title}</h2>
                                    </div>
                                </div>
                                <p className="mt-4 leading-7 text-slate-600">{update.excerpt}</p>
                                <div className="mt-6 flex items-center justify-between gap-3">
                                    <span className="text-sm font-bold text-slate-500">{update.approved_at}</span>
                                    {update.type === 'document' && update.document_url ? (
                                        <a href={update.document_url} target="_blank" rel="noreferrer" className="font-black text-[#5BAFCB]">Open Document</a>
                                    ) : update.body ? (
                                        <button type="button" onClick={() => setOpenUpdate(update)} className="font-black text-[#5BAFCB]">Read Text</button>
                                    ) : update.member?.slug ? (
                                        <Link href={`/members/${update.member.slug}`} className="font-black text-[#5BAFCB]">Member Profile</Link>
                                    ) : null}
                                </div>
                            </article>
                        )) : (
                            <div className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-8 shadow-sm md:col-span-2 xl:col-span-3">
                                <h2 className="text-2xl font-black text-[#245E73]">No member updates published yet</h2>
                                <p className="mt-3 leading-7 text-slate-600">Approved member documents and text updates will appear here.</p>
                            </div>
                        )}
                    </div>

                    {updates.links?.length ? (
                        <div className="mt-10 flex flex-wrap gap-2">
                            {updates.links.map((link, index) => (
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
            <MemberUpdateTextModal update={openUpdate} onClose={() => setOpenUpdate(null)} />
        </PublicLayout>
    );
}
