import { Link, router, useForm } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';

export default function News({ posts = { data: [], links: [] }, featuredPost = null, categories = {}, filters = {} }) {
    const items = posts.data || posts;
    const { data, setData } = useForm({ search: filters.search || '' });
    const updateCategory = (category) => router.get('/news', { ...filters, category }, { preserveState: true, preserveScroll: true });
    const submitSearch = (event) => {
        event.preventDefault();
        router.get('/news', { ...filters, search: data.search }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <SeoHead title="Updates & Activities" description="Read the latest SHIJUWAZA activities, training updates, advocacy stories, partnerships, and disability inclusion work from Zanzibar." />
            <PageHero eyebrow="Updates & Activities" title="Stories from SHIJUWAZA's advocacy, training, and inclusion work.">
                Follow recent activities, public dialogues, media engagement, partnerships, and progress from member-led programs.
            </PageHero>
            <section className="bg-[#F8FAFC] py-12 lg:py-20">
                <div className="section-shell">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                        <div>
                            <p className="eyebrow">Latest updates</p>
                            <h1 className="section-title mt-3">Recent activities and organizational stories</h1>
                        </div>
                        <form onSubmit={submitSearch} className="flex w-full min-w-0 max-w-md gap-2 rounded-full border border-[#5BAFCB]/10 bg-white p-2 shadow-sm">
                            <input aria-label="Search updates" value={data.search} onChange={(event) => setData('search', event.target.value)} placeholder="Search updates" className="min-w-0 flex-1 rounded-full px-4 py-2 outline-none" />
                            <button className="rounded-full bg-[#5BAFCB] px-4 py-2 font-black text-white">Search</button>
                        </form>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                        <button type="button" onClick={() => updateCategory('')} className={`rounded-full px-4 py-2 text-sm font-black transition ${!filters.category ? 'bg-[#5BAFCB] text-white' : 'bg-white text-[#245E73] hover:bg-[#F3FBFD]'}`}>All</button>
                        {Object.entries(categories).map(([value, label]) => (
                            <button key={value} type="button" onClick={() => updateCategory(value)} className={`rounded-full px-4 py-2 text-sm font-black transition ${filters.category === value ? 'bg-[#5BAFCB] text-white' : 'bg-white text-[#245E73] hover:bg-[#F3FBFD]'}`}>{label}</button>
                        ))}
                    </div>

                    {featuredPost ? (
                        <article className="surface-card mt-10 grid overflow-hidden rounded-2xl bg-white lg:grid-cols-[1.1fr_0.9fr]">
                            {featuredPost.image_url ? <img src={featuredPost.image_url} alt={featuredPost.title} className="h-full min-h-[320px] w-full object-cover" /> : null}
                            <div className="p-5 sm:p-8">
                                <p className="eyebrow">{featuredPost.category_label || 'Featured'}</p>
                                <h2 className="mt-3 text-2xl font-black leading-tight text-[#245E73] sm:text-3xl">{featuredPost.title}</h2>
                                <p className="mt-4 leading-8 text-slate-600">{featuredPost.excerpt}</p>
                                <Link href={`/news/${featuredPost.slug}`} className="btn-primary mt-6">Read Update</Link>
                            </div>
                        </article>
                    ) : null}

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        {items.map((post) => (
                            <article key={post.id} className="surface-card overflow-hidden rounded-2xl bg-white">
                                {post.image_url ? <img src={post.image_url} alt={post.title} className="h-56 w-full object-cover" /> : null}
                                <div className="p-5 sm:p-6">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-[#F3FBFD] px-3 py-1 text-xs font-black text-[#5BAFCB]">{post.category_label}</span>
                                        <span className="text-sm font-bold text-slate-500">{post.date_label}</span>
                                    </div>
                                    <h2 className="mt-3 text-xl font-black text-[#245E73] sm:text-2xl">{post.title}</h2>
                                    <p className="mt-4 leading-7 text-slate-600">{post.excerpt}</p>
                                    <Link href={`/news/${post.slug}`} className="mt-5 inline-flex font-black text-[#5BAFCB]">
                                        Read update
                                    </Link>
                                </div>
                            </article>
                        ))}
                        {!items.length ? (
                            <div className="surface-card rounded-2xl bg-white p-8 text-center lg:col-span-3">
                                <h2 className="text-2xl font-black text-[#245E73]">No updates found</h2>
                                <p className="mt-2 text-slate-600">Try another category or search term.</p>
                            </div>
                        ) : null}
                    </div>
                    {posts.links?.length ? (
                        <div className="mt-10 flex flex-wrap gap-2">
                            {posts.links.map((link, index) => (
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
        </PublicLayout>
    );
}
