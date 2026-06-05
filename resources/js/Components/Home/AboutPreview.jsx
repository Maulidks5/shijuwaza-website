import { ArrowRight, BadgeCheck } from 'lucide-react';

export default function AboutPreview() {
    return (
        <section id="about-us" className="bg-white py-12 lg:py-16">
            <div className="section-shell">
                <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                    <div className="relative overflow-hidden rounded-xl border border-[#5BAFCB]/10 bg-[#F3FBFD] shadow-sm sm:rounded-2xl">
                        <img
                            src="/images/activities/shijuwaza-training-05.jpeg"
                            alt="SHIJUWAZA members and partners gathered during an organizational meeting"
                            className="aspect-[4/3] w-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/90 p-3 text-[#245E73] shadow-sm backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#9DD8EA] text-[#173B49] sm:h-10 sm:w-10 sm:rounded-xl">
                                    <BadgeCheck aria-hidden="true" size={20} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-black">Nothing About Us Without Us</p>
                                    <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">A federation built around lived experience and collective action.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="eyebrow">About SHIJUWAZA</p>
                        <h2 className="mt-3 text-2xl font-black leading-tight text-[#245E73] sm:text-4xl">
                            A coordinated voice for disability inclusion in Zanzibar.
                        </h2>
                        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                            SHIJUWAZA brings Organizations of Persons with Disabilities together to strengthen advocacy, leadership, accountability, and equal participation.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a href="/about" className="btn-secondary w-full sm:w-auto">
                                Read Full Profile
                                <ArrowRight aria-hidden="true" size={18} />
                            </a>
                            <a href="/members" className="btn-primary w-full sm:w-auto">
                                View Members
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
