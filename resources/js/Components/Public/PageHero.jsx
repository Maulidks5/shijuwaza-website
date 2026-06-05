export default function PageHero({ eyebrow, title, children, image = '/images/activities/shijuwaza-training-08.jpeg', actions }) {
    return (
        <section className="relative overflow-hidden bg-[#9DD8EA] py-10 text-[#173B49] sm:py-16 lg:py-20">
            <img src={image} alt="" className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-12 sm:opacity-18 lg:w-[58%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#9DD8EA] via-[#9DD8EA]/92 to-[#E6F6FA]/62" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.48),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.28),transparent_45%)]" />
            <div className="section-shell relative">
                <div className="max-w-4xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#245E73] sm:text-sm">{eyebrow}</p>
                    <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{title}</h1>
                    {children ? <p className="mt-5 max-w-3xl text-base leading-7 text-[#245E73] sm:mt-6 sm:text-lg sm:leading-relaxed">{children}</p> : null}
                    {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
                </div>
            </div>
        </section>
    );
}
