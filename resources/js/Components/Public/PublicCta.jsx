export default function PublicCta({ title = 'Partner with SHIJUWAZA to advance inclusive Zanzibar', copy = 'Work with an OPD-led federation trusted by members, communities, organizations, and development actors.', primaryHref = '/partner-with-us', primaryLabel = 'Partner With Us' }) {
    return (
        <section className="bg-[#245E73] py-20 text-white">
            <div className="section-shell flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9DD8EA]">Take action</p>
                    <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-50">{copy}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                    <a href={primaryHref} className="btn-primary bg-white text-[#245E73] hover:bg-[#F3FBFD]">{primaryLabel}</a>
                    <a href="/donate" className="btn-support">Donate</a>
                </div>
            </div>
        </section>
    );
}
