import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Archive, CheckCircle2, Download, Trash2, XCircle } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import StatusPill from '../../../Components/StatusPill';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function MemberSubmissionShow({ submission }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { data, setData, patch, processing, errors } = useForm({
        status: submission.status,
        admin_note: submission.admin_note || '',
        is_public: submission.is_public,
    });
    const { dialog, ask, close } = useConfirmDelete();

    const save = (event) => {
        event.preventDefault();
        patch(`/admin/member-submissions/${submission.id}`, { preserveScroll: true });
    };

    const quickStatus = (status) => {
        router.patch(`/admin/member-submissions/${submission.id}`, { status, is_public: status === 'approved', admin_note: data.admin_note }, { preserveScroll: true });
    };

    const destroy = () => ask({
        title: `Remove "${submission.title}" permanently?`,
        message: 'This will permanently delete this submission and any uploaded document.',
        confirmLabel: 'Remove Permanently',
        onConfirm: () => router.delete(`/admin/member-submissions/${submission.id}`),
    });

    return (
        <AdminLayout
            title="Member Submission"
            actions={<Link href="/admin/member-submissions" className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-black text-slate-700">Back</Link>}
        >
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">{submission.member.acronym || submission.member.name}</p>
                            <h1 className="mt-2 text-3xl font-black text-[#245E73]">{submission.title}</h1>
                            <p className="mt-2 text-sm font-semibold text-slate-500">Submitted by {submission.submitter.name} on {submission.created_at}</p>
                        </div>
                        <StatusPill status={submission.status} />
                    </div>

                    <div className="mt-7 rounded-2xl bg-[#F8FAFC] p-5">
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Submission Content</p>
                        {submission.submission_type === 'document' ? (
                            <div className="mt-4">
                                <p className="font-black text-[#245E73]">{submission.original_filename || 'Uploaded document'}</p>
                                {submission.document_url ? (
                                    <a href={submission.document_url} target="_blank" rel="noreferrer" className="btn-primary mt-4 inline-flex">
                                        <Download aria-hidden="true" size={18} />
                                        Open Document
                                    </a>
                                ) : null}
                            </div>
                        ) : (
                            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-slate-700">{submission.body}</p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <IconAction onClick={() => quickStatus('approved')} icon={CheckCircle2} label="Approve and publish" tone="emerald" />
                        <IconAction onClick={() => quickStatus('rejected')} icon={XCircle} label="Reject submission" tone="red" />
                        <IconAction onClick={() => quickStatus('archived')} icon={Archive} label="Archive submission" tone="amber" />
                        {isSuperAdmin ? <IconAction onClick={destroy} icon={Trash2} label="Remove permanently" tone="red" /> : null}
                    </div>
                </section>

                <form onSubmit={save} className="self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-[#245E73]">Review decision</h2>
                    <div className="mt-5 grid gap-4">
                        <Field label="Status" error={errors.status}>
                            <select className={inputClass} value={data.status} onChange={(event) => setData('status', event.target.value)}>
                                {['pending', 'approved', 'rejected', 'archived'].map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </Field>
                        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <input type="checkbox" checked={data.is_public} onChange={(event) => setData('is_public', event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-[#9DD8EA]" />
                            <span className="font-black text-slate-700">Show on public website when approved</span>
                        </label>
                        <Field label="Admin Note" error={errors.admin_note}>
                            <textarea rows="5" className={inputClass} value={data.admin_note} onChange={(event) => setData('admin_note', event.target.value)} />
                        </Field>
                        <button disabled={processing} className="btn-primary disabled:opacity-60">Save Review</button>
                    </div>
                </form>
            </div>
            <ConfirmDialog dialog={dialog} onClose={close} />
        </AdminLayout>
    );
}
