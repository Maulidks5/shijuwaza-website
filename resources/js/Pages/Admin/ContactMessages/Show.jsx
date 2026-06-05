import { Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Check, Mail, Phone, Reply, Trash2, UserRound } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';

export default function ContactMessageShow({ message }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();

    const updateStatus = (status) => {
        router.patch(`/admin/contact-messages/${message.id}`, { status }, { preserveScroll: true });
    };

    const destroy = () => {
        requestDelete({
            url: `/admin/contact-messages/${message.id}`,
            title: `Remove message from ${message.name}?`,
            description: 'This contact message will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout
            title="Message Details"
            actions={<Link href="/admin/contact-messages" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-black text-slate-700 shadow-sm hover:bg-slate-50"><ArrowLeft aria-hidden="true" size={18} /> Back</Link>}
        >
            <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Contact Message</p>
                                <h2 className="mt-2 text-3xl font-black text-[#245E73]">{message.subject || 'No subject provided'}</h2>
                            </div>
                            <StatusBadge active={message.status !== 'archived'}>{message.status}</StatusBadge>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 sm:grid-cols-3">
                        <InfoCard icon={UserRound} label="Sender" value={message.name} />
                        <InfoCard icon={Mail} label="Email" value={message.email} href={`mailto:${message.email}`} />
                        <InfoCard icon={Phone} label="Phone" value={message.phone || 'Not provided'} href={message.phone ? `tel:${message.phone}` : null} />
                    </div>

                    <div className="border-t border-slate-100 p-6">
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-slate-500">Full Message</p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="whitespace-pre-line text-lg leading-8 text-slate-700">{message.message}</p>
                        </div>
                    </div>
                </section>

                <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-black text-[#245E73]">Message Actions</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        Update the workflow status after reading or responding to this contact message.
                    </p>
                    <div className="mt-5 grid gap-2">
                        <button type="button" onClick={() => updateStatus('read')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50">
                            <Check aria-hidden="true" size={18} />
                            Mark as Read
                        </button>
                        <button type="button" onClick={() => updateStatus('replied')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700">
                            <Reply aria-hidden="true" size={18} />
                            Mark as Replied
                        </button>
                        <button type="button" onClick={() => updateStatus('archived')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9DD8EA] px-4 py-3 font-black text-[#245E73] hover:bg-[#7CC8DE]">
                            <Archive aria-hidden="true" size={18} />
                            Archive Message
                        </button>
                        {isSuperAdmin ? <IconAction onClick={destroy} icon={Trash2} label={`Remove message from ${message.name} permanently`} tone="red" /> : null}
                    </div>
                </aside>
            </div>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}

function InfoCard({ icon: Icon, label, value, href }) {
    const content = (
        <>
            <Icon aria-hidden="true" size={20} className="text-[#9DD8EA]" />
            <span>
                <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</span>
                <span className="mt-1 block break-words font-black text-slate-900">{value}</span>
            </span>
        </>
    );

    if (href) {
        return <a href={href} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#9DD8EA]/30 hover:bg-[#F3FBFD]">{content}</a>;
    }

    return <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">{content}</div>;
}
