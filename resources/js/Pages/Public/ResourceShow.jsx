import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PublicCta from '../../Components/Public/PublicCta';

export default function ResourceShow({ resource, relatedResources = [] }) {
    return (
        <PublicLayout>
            <SeoHead title={resource.title} description={resource.excerpt} image={resource.cover_image_url} type="article" />
            <article className="bg-white py-20">
                <div className="section-shell max-w-4xl">
                    <Link href={categoryHref(resource.category)} className="inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                        <ArrowLeft aria-hidden="true" size={17} />
                        Back to {resource.category_label}
                    </Link>
                    <p className="eyebrow mt-8">{resource.category_label} {resource.published_label ? `• ${resource.published_label}` : ''}</p>
                    <h1 className="section-title mt-3">{resource.title}</h1>
                    <p className="mt-6 text-xl leading-relaxed text-slate-600">{resource.excerpt}</p>

                    {resource.cover_image_url ? <img src={resource.cover_image_url} alt={resource.title} className="mt-8 max-h-[520px] w-full rounded-2xl object-cover" /> : null}

                    {resource.file_url ? (
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href={resource.file_url} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
                                <Download aria-hidden="true" size={18} />
                                Download Document
                            </a>
                        </div>
                    ) : null}

                    <div className="section-copy mt-8 whitespace-pre-line">{resource.body || resource.excerpt}</div>
                </div>
            </article>

            {relatedResources.length ? (
                <section className="bg-[#F8FAFC] py-20">
                    <div className="section-shell">
                        <p className="eyebrow">Related resources</p>
                        <h2 className="section-title mt-3">More from this category</h2>
                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {relatedResources.map((item) => (
                                <Link key={item.id} href={`/resources/${item.slug}`} className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                        <FileText aria-hidden="true" size={21} />
                                    </div>
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

function categoryHref(category) {
    return {
        newsletter: '/newsletters',
        report: '/reports',
        strategic_plan: '/strategic-plan',
        article_success_story: '/articles',
    }[category] || '/reports';
}
