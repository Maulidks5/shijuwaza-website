import { Link } from '@inertiajs/react';
import { CheckCircle2, Clock3, ExternalLink, FilePlus2, Files, UserRound, XCircle } from 'lucide-react';
import MemberLayout from '../../Layouts/MemberLayout';
import StatusPill from '../../Components/StatusPill';

export default function MemberDashboard({ member, stats, recentSubmissions = [], setupRequired = false }) {
    if (setupRequired || !member) {
        return (
            <MemberLayout title="Dashboard">
                <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">Setup Required</p>
                    <h1 className="mt-3 text-3xl font-black text-[#245E73]">Your member account is not linked to an organization yet.</h1>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-700">
                        Please ask the system administrator to open Admin Panel &gt; Members and link this login account to your member organization.
                    </p>
                    <a href="/logout" className="btn-secondary mt-6 inline-flex">Logout</a>
                </section>
            </MemberLayout>
        );
    }

    return (
        <MemberLayout title="Dashboard">
            <section className="grid gap-6 rounded-2xl border border-[#9DD8EA]/45 bg-white p-7 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5BAFCB]">{member.acronym || 'Member OPD'}</p>
                    <h1 className="mt-3 text-3xl font-black text-[#245E73] lg:text-4xl">{member.name}</h1>
                    <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                        Submit documents or text updates for SHIJUWAZA admin review. Approved updates become visible on your public member profile.
                    </p>
                </div>
                <div className="grid gap-3 rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-5">
                    <Link href="/member/submissions/create" className="btn-primary justify-center">
                        <FilePlus2 aria-hidden="true" size={18} />
                        Submit Update
                    </Link>
                    <Link href="/member/profile" className="btn-secondary justify-center">
                        <UserRound aria-hidden="true" size={18} />
                        Edit Profile
                    </Link>
                    <a href={member.public_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-black text-[#245E73] transition hover:bg-white">
                        <ExternalLink aria-hidden="true" size={18} />
                        View Public Profile
                    </a>
                </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                    ['Total', stats.total, Files, 'bg-[#F3FBFD] text-[#5BAFCB]'],
                    ['Pending', stats.pending, Clock3, 'bg-amber-100 text-amber-800'],
                    ['Approved', stats.approved, CheckCircle2, 'bg-emerald-100 text-emerald-800'],
                    ['Rejected', stats.rejected, XCircle, 'bg-red-100 text-red-800'],
                ].map(([label, value, Icon, tone]) => (
                    <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}>
                            <Icon aria-hidden="true" size={22} />
                        </div>
                        <p className="mt-4 text-3xl font-black text-[#245E73]">{value}</p>
                        <p className="mt-1 font-bold text-slate-500">{label}</p>
                    </article>
                ))}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
                {[
                    ['Track approval', 'See whether your update is pending, approved, rejected, or archived.', '/member/submissions', Files],
                    ['Keep profile accurate', 'Update organization contacts, logo, description, and login details.', '/member/profile', UserRound],
                ].map(([title, copy, href, Icon]) => (
                    <Link key={title} href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                            <Icon aria-hidden="true" size={23} />
                        </div>
                        <h2 className="mt-5 text-xl font-black text-[#245E73]">{title}</h2>
                        <p className="mt-3 leading-7 text-slate-600">{copy}</p>
                    </Link>
                ))}
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-2xl font-black text-[#245E73]">Recent submissions</h2>
                        <p className="mt-1 text-slate-600">Track your latest documents and updates.</p>
                    </div>
                </div>
                <div className="mt-6 grid gap-3">
                    {recentSubmissions.length ? recentSubmissions.map((submission) => (
                        <div key={submission.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 md:flex-row md:items-center">
                            <div>
                                <h3 className="font-black text-slate-900">{submission.title}</h3>
                                <p className="mt-1 text-sm font-semibold capitalize text-slate-500">{submission.submission_type} submitted on {submission.created_at}</p>
                            </div>
                            <StatusPill status={submission.status} />
                        </div>
                    )) : (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6">
                            <h3 className="font-black text-[#245E73]">No submissions yet</h3>
                            <p className="mt-2 text-slate-600">Start by submitting a document or text update for approval.</p>
                        </div>
                    )}
                </div>
            </section>
        </MemberLayout>
    );
}
