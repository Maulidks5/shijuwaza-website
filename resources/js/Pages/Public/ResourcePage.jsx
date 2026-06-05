import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowRight, Download, FileText } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import PublicCta from '../../Components/Public/PublicCta';

export default function ResourcePage({ eyebrow, title, copy, items = { data: [], links: [] } }) {
    const resourceItems = items.data || items;

    return (
        <PublicLayout>
            <SeoHead title={eyebrow} description={copy} />
            <PageHero eyebrow={eyebrow} title={title}>{copy}</PageHero>
            <section className="bg-[#F8FAFC] py-20">
                <div className="section-shell">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {resourceItems.length ? resourceItems.map((item) => (
                            <ResourceCard key={item.id || item.title} item={item} />
                        )) : (
                            <div className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-8 shadow-sm md:col-span-2 xl:col-span-3">
                                <h2 className="text-2xl font-black text-[#245E73]">Resource library coming soon</h2>
                                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
                                    SHIJUWAZA will publish verified organizational resources here as documents are prepared and approved.
                                </p>
                            </div>
                        )}
                    </div>

                    {items.links?.length > 3 ? (
                        <div className="mt-10 flex flex-wrap gap-2">
                            {items.links.map((link, index) => (
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
            <PublicCta title="Need a document or organizational profile?" copy="Contact SHIJUWAZA for official reports, partnership information, or OPD coordination support." primaryHref="/contact" primaryLabel="Contact Us" />
        </PublicLayout>
    );
}

function ResourceCard({ item }) {
    const hasDownload = Boolean(item.file_url);

    const content = (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#5BAFCB]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {item.cover_image_url ? (
                <img src={item.cover_image_url} alt={item.title} className="h-48 w-full object-cover" />
            ) : (
                <div className="grid h-40 place-items-center bg-[#F3FBFD] text-[#5BAFCB]">
                    <FileText aria-hidden="true" size={42} />
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{item.published_label || item.category_label}</p>
                <h2 className="mt-3 text-xl font-black leading-tight text-[#245E73]">{item.title}</h2>
                <p className="mt-3 line-clamp-4 flex-1 leading-7 text-slate-600">{item.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                    {hasDownload ? 'Download' : 'Read More'}
                    {hasDownload ? <Download aria-hidden="true" size={17} /> : <ArrowRight aria-hidden="true" size={17} className="transition group-hover:translate-x-1" />}
                </span>
            </div>
        </article>
    );

    if (hasDownload) {
        return <a href={item.href || '#'} target="_blank" rel="noreferrer">{content}</a>;
    }

    return <Link href={item.href || '#'}>{content}</Link>;
}
