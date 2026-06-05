import { Link, router } from '@inertiajs/react';
import { FilePlus2, Pencil, Trash2 } from 'lucide-react';
import MemberLayout from '../../../Layouts/MemberLayout';
import StatusPill from '../../../Components/StatusPill';

export default function MemberSubmissionsIndex({ member, submissions = [], setupRequired = false }) {
    const destroySubmission = (submission) => {
        if (window.confirm(`Delete "${submission.title}"? This cannot be undone.`)) {
            router.delete(`/member/submissions/${submission.id}`, { preserveScroll: true });
        }
    };

    if (setupRequired || !member) {
        return (
            <MemberLayout title="My Submissions">
                <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">Setup Required</p>
                    <h1 className="mt-3 text-3xl font-black text-[#245E73]">No member organization linked.</h1>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-700">
                        Your account must be linked to a member organization before you can submit documents or updates.
                    </p>
                </section>
            </MemberLayout>
        );
    }

    return (
        <MemberLayout title="My Submissions" actions={<Link href="/member/submissions/create" className="btn-primary">Submit Update</Link>}>
            <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-900/5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-600">{member.acronym || 'Member OPD'}</p>
                        <h1 className="mt-2 text-2xl font-black text-sky-950">{member.name}</h1>
                    </div>
                    <Link href="/member/submissions/create" className="btn-secondary">
                        <FilePlus2 aria-hidden="true" size={18} />
                        New Submission
                    </Link>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-sky-100">
                    <table className="w-full min-w-[720px] text-left">
                        <thead className="bg-sky-50 text-xs font-black uppercase tracking-[0.12em] text-sky-900/70">
                            <tr>
                                {['Title', 'Type', 'Submitted', 'Status', 'Admin Note', 'Actions'].map((column) => (
                                    <th key={column} className="px-5 py-4">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissions.map((submission) => (
                                <tr key={submission.id}>
                                    <td className="px-5 py-4 font-black text-slate-900">{submission.title}</td>
                                    <td className="px-5 py-4 capitalize text-slate-600">{submission.submission_type}</td>
                                    <td className="px-5 py-4 text-slate-600">{submission.created_at}</td>
                                    <td className="px-5 py-4"><StatusPill status={submission.status} /></td>
                                    <td className="max-w-sm px-5 py-4 text-sm text-slate-600">{submission.admin_note || 'No note yet'}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/member/submissions/${submission.id}/edit`}
                                                className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-700 transition hover:bg-sky-100"
                                                aria-label={`Edit ${submission.title}`}
                                                title={`Edit ${submission.title}`}
                                            >
                                                <Pencil aria-hidden="true" size={17} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => destroySubmission(submission)}
                                                className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-700 transition hover:bg-red-100"
                                                aria-label={`Delete ${submission.title}`}
                                                title={`Delete ${submission.title}`}
                                            >
                                                <Trash2 aria-hidden="true" size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!submissions.length ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center font-semibold text-slate-500">No submissions yet.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </MemberLayout>
    );
}
