import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const updates = [
    {
        date: 'April 2026',
        title: 'Staff capacity building strengthens accountable program delivery',
        excerpt: 'A practical training session focused on inclusive planning, transparent reporting, and coordinated support for member OPDs.',
        image: '/images/activities/shijuwaza-training-06.jpeg',
        alt: 'SHIJUWAZA staff working with laptops and training materials',
    },
    {
        date: 'March 2026',
        title: 'Dialogue advances accountability in disability-inclusive development',
        excerpt: 'Stakeholders explored ways to make services, budgets, and community programs more responsive to persons with disabilities.',
        image: '/images/activities/shijuwaza-training-01.jpeg',
        alt: 'Participants in conversation during a SHIJUWAZA community dialogue',
    },
    {
        date: 'February 2026',
        title: 'Journalist engagement promotes respectful disability reporting',
        excerpt: 'Media professionals joined OPD representatives to strengthen public communication on rights, dignity, and inclusion.',
        image: '/images/activities/shijuwaza-training-04.jpeg',
        alt: 'SHIJUWAZA participants attending a media and engagement session',
    },
];

export default function NewsPreview({ posts = updates }) {
    const items = (posts.length ? posts : updates).slice(0, 3);
    const useCarousel = items.length > 3;

    return (
        <section id="news" className="bg-white py-12 lg:py-16">
            <div className="section-shell">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div className="max-w-3xl">
                        <p className="eyebrow">Latest Updates</p>
                        <h2 className="mt-3 text-2xl font-black text-[#245E73] sm:text-4xl">Recent work from SHIJUWAZA</h2>
                        <p className="mt-4 leading-7 text-slate-700 sm:leading-8">
                            A few current highlights from advocacy, training, and inclusion work.
                        </p>
                    </div>
                    <a href="/news" className="btn-secondary w-full md:w-auto md:shrink-0">
                        View All Updates
                    </a>
                </div>
                {useCarousel ? <NewsCarousel items={items} /> : <NewsGrid items={items} />}
            </div>
        </section>
    );
}

function NewsGrid({ items }) {
    return (
        <div className="mt-8 grid gap-4 sm:gap-5 lg:grid-cols-3">
            {items.map((item) => (
                <NewsCard key={item.id || item.slug || item.title} item={item} />
            ))}
        </div>
    );
}

function NewsCarousel({ items }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const maxIndex = Math.max(items.length - visibleCount, 0);
    const pages = useMemo(() => Array.from({ length: maxIndex + 1 }, (_, index) => index), [maxIndex]);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                setVisibleCount(3);
            } else if (window.matchMedia('(min-width: 640px)').matches) {
                setVisibleCount(2);
            } else {
                setVisibleCount(1);
            }
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);

        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    useEffect(() => {
        setActiveIndex((current) => Math.min(current, maxIndex));
    }, [maxIndex]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (paused || prefersReducedMotion) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
        }, 5000);

        return () => window.clearInterval(timer);
    }, [maxIndex, paused]);

    const goToPrevious = () => setActiveIndex((current) => (current <= 0 ? maxIndex : current - 1));
    const goToNext = () => setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToPrevious();
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToNext();
        }
    };
    const cardBasis = `${100 / visibleCount}%`;

    return (
        <div
            className="mt-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={handleKeyDown}
            role="region"
            aria-roledescription="carousel"
            aria-label="Latest published news"
            tabIndex={0}
        >
            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={goToPrevious}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#5BAFCB]/15 bg-white text-[#245E73] shadow-sm transition hover:bg-[#F3FBFD]"
                    aria-label="Show previous news posts"
                >
                    <ChevronLeft aria-hidden="true" size={22} />
                </button>
                <button
                    type="button"
                    onClick={goToNext}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#5BAFCB]/15 bg-white text-[#245E73] shadow-sm transition hover:bg-[#F3FBFD]"
                    aria-label="Show next news posts"
                >
                    <ChevronRight aria-hidden="true" size={22} />
                </button>
            </div>

            <div className="mt-5 overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{ transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` }}
                >
                    {items.map((item) => (
                        <div key={item.id || item.slug || item.title} className="shrink-0 px-2.5" style={{ flexBasis: cardBasis }}>
                            <NewsCard item={item} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-center gap-2" aria-label="Choose news slide">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => setActiveIndex(page)}
                        className={`h-2.5 rounded-full transition-all ${activeIndex === page ? 'w-8 bg-[#5BAFCB]' : 'w-2.5 bg-[#BFE4EF] hover:bg-[#5BAFCB]'}`}
                        aria-label={`Show news slide ${page + 1}`}
                        aria-current={activeIndex === page}
                    />
                ))}
            </div>
        </div>
    );
}

function NewsCard({ item }) {
    const image = item.image_url || item.image || item.featured_image;

    return (
        <article className="flex h-full min-h-[330px] flex-col overflow-hidden rounded-xl border border-[#5BAFCB]/10 bg-[#F8FAFC] shadow-sm sm:min-h-[360px] sm:rounded-2xl">
            {image ? (
                <img src={image} alt={item.alt || item.title} className="h-48 w-full object-cover sm:h-52" />
            ) : (
                <div className="grid h-48 place-items-center bg-[#F3FBFD] text-[#5BAFCB] sm:h-52">
                    <div className="text-center">
                        <ImageOff aria-hidden="true" className="mx-auto" size={34} />
                        <p className="mt-2 text-sm font-black">No image available</p>
                    </div>
                </div>
            )}
            <div className="flex flex-1 flex-col p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#5BAFCB]">
                    <CalendarDays aria-hidden="true" size={17} />
                    {item.category_label ? <span>{item.category_label}</span> : null}
                    {item.category_label ? <span aria-hidden="true">·</span> : null}
                    <time>{item.date_label || item.date}</time>
                </div>
                <h3 className="mt-4 text-lg font-black leading-tight text-[#245E73] sm:text-xl">{item.title}</h3>
                <p className="mt-3 flex-1 overflow-hidden leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                    {item.excerpt}
                </p>
                <a href={item.slug ? `/news/${item.slug}` : '/news'} className="mt-5 inline-flex items-center gap-2 font-black text-[#5BAFCB] hover:text-[#245E73]">
                    Read Update
                    <ArrowRight aria-hidden="true" size={17} />
                </a>
            </div>
        </article>
    );
}
