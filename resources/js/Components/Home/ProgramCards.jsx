import { Handshake, Landmark, Network, Presentation } from 'lucide-react';
import { Link } from '@inertiajs/react';

const programs = [
    {
        title: 'Advocacy & Rights Promotion',
        icon: Landmark,
        copy: 'Championing disability rights, inclusive policy dialogue, and stronger participation in public decision-making.',
    },
    {
        title: 'Capacity Building',
        icon: Presentation,
        copy: 'Strengthening OPD leadership, governance, communication, accountability, and organizational resilience.',
    },
    {
        title: 'Inclusive Development',
        icon: Network,
        copy: 'Supporting organizations and communities to design programs that include persons with disabilities from the start.',
    },
    {
        title: 'Partnerships & Collaboration',
        icon: Handshake,
        copy: 'Building trusted relationships with government, media, civil society, and development partners.',
    },
];

const icons = { Handshake, Landmark, Network, Presentation };

export default function ProgramCards({ programs: dynamicPrograms = programs }) {
    const items = (dynamicPrograms.length ? dynamicPrograms : programs).slice(0, 4);

    return (
        <section id="programs" className="bg-[#F3FBFD] py-12 lg:py-16">
            <div className="section-shell">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="eyebrow">What We Do</p>
                    <h2 className="mt-3 text-2xl font-black text-[#245E73] sm:text-4xl">Focused programs for inclusive change</h2>
                    <p className="mt-4 leading-7 text-slate-700 sm:leading-8">
                        Practical workstreams that strengthen rights, capacity, development, and collaboration.
                    </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {items.map(({ title, slug, icon, copy, short_description }) => {
                        const Icon = typeof icon === 'string' ? icons[icon] || Landmark : icon;

                        return (
                            <Link
                                key={title}
                                href={slug ? `/programs/${slug}` : '/programs'}
                                className="rounded-xl border border-[#5BAFCB]/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl sm:p-5"
                            >
                                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                    <Icon aria-hidden="true" size={27} />
                                </div>
                                <h3 className="mt-4 text-base font-black leading-tight text-[#245E73] sm:text-lg">{title}</h3>
                                <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{short_description || copy}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
