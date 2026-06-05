import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';
import PublicCta from '../../Components/Public/PublicCta';

export default function NewsShow({ post, relatedPosts = [] }) {
    return (
        <PublicLayout>
            <SeoHead title={post.title} description={post.excerpt} image={post.image_url} type="article" />
            <article className="bg-white py-20">
                <div className="section-shell max-w-4xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#F3FBFD] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#5BAFCB]">{post.category_label}</span>
                        <span className="font-black text-slate-500">{post.date_label}</span>
                    </div>
                    <h1 className="section-title mt-3">{post.title}</h1>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {['Facebook', 'X', 'LinkedIn'].map((label) => (
                            <button key={label} className="rounded-full border border-[#5BAFCB]/10 bg-slate-50 px-4 py-2 text-sm font-black text-[#0786A4]">Share on {label}</button>
                        ))}
                    </div>
                    {post.image_url ? <img src={post.image_url} alt={post.title} className="mt-8 max-h-[520px] w-full rounded-2xl object-cover" /> : null}
                    <div className="section-copy mt-8 whitespace-pre-line">{post.body || post.excerpt}</div>
                </div>
            </article>
            {relatedPosts.length ? (
                <section className="bg-[#F8FAFC] py-20">
                    <div className="section-shell">
                        <p className="eyebrow">Related updates</p>
                        <h2 className="section-title mt-3">More activities from SHIJUWAZA</h2>
                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {relatedPosts.map((item) => (
                                <a key={item.id} href={`/news/${item.slug}`} className="surface-card overflow-hidden rounded-2xl bg-white">
                                    {item.image_url ? <img src={item.image_url} alt={item.title} className="h-44 w-full object-cover" /> : null}
                                    <div className="p-5">
                                        <p className="text-sm font-bold text-[#5BAFCB]">{item.category_label} · {item.date_label}</p>
                                        <h3 className="mt-2 text-xl font-black text-[#245E73]">{item.title}</h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
            <PublicCta />
        </PublicLayout>
    );
}
