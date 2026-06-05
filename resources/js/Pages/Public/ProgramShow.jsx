import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowLeft, ArrowRight, CheckCircle2, Handshake, Landmark, Network, Presentation, Target } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PublicCta from '../../Components/Public/PublicCta';

const icons = { Handshake, Landmark, Network, Presentation };

const fallbackDetails = {
    activities: [
        'OPD-led dialogue, consultation, and community engagement',
        'Training and practical capacity support for member organizations',
        'Coordination with government, civil society, media, and partners',
        'Documentation of learning, evidence, and public accountability priorities',
    ],
    outcomes: [
        'Stronger leadership and representation by persons with disabilities',
        'Improved institutional understanding of disability inclusion',
        'Better coordination between OPDs, partners, and public institutions',
    ],
};

export default function ProgramShow({ program, relatedPrograms = [] }) {
    const Icon = icons[program.icon] || Landmark;

    return (
        <PublicLayout>
            <SeoHead title={program.title} description={program.short_description || program.description} image={program.image_url} type="article" />
            <section className="bg-[#F3FBFD] py-12 lg:py-20">
                <div className="section-shell">
                    <Link href="/programs" className="inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                        <ArrowLeft aria-hidden="true" size={17} />
                        Back to Programs
                    </Link>

                    <div className="mt-8 grid overflow-hidden rounded-2xl border border-[#5BAFCB]/10 bg-white shadow-sm sm:rounded-3xl lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-12">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
                                <Icon aria-hidden="true" size={30} />
                            </div>
                            <p className="eyebrow mt-6">Program Area</p>
                            <h1 className="mt-3 text-3xl font-black leading-tight text-[#245E73] sm:text-5xl">{program.title}</h1>
                            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-xl sm:leading-8">{program.short_description}</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a href="/partner-with-us" className="btn-primary">Collaborate</a>
                                <a href="/donate" className="btn-support">Support This Work</a>
                            </div>
                        </div>
                        <div className="min-h-[260px] bg-[#245E73] sm:min-h-[360px]">
                            {program.image_url ? (
                                <img src={program.image_url} alt={program.title} className="h-full min-h-[260px] w-full object-cover sm:min-h-[360px]" />
                            ) : (
                                <div className="grid h-full min-h-[260px] place-items-center text-white sm:min-h-[360px]">
                                    <Icon aria-hidden="true" size={84} className="text-[#9DD8EA]" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-20">
                <div className="section-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
                    <div>
                        <p className="eyebrow">Program overview</p>
                        <h2 className="section-title mt-3">How this program supports inclusion.</h2>
                    </div>
                    <div className="text-lg leading-8 text-slate-700">
                        <p className="whitespace-pre-line">
                            {program.description || `This program supports SHIJUWAZA's work to strengthen disability rights, OPD leadership, public participation, and accountable inclusion across Zanzibar.`}
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#F8FAFC] py-12 lg:py-20">
                <div className="section-shell grid gap-5 lg:grid-cols-2">
                    <ProgramList title="Typical activities" icon={Target} items={fallbackDetails.activities} />
                    <ProgramList title="Expected outcomes" icon={CheckCircle2} items={fallbackDetails.outcomes} />
                </div>
            </section>

            {relatedPrograms.length ? (
                <section className="bg-white py-12 lg:py-20">
                    <div className="section-shell">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <p className="eyebrow">Related programs</p>
                                <h2 className="mt-3 text-3xl font-black text-[#245E73]">Explore more focus areas</h2>
                            </div>
                            <Link href="/programs" className="inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                                All Programs
                                <ArrowRight aria-hidden="true" size={17} />
                            </Link>
                        </div>
                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {relatedPrograms.map((item) => {
                                const RelatedIcon = icons[item.icon] || Landmark;

                                return (
                                    <Link key={item.id} href={item.href || `/programs/${item.slug}`} className="rounded-xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-2xl sm:p-6">
                                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                            <RelatedIcon aria-hidden="true" size={24} />
                                        </div>
                                        <h3 className="mt-5 text-xl font-black text-[#245E73]">{item.title}</h3>
                                        <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{item.short_description}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            ) : null}

            <PublicCta title="Partner with SHIJUWAZA on inclusive programming" copy="Work with an OPD-led organization to strengthen rights, capacity, accountability, and participation across Zanzibar." primaryHref="/partner-with-us" primaryLabel="Partner With Us" />
        </PublicLayout>
    );
}

function ProgramList({ title, icon: Icon, items }) {
    return (
        <article className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">
            <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                    <Icon aria-hidden="true" size={24} />
                </div>
                <h2 className="text-2xl font-black text-[#245E73]">{title}</h2>
            </div>
            <ul className="mt-6 grid gap-4">
                {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 leading-7 text-slate-700">
                        <CheckCircle2 aria-hidden="true" size={20} className="mt-1 shrink-0 text-[#9DD8EA]" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}
