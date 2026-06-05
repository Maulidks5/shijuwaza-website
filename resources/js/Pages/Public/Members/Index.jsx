import { Link } from '@inertiajs/react';
import SeoHead from '../../../Components/Public/SeoHead';
import { ArrowRight, Building2, FileText, LockKeyhole, MapPin, UsersRound } from 'lucide-react';
import PublicLayout from '../../../Layouts/PublicLayout';
import PageHero from '../../../Components/Public/PageHero';
import PortalLoginButton from '../../../Components/Public/PortalLoginButton';

export default function MembersIndex({ members = [] }) {
    const memberItems = members.data || members;

    return (
        <PublicLayout>
            <SeoHead title="Members" description="Explore SHIJUWAZA member OPDs and approved member updates from organizations advancing disability inclusion in Zanzibar." />
            <PageHero
                eyebrow="Member OPDs"
                title="A federation of organizations advancing disability inclusion in Zanzibar."
                actions={
                    <>
                        <PortalLoginButton className="btn-primary bg-white text-[#245E73] hover:bg-[#F3FBFD]">Member Portal</PortalLoginButton>
                        <a href="/partner-with-us" className="btn-support">Collaborate With Members</a>
                    </>
                }
            >
                SHIJUWAZA brings member Organizations of Persons with Disabilities together to strengthen collective voice, coordination, and public participation.
            </PageHero>

            <section className="bg-white py-16 lg:py-20">
                <div className="section-shell">
                    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                        <div>
                            <p className="eyebrow">Members Directory</p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#245E73] sm:text-4xl">Recognized member organizations</h2>
                        </div>
                        <p className="text-lg leading-relaxed text-slate-600">
                            Each member profile will show approved updates, documents, and text submissions after SHIJUWAZA admin review.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {memberItems.length ? memberItems.map((member) => (
                            <MemberCard key={member.id} member={member} />
                        )) : (
                            <div className="rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-8 md:col-span-2 xl:col-span-3">
                                <h3 className="text-2xl font-black text-[#245E73]">Members will appear here soon</h3>
                                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                                    SHIJUWAZA is preparing member profiles and approved updates for public access.
                                </p>
                            </div>
                        )}
                    </div>

                    {members.links?.length > 3 ? (
                        <div className="mt-10 flex flex-wrap items-center gap-2">
                            {members.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                                        link.active
                                            ? 'bg-[#5BAFCB] text-white shadow-sm'
                                            : 'bg-[#F8FAFC] text-slate-700 hover:bg-[#F3FBFD] hover:text-[#245E73]'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="bg-[#F3FBFD] py-16 lg:py-20">
                <div className="section-shell grid gap-5 md:grid-cols-3">
                    {[
                        ['Member credentials', 'Each OPD receives secure login credentials from SHIJUWAZA.', LockKeyhole],
                        ['Submit updates', 'Members can submit documents or text updates through their portal.', FileText],
                        ['Admin approval', 'Only approved submissions become visible on the public website.', UsersRound],
                    ].map(([title, copy, Icon]) => (
                        <article key={title} className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm">
                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                <Icon aria-hidden="true" size={23} />
                            </div>
                            <h3 className="mt-5 text-xl font-black text-[#245E73]">{title}</h3>
                            <p className="mt-3 leading-7 text-slate-600">{copy}</p>
                        </article>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}

function MemberCard({ member }) {
    return (
        <article className="group flex h-full flex-col rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start gap-4">
                <MemberLogo member={member} />
                <div className="min-w-0">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{member.acronym || 'Member OPD'}</p>
                    <h3 className="mt-2 text-xl font-black leading-tight text-[#245E73]">{member.name}</h3>
                </div>
            </div>
            <p className="mt-5 line-clamp-4 flex-1 leading-7 text-slate-600">{member.description}</p>
            {member.location ? (
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                    <MapPin aria-hidden="true" size={16} />
                    {member.location}
                </p>
            ) : null}
            <Link href={`/members/${member.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                View Profile
                <ArrowRight aria-hidden="true" size={17} className="transition group-hover:translate-x-1" />
            </Link>
        </article>
    );
}

function MemberLogo({ member }) {
    if (member.logo_url) {
        return <img src={member.logo_url} alt={`${member.name} logo`} className="h-14 w-14 rounded-2xl border border-[#5BAFCB]/10 object-cover" />;
    }

    return (
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
            <Building2 aria-hidden="true" size={25} />
        </div>
    );
}
