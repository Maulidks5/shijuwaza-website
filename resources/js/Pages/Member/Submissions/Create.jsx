import { useForm } from '@inertiajs/react';
import MemberLayout from '../../../Layouts/MemberLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function MemberSubmissionCreate({ member, submission = null }) {
    const editing = Boolean(submission);
    const { data, setData, post, processing, errors } = useForm({
        title: submission?.title || '',
        submission_type: submission?.submission_type || 'text',
        body: submission?.body || '',
        document: null,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/member/submissions/${submission.id}` : '/member/submissions', { forceFormData: true });
    };

    return (
        <MemberLayout title={editing ? 'Edit Update' : 'Submit Update'}>
            <form onSubmit={submit} className="grid max-w-4xl gap-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-900/5">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-600">{member.acronym || 'Member OPD'}</p>
                    <h1 className="mt-2 text-2xl font-black text-sky-950">{editing ? 'Update your submission' : 'Send a document or text update for approval'}</h1>
                    <p className="mt-2 leading-7 text-slate-600">Your submission will remain pending until SHIJUWAZA admin approves it for public display.</p>
                </div>

                <Field label="Title" error={errors.title}>
                    <input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} />
                </Field>

                <Field label="Submission Type" error={errors.submission_type}>
                    <select className={inputClass} value={data.submission_type} onChange={(event) => setData('submission_type', event.target.value)}>
                        <option value="text">Text update</option>
                        <option value="document">Document upload</option>
                    </select>
                </Field>

                {data.submission_type === 'text' ? (
                    <Field label="Text Update" error={errors.body}>
                        <textarea rows="8" className={inputClass} value={data.body} onChange={(event) => setData('body', event.target.value)} />
                    </Field>
                ) : (
                    <Field label="Document" error={errors.document}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className={inputClass}
                            onChange={(event) => setData('document', event.target.files[0] || null)}
                        />
                        <p className="text-sm font-semibold text-slate-500">Accepted: PDF, Word, JPG, PNG. Maximum 10MB.</p>
                        {submission?.document_url ? (
                            <a href={submission.document_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-black text-sky-600">
                                Current document: {submission.original_filename || 'Open file'}
                            </a>
                        ) : null}
                    </Field>
                )}

                <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">{editing ? 'Save Changes' : 'Submit for Approval'}</button>
            </form>
        </MemberLayout>
    );
}
