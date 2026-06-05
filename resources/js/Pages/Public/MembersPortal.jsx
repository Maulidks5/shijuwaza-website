import SeoHead from '../../Components/Public/SeoHead';
import { FileCheck2, LockKeyhole, UsersRound } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import PageHero from '../../Components/Public/PageHero';
import PortalLoginButton from '../../Components/Public/PortalLoginButton';

export default function MembersPortal() {
    return (
        <PublicLayout>
            <SeoHead title="Members Portal" description="Learn how SHIJUWAZA member OPDs can log in, submit updates, and share approved documents through the members portal." />
            <PageHero eyebrow="Member OPDs Portal" title="A coordinated digital space for SHIJUWAZA member OPDs.">
                Members receive usernames and passwords to submit updates, collaborate, and share organizational information for approval.
            </PageHero>
            <section className="bg-[#F8FAFC] py-20">
                <div className="section-shell grid gap-6 md:grid-cols-3">
                    {[
                        ['Secure member access', 'OPDs use issued credentials to access the system.', LockKeyhole],
                        ['Submit updates', 'Members can submit activities, notices, and organizational updates.', FileCheck2],
                        ['Admin approval', 'SHIJUWAZA reviews submissions before public publishing.', UsersRound],
                    ].map(([title, copy, Icon]) => (
                        <article key={title} className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm">
                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                <Icon aria-hidden="true" size={23} />
                            </div>
                            <h2 className="mt-5 text-xl font-black text-[#245E73]">{title}</h2>
                            <p className="mt-3 leading-7 text-slate-600">{copy}</p>
                        </article>
                    ))}
                </div>
                <div className="section-shell mt-8">
                    <PortalLoginButton className="btn-primary">Member Login</PortalLoginButton>
                </div>
            </section>
        </PublicLayout>
    );
}
