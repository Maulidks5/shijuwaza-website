import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';

export default function Media({ items = [] }) {
    const featured = items.find((item) => item.is_featured) || items[0];
    const tabs = ['All', 'Images', 'Videos'];

    return (
        <PublicLayout>
            <SeoHead title="Media" description="View SHIJUWAZA media items documenting inclusion, advocacy, trainings, community dialogues, and partner engagement." />
            <PageHero eyebrow="Media Gallery" title="Documenting inclusion in action through photos, stories, and video.">
                Explore moments from trainings, dialogues, advocacy forums, partner engagement, and OPD-led activities.
            </PageHero>
            <section className="bg-[#F8FAFC] py-20">
                <div className="section-shell">
                    {featured ? (
                        <article className="surface-card grid overflow-hidden rounded-2xl bg-white lg:grid-cols-[1.1fr_0.9fr]">
                            {featured.image_url ? <img src={featured.image_url} alt={featured.title} className="h-full min-h-[330px] w-full object-cover" /> : null}
                            <div className="p-8">
                                <p className="eyebrow">Featured media</p>
                                <h2 className="mt-3 text-3xl font-black text-[#245E73]">{featured.title}</h2>
                                <p className="mt-4 leading-8 text-slate-600">{featured.description || 'A featured visual story from SHIJUWAZA activities.'}</p>
                                {featured.video_url ? <a href={featured.video_url} className="btn-primary mt-6">Watch Video</a> : null}
                            </div>
                        </article>
                    ) : null}
                    <div className="mt-10 flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button key={tab} className="rounded-full border border-[#5BAFCB]/10 bg-white px-5 py-2 font-black text-[#0786A4] hover:bg-[#F3FBFD]">{tab}</button>
                        ))}
                    </div>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <article key={item.id} className="surface-card group overflow-hidden rounded-2xl bg-white">
                                {item.image_url ? <img src={item.image_url} alt={item.title} className="h-60 w-full object-cover" /> : null}
                                <div className="p-5">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{item.type}</p>
                                    <h2 className="text-xl font-black text-[#245E73]">{item.title}</h2>
                                    {item.description ? <p className="mt-3 leading-7 text-slate-600">{item.description}</p> : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
