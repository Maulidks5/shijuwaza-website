import { Link } from '@inertiajs/react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowRight, Handshake, Landmark, Network, Presentation } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import PublicCta from '../../Components/Public/PublicCta';

const icons = { Handshake, Landmark, Network, Presentation };

export default function Programs({ programs = [] }) {
    return (
        <PublicLayout>
            <SeoHead title="Programs" description="Explore SHIJUWAZA programs in advocacy, capacity building, inclusive development, and partnerships for disability inclusion in Zanzibar." />
            <PageHero eyebrow="Programs" title="Practical programs shaped around rights, capacity, and participation.">
                Explore SHIJUWAZA's core areas of work and the ways partners can collaborate with an OPD-led organization.
            </PageHero>
            <section className="bg-white py-16 lg:py-20">
                <div className="section-shell">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="eyebrow">Focus areas</p>
                            <h1 className="section-title mt-3">Program areas for inclusive change</h1>
                        </div>
                        <a href="/partner-with-us" className="btn-secondary md:shrink-0">Collaborate With Us</a>
                    </div>
                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {programs.map((program) => (
                            <ProgramCard key={program.id} program={program} />
                        ))}
                    </div>
                </div>
            </section>
            <PublicCta title="Collaborate on disability-inclusive programs" copy="Funding, training, advocacy, research, media, and technical partners can help expand OPD-led impact." />
        </PublicLayout>
    );
}

function ProgramCard({ program }) {
    const Icon = icons[program.icon] || Landmark;

    return (
        <Link href={program.href || `/programs/${program.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#5BAFCB]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            {program.image_url ? (
                <img src={program.image_url} alt={program.title} className="h-44 w-full object-cover" />
            ) : (
                <div className="grid h-32 place-items-center bg-[#F3FBFD] text-[#5BAFCB]">
                    <Icon aria-hidden="true" size={34} />
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">Program Area</p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-[#245E73]">{program.title}</h2>
                <p className="mt-4 line-clamp-4 flex-1 leading-7 text-slate-600">{program.short_description || program.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                    View Program
                    <ArrowRight aria-hidden="true" size={17} className="transition group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    );
}
