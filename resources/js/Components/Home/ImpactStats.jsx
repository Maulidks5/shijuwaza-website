import { useEffect, useMemo, useState } from 'react';
import { BarChart3, GraduationCap, Megaphone, UsersRound } from 'lucide-react';

const fallbackStats = [
    { label: 'Member OPDs', value: '20+', detail: 'Organizations represented', icon: UsersRound },
    { label: 'Trainings Conducted', value: '45+', detail: 'Leadership and inclusion sessions', icon: GraduationCap },
    { label: 'Advocacy Engagements', value: '80+', detail: 'Policy and community dialogues', icon: Megaphone },
    { label: 'Community Reach', value: '12k+', detail: 'People reached through programs', icon: BarChart3 },
];

const icons = { BarChart3, GraduationCap, Megaphone, UsersRound };

export default function ImpactStats({ stats = fallbackStats }) {
    const items = (stats.length ? stats : fallbackStats).slice(0, 5);

    return (
        <section id="impact" className="bg-white py-10 lg:py-12">
            <div className="section-shell">
                <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#5BAFCB]/10 pb-5 md:flex-row md:items-end">
                    <div>
                        <p className="eyebrow">Impact Snapshot</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#245E73] sm:text-3xl">Progress at a glance</h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                        A quick view of SHIJUWAZA's organizational reach and community-focused work.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {items.map(({ label, value, detail, description, icon }) => {
                        const Icon = typeof icon === 'string' ? icons[icon] || BarChart3 : icon;

                        return (
                            <article key={label} className="flex items-start gap-4 rounded-xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-4 shadow-sm sm:rounded-2xl sm:p-5">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                    <Icon aria-hidden="true" size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-2xl font-black leading-none text-[#245E73] sm:text-3xl">
                                        <CountUpValue value={value} />
                                    </p>
                                    <h3 className="mt-2 font-black text-[#245E73]">{label}</h3>
                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{description || detail}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function CountUpValue({ value }) {
    const parsed = useMemo(() => parseStatValue(value), [value]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!parsed) {
            return undefined;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            setCurrent(parsed.number);
            return undefined;
        }

        let frameId;
        let startTime;
        const duration = 1400;

        const tick = (timestamp) => {
            startTime ||= timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setCurrent(Math.round(parsed.number * eased));

            if (progress < 1) {
                frameId = window.requestAnimationFrame(tick);
            }
        };

        setCurrent(0);
        frameId = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frameId);
    }, [parsed]);

    if (!parsed) {
        return value;
    }

    return `${parsed.prefix}${formatCount(current, parsed.decimals)}${parsed.suffix}`;
}

function parseStatValue(value) {
    const text = String(value ?? '');
    const match = text.match(/^([^0-9-]*)([\d,.]+)(.*)$/);

    if (!match) {
        return null;
    }

    const rawNumber = match[2].replaceAll(',', '');
    const number = Number(rawNumber);

    if (!Number.isFinite(number)) {
        return null;
    }

    return {
        prefix: match[1],
        number,
        suffix: match[3],
        decimals: rawNumber.includes('.') ? rawNumber.split('.')[1].length : 0,
    };
}

function formatCount(value, decimals) {
    if (!decimals) {
        return value.toLocaleString();
    }

    return value.toFixed(decimals);
}
