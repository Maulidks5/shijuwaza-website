import { useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { Camera, ChevronLeft, ChevronRight, FolderOpen, ImageIcon, X } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';

export default function Gallery({ featured = null, albums = [], currentAlbum = null, images = { data: [], links: [] } }) {
    const items = images.data || images;
    const [selectedId, setSelectedId] = useState(null);
    const previewItems = useMemo(() => {
        if (!featured || items.some((item) => item.id === featured.id)) {
            return items;
        }

        return [featured, ...items];
    }, [featured, items]);
    const selectedIndex = useMemo(() => previewItems.findIndex((item) => item.id === selectedId), [previewItems, selectedId]);
    const selected = selectedIndex >= 0 ? previewItems[selectedIndex] : null;

    const openImage = (item) => setSelectedId(item.id);
    const closeImage = () => setSelectedId(null);
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
            <SeoHead title={currentAlbum ? `${currentAlbum.name} Gallery` : 'Gallery'} description="Explore SHIJUWAZA photos from trainings, dialogues, advocacy forums, partner meetings, and disability-inclusive development activities." image={featured?.image_url} />
            <PageHero eyebrow="Photo Gallery" title={currentAlbum ? currentAlbum.name : 'Moments of inclusion, advocacy, and community action'}>
                {currentAlbum?.description || 'Explore SHIJUWAZA photos from trainings, dialogues, member engagement, partner meetings, and disability-inclusive development work.'}
            </PageHero>

            <section className="bg-white py-16 lg:py-20">
                <div className="section-shell">
                    <div className="mb-10 rounded-3xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-5 shadow-sm">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <p className="eyebrow">Albums</p>
                                <h2 className="mt-2 text-2xl font-black text-[#245E73]">Browse by activity category</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/gallery"
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${!currentAlbum ? 'bg-[#5BAFCB] text-white shadow-sm' : 'bg-white text-[#245E73] hover:bg-[#F3FBFD]'}`}
                                >
                                    <ImageIcon size={16} aria-hidden="true" /> All Photos
                                </Link>
                                {albums.map((album) => (
                                    <Link
                                        key={album.id}
                                        href={album.href}
                                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${currentAlbum?.slug === album.slug ? 'bg-[#5BAFCB] text-white shadow-sm' : 'bg-white text-[#245E73] hover:bg-[#F3FBFD]'}`}
                                    >
                                        <FolderOpen size={16} aria-hidden="true" /> {album.name}
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${currentAlbum?.slug === album.slug ? 'bg-white/20 text-white' : 'bg-[#F3FBFD] text-[#5BAFCB]'}`}>{album.count}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {featured ? (
                        <article className="overflow-hidden rounded-3xl border border-[#5BAFCB]/10 bg-[#F8FAFC] shadow-sm lg:grid lg:grid-cols-[1.25fr_0.75fr]">
                            <button type="button" onClick={() => openImage(featured)} className="group relative min-h-[360px] overflow-hidden text-left">
                                <img src={featured.image_url} alt={featured.title} className="h-full min-h-[360px] w-full object-cover transition duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#245E73]/50 via-transparent to-transparent" />
                                <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#245E73] shadow-sm">View featured photo</span>
                            </button>
                            <div className="flex flex-col justify-center p-7 lg:p-10">
                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
                                    <Camera aria-hidden="true" size={26} />
                                </div>
                                <p className="eyebrow mt-6">Featured Gallery</p>
                                <h2 className="mt-3 text-3xl font-black text-[#245E73]">{featured.title}</h2>
                                <p className="mt-4 leading-8 text-slate-600">{featured.caption}</p>
                            </div>
                        </article>
                    ) : null}

                    <div className="mt-12 flex flex-col justify-between gap-4 border-b border-[#5BAFCB]/10 pb-6 md:flex-row md:items-end">
                        <div>
                            <p className="eyebrow">Our Photos</p>
                            <h2 className="mt-3 text-3xl font-black text-[#245E73]">Visual stories from SHIJUWAZA work</h2>
                        </div>
                        <p className="max-w-xl leading-7 text-slate-600">Click any image to view it in a larger, cleaner preview.</p>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {items.length ? items.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => openImage(item)}
                                className={`group overflow-hidden rounded-2xl border border-[#5BAFCB]/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${index % 5 === 0 ? 'lg:row-span-2' : ''}`}
                            >
                                <div className={`${index % 5 === 0 ? 'h-[420px]' : 'h-64'} overflow-hidden bg-[#F3FBFD]`}>
                                    <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{item.album?.name || 'Gallery Photo'}</p>
                                    <h3 className="mt-2 text-xl font-black text-[#245E73]">{item.title}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.caption}</p>
                                </div>
                            </button>
                        )) : (
                            <div className="rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-8 text-center shadow-sm sm:col-span-2 lg:col-span-3">
                                <ImageIcon aria-hidden="true" size={40} className="mx-auto text-[#5BAFCB]" />
                                <h2 className="mt-5 text-2xl font-black text-[#245E73]">Gallery photos will appear soon</h2>
                                <p className="mt-3 text-lg leading-relaxed text-slate-600">Published image items from the media gallery will be displayed here.</p>
                            </div>
                        )}
                    </div>

                    {images.links?.length > 3 ? (
                        <div className="mt-10 flex flex-wrap gap-2">
                            {images.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-full px-4 py-2 text-sm font-bold ${link.active ? 'bg-[#5BAFCB] text-white' : 'bg-[#F8FAFC] text-slate-700 hover:bg-[#F3FBFD]'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
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
                        <p className="mt-4 rounded-2xl bg-white/10 p-4 leading-7 text-blue-50">{selected.caption}</p>
                    </div>
                </div>
            ) : null}
        </PublicLayout>
    );
}
