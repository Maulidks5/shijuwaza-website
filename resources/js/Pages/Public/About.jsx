import { useState } from 'react';
import SeoHead from '../../Components/Public/SeoHead';
import { ArrowRight, BadgeCheck, Handshake, Scale, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import PublicCta from '../../Components/Public/PublicCta';

const values = [
    ['Representation', 'Leadership and participation led by persons with disabilities.', UsersRound],
    ['Dignity', 'Respectful language, equal opportunity, and meaningful participation.', ShieldCheck],
    ['Accountability', 'Transparent public services, budgets, programs, and development action.', Scale],
    ['Partnership', 'Collaboration that strengthens member OPDs and shared impact.', Handshake],
];

const profileItems = [
    ['Established', '2014'],
    ['Identity', 'Federation of Organizations of Persons with Disabilities'],
    ['Focus', 'Advocacy, OPD capacity, inclusive development, and partnerships'],
    ['Work Area', 'Zanzibar, Tanzania'],
];

export default function About({ profileGroups = [] }) {
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [activeProfileGroup, setActiveProfileGroup] = useState(profileGroups[0]?.key || 'secretariat');
    const currentProfileGroup = profileGroups.find((group) => group.key === activeProfileGroup) || profileGroups[0];

    return (
        <PublicLayout>
            <SeoHead title="About SHIJUWAZA" description="Learn about SHIJUWAZA, a Zanzibar organization coordinating OPDs to advance disability rights, inclusion, accountability, and equal participation." />
            <PageHero eyebrow="About SHIJUWAZA" title="A coordinated voice for disability rights and inclusion in Zanzibar.">
                SHIJUWAZA brings Organizations of Persons with Disabilities together to strengthen advocacy, leadership, accountability, and inclusive development.
            </PageHero>

            <section className="bg-white py-12 lg:py-20">
                <div className="section-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                        <p className="eyebrow">Who we are</p>
                        <h2 className="section-title mt-3">A federation built around lived experience and collective action.</h2>
                        <div className="mt-6 grid gap-5 text-lg leading-8 text-slate-700">
                            <p>
                                SHIJUWAZA is a federation of Organizations of Persons with Disabilities working to promote rights, empowerment, and equal participation for persons with disabilities in Zanzibar.
                            </p>
                            <p>
                                Since 2014, the organization has supported member OPDs to engage public institutions, development partners, media, and communities so inclusion becomes practical and accountable.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href="/members" className="btn-secondary">View Members</a>
                            <a href="/partner-with-us" className="btn-primary">Partner With Us</a>
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-4 shadow-sm sm:rounded-3xl sm:p-6">
                        <div className="rounded-xl bg-[#245E73] p-5 text-white sm:rounded-2xl sm:p-6">
                            <BadgeCheck aria-hidden="true" size={30} className="text-[#9DD8EA]" />
                            <blockquote className="mt-5 text-2xl font-black leading-tight sm:text-3xl">Nothing About Us Without Us</blockquote>
                            <p className="mt-4 leading-7 text-blue-50">
                                Persons with disabilities must shape the decisions, policies, services, and development programs that affect their lives.
                            </p>
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {profileItems.map(([label, value]) => (
                                <div key={label} className="rounded-2xl bg-white p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{label}</p>
                                    <p className="mt-2 font-black leading-6 text-[#245E73]">{value}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>

            <section className="bg-[#F8FAFC] py-12 lg:py-14">
                <div className="section-shell grid gap-5 md:grid-cols-2">
                    <article className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm">
                        <p className="eyebrow">Mission</p>
                        <h2 className="mt-3 text-2xl font-black leading-tight text-[#245E73]">Strengthen OPDs and advance inclusive development.</h2>
                        <p className="mt-4 leading-7 text-slate-600">
                            SHIJUWAZA empowers member organizations through advocacy, capacity building, coordination, and partnerships that make disability rights visible in everyday public action.
                        </p>
                    </article>
                    <article className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm">
                        <p className="eyebrow">Vision</p>
                        <h2 className="mt-3 text-2xl font-black leading-tight text-[#245E73]">An inclusive Zanzibar with dignity, rights, and opportunity for all.</h2>
                        <p className="mt-4 leading-7 text-slate-600">
                            The organization works toward communities and institutions where persons with disabilities participate fully and inclusion is treated as a shared responsibility.
                        </p>
                    </article>
                </div>
            </section>

            <section className="bg-[#F8FAFC] py-12 lg:py-16">
                <div className="section-shell">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="eyebrow">Profile</p>
                        <h2 className="mt-3 text-3xl font-black text-[#245E73] sm:text-4xl">SHIJUWAZA leadership and governance profiles</h2>
                        <p className="mt-5 leading-8 text-slate-600">
                            Meet the Secretariat, Board Members, and National Executive Committee members supporting SHIJUWAZA coordination and accountability.
                        </p>
                    </div>

                    <div className="mt-8 rounded-2xl border border-[#9DD8EA]/35 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {profileGroups.map((group) => (
                                <button
                                    key={group.key}
                                    type="button"
                                    onClick={() => setActiveProfileGroup(group.key)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${activeProfileGroup === group.key ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-[#F3FBFD] text-[#245E73] hover:bg-[#9DD8EA]/45'}`}
                                >
                                    {group.label}
                                </button>
                            ))}
                        </div>

                        {currentProfileGroup ? (
                            <section className="mt-5">
                                <div className="flex flex-col justify-between gap-2 border-b border-[#9DD8EA]/45 pb-4 md:flex-row md:items-end">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#245E73]">Current group</p>
                                        <h3 className="mt-2 text-2xl font-black text-[#173B49]">{currentProfileGroup.label}</h3>
                                    </div>
                                    <p className="text-sm font-bold text-[#245E73]">{countProfiles(currentProfileGroup.profiles)} profile{countProfiles(currentProfileGroup.profiles) === 1 ? '' : 's'}</p>
                                </div>

                                {currentProfileGroup.profiles.length ? (
                                    <ProfileTree profiles={currentProfileGroup.profiles} onView={setSelectedProfile} />
                                ) : (
                                    <div className="mt-5 rounded-2xl border border-dashed border-[#9DD8EA]/60 bg-[#F8FAFC] p-6 text-center font-bold text-slate-500">
                                        Profiles for this group will be added soon.
                                    </div>
                                )}
                            </section>
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-14">
                <div className="section-shell">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="eyebrow">Core values</p>
                            <h2 className="mt-3 text-3xl font-black text-[#245E73]">Principles that keep the work grounded.</h2>
                        </div>
                        <p className="max-w-xl leading-7 text-slate-600">Simple principles guiding coordination, advocacy, and partnership.</p>
                    </div>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map(([title, copy, Icon]) => (
                            <article key={title} className="flex gap-4 rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-5 shadow-sm">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                    <Icon aria-hidden="true" size={22} />
                                </div>
                                <div>
                                    <h3 className="font-black text-[#245E73]">{title}</h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <PublicCta />
            {selectedProfile ? <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} /> : null}
        </PublicLayout>
    );
}

function countProfiles(profiles = []) {
    return profiles.reduce((total, profile) => total + 1 + countProfiles(profile.children || []), 0);
}

function ProfileTree({ profiles, onView }) {
    return (
        <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-2 sm:p-4">
            <div className="overflow-x-auto pb-3">
                <div className="grid min-w-max gap-6 px-2 sm:gap-8">
                {profiles.map((profile) => (
                    <ProfileNode key={profile.id} profile={profile} onView={onView} />
                ))}
                </div>
            </div>
        </div>
    );
}

function ProfileNode({ profile, onView }) {
    const children = profile.children || [];
    const orderedChildren = [...children].sort((first, second) => positionWeight(first.tree_position) - positionWeight(second.tree_position));

    return (
        <div className="flex min-w-[210px] flex-col items-center sm:min-w-[240px] md:min-w-[260px]">
            <ProfileCard profile={profile} onView={onView} />
            {orderedChildren.length ? (
                <>
                    <div className="h-6 border-l border-slate-400 sm:h-8" aria-hidden="true" />
                    <div className="relative flex min-w-max justify-center">
                        <span className="absolute top-0 h-px bg-slate-400 left-[105px] right-[105px] sm:left-[120px] sm:right-[120px] md:left-[130px] md:right-[130px]" aria-hidden="true" />
                        <div className="flex min-w-max items-start justify-center gap-4 sm:gap-5 md:gap-6">
                            {orderedChildren.map((child) => (
                                <div key={child.id} className="flex min-w-[210px] flex-col items-center sm:min-w-[240px] md:min-w-[260px]">
                                    <div className="h-6 border-l border-slate-400 sm:h-8" aria-hidden="true" />
                                    <ProfileNode profile={child} onView={onView} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

function positionWeight(position) {
    return { left: 0, down: 1, right: 2 }[position] ?? 1;
}

function ProfileCard({ profile, onView }) {
    return (
        <article className="w-[190px] overflow-hidden rounded-xl border border-[#9DD8EA]/45 bg-white shadow-sm sm:w-[220px] sm:rounded-2xl md:w-[240px]">
            <div className="flex items-center gap-2 border-b border-[#9DD8EA]/35 bg-[#F3FBFD] p-2.5 sm:gap-3 sm:p-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#9DD8EA]/35 bg-white p-1 text-[#245E73] sm:h-14 sm:w-14 sm:rounded-xl md:h-16 md:w-16">
                    {profile.photo_url ? (
                        <img src={profile.photo_url} alt={profile.full_name} className="h-full w-full rounded-lg object-contain" />
                    ) : (
                        <UserRound aria-hidden="true" size={28} />
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="line-clamp-2 text-xs font-black leading-4 text-[#173B49] sm:text-sm sm:leading-5">{profile.full_name}</h4>
                    <p className="mt-1 line-clamp-2 text-[0.68rem] font-bold leading-4 text-[#245E73] sm:text-xs">{profile.position}</p>
                </div>
            </div>
            <div className="p-2.5 sm:p-3">
                <button
                    type="button"
                    onClick={() => onView(profile)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#9DD8EA] px-3 py-2 text-[0.68rem] font-black text-[#173B49] transition hover:bg-[#7CC8DE] sm:gap-2 sm:text-xs"
                >
                    View profile
                    <ArrowRight aria-hidden="true" size={14} />
                </button>
            </div>
        </article>
    );
}

function ProfileModal({ profile, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/55 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="profile-title">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-[#F3FBFD] p-5">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#245E73]">{profile.category_label}</p>
                        <h2 id="profile-title" className="mt-2 text-2xl font-black text-[#173B49]">{profile.full_name}</h2>
                        <p className="mt-1 font-bold text-[#245E73]">{profile.position}</p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#173B49] shadow-sm transition hover:bg-[#9DD8EA]" aria-label="Close profile">
                        <X aria-hidden="true" size={20} />
                    </button>
                </div>
                <div className="grid gap-6 p-5 md:grid-cols-[0.42fr_0.58fr]">
                    <div className="overflow-hidden rounded-2xl bg-[#F3FBFD]">
                        {profile.photo_url ? (
                            <img src={profile.photo_url} alt={profile.full_name} className="aspect-[4/5] h-full w-full object-cover" />
                        ) : (
                            <div className="grid aspect-[4/5] place-items-center text-[#245E73]">
                                <UserRound aria-hidden="true" size={64} />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Profile history</p>
                        <p className="mt-3 whitespace-pre-line leading-8 text-slate-700">
                            {profile.bio || profile.short_bio || 'Profile history will be updated soon.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
