import { ArrowRight, HeartHandshake } from 'lucide-react';

export default function DonationSection() {
    return (
        <section className="bg-[#F3FBFD] py-14 lg:py-16">
            <div className="section-shell">
                <div className="flex flex-col justify-between gap-6 rounded-xl border border-[#5BAFCB]/10 bg-white p-5 text-[#245E73] shadow-sm sm:rounded-2xl sm:p-7 md:flex-row md:items-center lg:p-10">
                    <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#F3FBFD] px-4 py-2 text-sm font-black text-[#5BAFCB]">
                            <HeartHandshake aria-hidden="true" size={17} />
                            Support Inclusion
                        </p>
                        <h2 className="mt-5 text-2xl font-black leading-tight sm:text-4xl">
                            Support disability inclusion in Zanzibar.
                        </h2>
                        <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                            Work with SHIJUWAZA to strengthen OPD-led advocacy, participation, accessibility, and equal rights.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                        <a href="/donate#donation-form" className="btn-support">
                            Donate
                            <ArrowRight aria-hidden="true" size={18} />
                        </a>
                        <a href="/partner-with-us" className="btn-secondary">
                            Partner With Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
