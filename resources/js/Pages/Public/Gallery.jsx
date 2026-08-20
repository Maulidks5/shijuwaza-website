import { useEffect, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { CalendarDays, ChevronLeft, ChevronRight, ImageIcon, Loader2, X } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';

export default function Gallery({ featured = null, images = { data: [], links: [] } }) {
    const initialItems = images.data || images;
    const [galleryItems, setGalleryItems] = useState(initialItems);
    const [nextUrl, setNextUrl] = useState(images.next_page_url || null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const previewItems = useMemo(() => galleryItems, [galleryItems]);
    const selectedIndex = useMemo(() => previewItems.findIndex((item) => item.id === selectedId), [previewItems, selectedId]);
    const selected = selectedIndex >= 0 ? previewItems[selectedIndex] : null;
    const groupedImages = useMemo(() => {
        return galleryItems.reduce((groups, item) => {
            const key = item.month_label || 'Recent Photos';
            const group = groups.find((entry) => entry.label === key);

            if (group) {
                group.items.push(item);
            } else {
                groups.push({ label: key, items: [item] });
            }

            return groups;
        }, []);
    }, [galleryItems]);

    const openImage = (item) => setSelectedId(item.id);
    const closeImage = () => setSelectedId(null);
    const mergeImages = (currentItems, incomingItems) => {
        const existingIds = new Set(currentItems.map((item) => item.id));
        const nextItems = incomingItems.filter((item) => !existingIds.has(item.id));

        return [...currentItems, ...nextItems];
    };
    const loadMore = () => {
        if (!nextUrl || loadingMore) {
            return;
        }

        setLoadingMore(true);
        router.get(nextUrl, {}, {
            only: ['images'],
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setLoadingMore(false),
        });
    };
    const previousImage = () => {
        if (!previewItems.length) return;
        const index = selectedIndex <= 0 ? previewItems.length - 1 : selectedIndex - 1;
        setSelectedId(previewItems[index].id);
    };
    const nextImage = () => {
        if (!previewItems.length) return;
        const index = selectedIndex >= previewItems.length - 1 ? 0 : selectedIndex + 1;
        setSelectedId(previewItems[index].id);
    };

    useEffect(() => {
        const nextItems = images.data || images;
        const currentPage = images.current_page || 1;

        setNextUrl(images.next_page_url || null);
        setGalleryItems((currentItems) => (
            currentPage <= 1 ? nextItems : mergeImages(currentItems, nextItems)
        ));
    }, [images]);

    useEffect(() => {
        if (!selected) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeImage();
            }

            if (event.key === 'ArrowLeft') {
                previousImage();
            }

            if (event.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selected, selectedIndex]);

    return (
        <PublicLayout>
            <SeoHead title="Gallery" description="Explore SHIJUWAZA photos from trainings, dialogues, advocacy forums, partner meetings, and disability-inclusive development activities." image={featured?.image_url} />
            <PageHero eyebrow="Photo Gallery" title="Moments of inclusion, advocacy, and community action">
                Explore SHIJUWAZA photos from trainings, dialogues, member engagement, partner meetings, and disability-inclusive development work.
            </PageHero>

            <section className="bg-white py-16 lg:py-20">
                <div className="section-shell">
                    <div className="mb-8 border-b border-[#5BAFCB]/10 pb-6">
                        <div>
                            <p className="eyebrow">Browse Photos</p>
                            <h2 className="mt-3 text-3xl font-black text-[#245E73]">All gallery photos</h2>
                            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                                Photos from published SHIJUWAZA updates are grouped by month, with the newest moments appearing first.
                            </p>
                        </div>
                    </div>

                    {galleryItems.length ? (
                        <div className="space-y-12">
                            {groupedImages.map((group) => (
                                <div key={group.label}>
                                    <div className="mb-5 flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E6F6FA] text-[#245E73]">
                                            <CalendarDays aria-hidden="true" size={18} />
                                        </span>
                                        <h3 className="text-2xl font-black text-[#245E73]">{group.label}</h3>
                                    </div>

                                    <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
                                        {group.items.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => openImage(item)}
                                                className="group mb-5 w-full break-inside-avoid overflow-hidden rounded-2xl border border-[#5BAFCB]/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#9DD8EA]/45"
                                            >
                                                <div className="overflow-hidden bg-[#F3FBFD]">
                                                    <img src={item.image_url} alt={item.title} className="h-auto w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                                                </div>
                                                <div className="p-5">
                                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{item.date_label || group.label}</p>
                                                    <h4 className="mt-2 text-lg font-black leading-snug text-[#245E73]">{item.title}</h4>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid">
                            <div className="rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-8 text-center shadow-sm sm:col-span-2 lg:col-span-3">
                                <ImageIcon aria-hidden="true" size={40} className="mx-auto text-[#5BAFCB]" />
                                <h2 className="mt-5 text-2xl font-black text-[#245E73]">Gallery photos will appear soon</h2>
                                <p className="mt-3 text-lg leading-relaxed text-slate-600">Photos from published updates will be displayed here.</p>
                            </div>
                        </div>
                    )}

                    {nextUrl ? (
                        <div className="mt-10 flex justify-center">
                            <button type="button" onClick={loadMore} disabled={loadingMore} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5BAFCB] px-6 py-3 font-black text-white shadow-lg shadow-[#5BAFCB]/20 transition hover:-translate-y-0.5 hover:bg-[#245E73] disabled:cursor-wait disabled:opacity-70">
                                {loadingMore ? <Loader2 aria-hidden="true" size={18} className="animate-spin" /> : <ImageIcon aria-hidden="true" size={18} />}
                                {loadingMore ? 'Loading photos...' : 'Load More Photos'}
                            </button>
                        </div>
                    ) : null}
                </div>
            </section>

            {selected ? (
                <div className="fixed inset-0 z-[100] bg-[#061F33]/90 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gallery-preview-title">
                    <div className="mx-auto flex h-full max-w-6xl flex-col">
                        <div className="mb-4 flex items-center justify-between gap-4 text-white">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Gallery Preview</p>
                                <h2 id="gallery-preview-title" className="mt-1 text-2xl font-black">{selected.title}</h2>
                            </div>
                            <button type="button" onClick={closeImage} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Close gallery preview">
                                <X aria-hidden="true" size={22} />
                            </button>
                        </div>
                        <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl bg-black/25">
                            <img src={selected.image_url} alt={selected.title} className="h-full w-full object-contain" />
                            {previewItems.length > 1 ? (
                                <>
                                    <button type="button" onClick={previousImage} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#245E73] shadow-lg transition hover:bg-white" aria-label="Previous photo">
                                        <ChevronLeft aria-hidden="true" size={24} />
                                    </button>
                                    <button type="button" onClick={nextImage} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#245E73] shadow-lg transition hover:bg-white" aria-label="Next photo">
                                        <ChevronRight aria-hidden="true" size={24} />
                                    </button>
                                </>
                            ) : null}
                        </div>
                        <div className="mt-4 rounded-2xl bg-white/10 p-4 text-blue-50">
                            {selected.date_label ? <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">{selected.date_label}</p> : null}
                            {selected.source_href ? (
                                <Link href={selected.source_href} className="mt-2 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#245E73] transition hover:bg-[#E6F6FA]">
                                    Read Update
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </PublicLayout>
    );
}
