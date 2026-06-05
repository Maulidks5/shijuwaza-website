import { useEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const fallbackHero = {
    eyebrow: 'Uniting OPDs since 2014',
    title: 'Advancing Disability Rights and Inclusion in Zanzibar',
    subtitle: 'SHIJUWAZA is a federation of Disabled People Organizations empowering OPDs, promoting equal participation, and strengthening accountability for disability-inclusive development.',
    primary_button_text: 'Learn More',
    primary_button_url: '#about-us',
    secondary_button_text: 'Our Programs',
    secondary_button_url: '#programs',
    quote: 'Nothing About Us Without Us',
    established_year: '2014',
    established_label: 'Federation established',
    focus_items: [
        { label: 'OPD-led advocacy', icon: 'Landmark' },
        { label: 'Capacity building', icon: 'UsersRound' },
        { label: 'Inclusive partnerships', icon: 'HandHeart' },
    ],
    slides: [
        {
            image_url: '/images/activities/shijuwaza-training-08.jpeg',
            alt: 'SHIJUWAZA representative speaking during an organizational meeting in Zanzibar',
            label: 'Advocacy leadership',
            title: 'OPD voices shaping public decisions',
        },
        {
            image_url: '/images/activities/shijuwaza-training-05.jpeg',
            alt: 'SHIJUWAZA annual meeting with members and partners in Zanzibar',
            label: 'Organizational accountability',
            title: 'Partners and members working together for inclusion',
        },
        {
            image_url: '/images/activities/shijuwaza-training-06.jpeg',
            alt: 'SHIJUWAZA staff participating in a capacity-building session',
            label: 'Capacity building',
            title: 'Strengthening skills for sustainable OPD leadership',
        },
        {
            image_url: '/images/activities/shijuwaza-training-01.jpeg',
            alt: 'Participants in conversation during a SHIJUWAZA community dialogue',
            label: 'Inclusive dialogue',
            title: 'Creating space for participation and shared action',
        },
    ],
};

export default function HeroSection({ hero = {} }) {
    const content = { ...fallbackHero, ...hero };
    const slides = normalizeSlides(content.slides);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || slides.length <= 1) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 6200);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        if (activeSlide >= slides.length) {
            setActiveSlide(0);
        }
    }, [activeSlide, slides.length]);

    const goToPrevious = () => setActiveSlide((current) => (current === 0 ? slides.length - 1 : current - 1));
    const goToNext = () => setActiveSlide((current) => (current + 1) % slides.length);

    return (
        <section id="home" className="bg-[#E6F6FA] py-4 sm:py-8 lg:py-12" aria-roledescription="carousel" aria-label="SHIJUWAZA activity photos">
            <div className="section-shell">
                <div className="grid overflow-hidden rounded-xl border border-[#9DD8EA]/60 bg-white shadow-[0_18px_55px_rgba(74,136,154,0.16)] sm:rounded-2xl lg:min-h-[650px] lg:grid-cols-[0.42fr_0.58fr]">
                    <div className="order-2 flex flex-col justify-center bg-[#9DD8EA] p-5 text-[#173B49] sm:p-10 lg:order-1 lg:p-12">
                        <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/55 bg-white/32 px-3 py-2 text-xs font-bold backdrop-blur sm:px-4 sm:text-sm">
                            <BadgeCheck aria-hidden="true" size={17} className="text-[#245E73]" />
                            <span className="min-w-0">{content.eyebrow || fallbackHero.eyebrow}</span>
                        </div>
                        <h1 className="mt-5 text-[2rem] font-black leading-[1.08] sm:mt-6 sm:text-5xl lg:text-[3.45rem]">
                            {content.title || fallbackHero.title}
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#245E73] sm:text-lg sm:leading-8">
                            {content.subtitle || fallbackHero.subtitle}
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            {content.primary_button_text ? (
                                <a href={content.primary_button_url || '#about-us'} className="btn-support w-full sm:w-auto">
                                    {content.primary_button_text}
                                    <ArrowRight aria-hidden="true" size={18} />
                                </a>
                            ) : null}
                            {content.secondary_button_text ? (
                                <a href={content.secondary_button_url || '#programs'} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#245E73]/20 bg-white/38 px-5 py-3 font-black text-[#173B49] backdrop-blur transition hover:bg-white/55 sm:w-auto">
                                    {content.secondary_button_text}
                                </a>
                            ) : null}
                        </div>
                    </div>

                    <div className="order-1 relative min-h-[360px] overflow-hidden bg-[#245E73] sm:min-h-[460px] lg:order-2 lg:min-h-full">
                        {slides.map((slide, index) => (
                            <img
                                key={`${slide.image_url}-${index}`}
                                src={slide.image_url}
                                alt={slide.alt}
                                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${
                                    activeSlide === index ? 'opacity-100' : 'opacity-0'
                                }`}
                                aria-hidden={activeSlide !== index}
                            />
                        ))}
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#245E73]/38 to-transparent" />
                        <div className="absolute bottom-[4.25rem] left-3 right-3 rounded-lg bg-white/88 p-3 text-[#245E73] shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-lg sm:rounded-xl sm:p-5">
                            <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#5BAFCB] sm:text-xs sm:tracking-[0.14em]">
                                {slides[activeSlide]?.label}
                            </p>
                            <h2 className="mt-1.5 text-sm font-black leading-tight sm:mt-2 sm:text-2xl">
                                {slides[activeSlide]?.title}
                            </h2>
                        </div>

                        {slides.length > 1 ? (
                            <>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[#245E73]/24 px-3 py-2 backdrop-blur sm:bottom-5 sm:left-5">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={`${slide.image_url}-dot`}
                                            type="button"
                                            onClick={() => setActiveSlide(index)}
                                            className={`h-2.5 rounded-full transition-all ${
                                                activeSlide === index ? 'w-9 bg-[#9DD8EA]' : 'w-2.5 bg-white/80 hover:bg-white'
                                            }`}
                                            aria-label={`Show slide ${index + 1}: ${slide.label}`}
                                            aria-current={activeSlide === index}
                                        />
                                    ))}
                                </div>
                                <div className="absolute bottom-5 right-5 hidden gap-2 sm:flex">
                                    <button
                                        type="button"
                                        onClick={goToPrevious}
                                        className="grid h-11 w-11 place-items-center rounded-full bg-[#245E73]/24 text-white backdrop-blur transition hover:bg-[#245E73]/36"
                                        aria-label="Show previous hero image"
                                    >
                                        <ChevronLeft aria-hidden="true" size={22} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goToNext}
                                        className="grid h-11 w-11 place-items-center rounded-full bg-[#245E73]/24 text-white backdrop-blur transition hover:bg-[#245E73]/36"
                                        aria-label="Show next hero image"
                                    >
                                        <ChevronRight aria-hidden="true" size={22} />
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

function normalizeSlides(slides = []) {
    const items = (slides.length ? slides : fallbackHero.slides)
        .map((slide) => ({ ...slide, image_url: slide.image_url || slide.image }))
        .filter((slide) => slide.image_url);

    return items.length ? items : fallbackHero.slides;
}
