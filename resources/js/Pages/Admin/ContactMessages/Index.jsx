import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import { Archive, Check, Eye, Reply, Trash2 } from 'lucide-react';

const statuses = ['all', 'unread', 'read', 'replied', 'archived'];

export default function ContactMessagesIndex({ messages = [], filters = { status: 'all' } }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const setFilter = (status) => router.get('/admin/contact-messages', { status }, { preserveState: true });
    const updateStatus = (message, status) => {
        router.patch(`/admin/contact-messages/${message.id}`, { status }, { preserveScroll: true });
    };

    const destroy = (message) => {
        requestDelete({
            url: `/admin/contact-messages/${message.id}`,
            title: `Remove message from ${message.name}?`,
            description: 'This contact message will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout title="Contact Messages">
            <div className="mb-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                    <button key={status} onClick={() => setFilter(status)} className={`rounded-full px-4 py-2 text-sm font-black ${filters.status === status ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'}`}>
                        {status}
                    </button>
                ))}
            </div>
            <AdminTable columns={['Sender', 'Subject', 'Message', 'Status', 'Actions']}>
                {messages.map((message) => (
                    <tr key={message.id}>
                        <td className="px-5 py-4">
                            <p className="font-black">{message.name}</p>
                            <p className="text-sm text-slate-500">{message.email}</p>
                            <p className="text-sm text-slate-500">{message.phone}</p>
                        </td>
                        <td className="px-5 py-4">{message.subject || '-'}</td>
                        <td className="px-5 py-4 max-w-lg"><p className="line-clamp-3 text-slate-600">{message.message}</p></td>
                        <td className="px-5 py-4"><StatusBadge active={message.status !== 'archived'}>{message.status}</StatusBadge></td>
                        <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                <IconAction href={`/admin/contact-messages/${message.id}`} icon={Eye} label={`Open message from ${message.name}`} tone="teal" />
                                <IconAction onClick={() => updateStatus(message, 'read')} icon={Check} label={`Mark message from ${message.name} as read`} tone="neutral" />
                                <IconAction onClick={() => updateStatus(message, 'replied')} icon={Reply} label={`Mark message from ${message.name} as replied`} tone="emerald" />
                                <IconAction onClick={() => updateStatus(message, 'archived')} icon={Archive} label={`Archive message from ${message.name}`} tone="amber" />
                                {isSuperAdmin ? <IconAction onClick={() => destroy(message)} icon={Trash2} label={`Remove message from ${message.name} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!messages.length ? <tr><td colSpan="5" className="px-5 py-10 text-center font-bold text-slate-500">No contact messages found.</td></tr> : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
