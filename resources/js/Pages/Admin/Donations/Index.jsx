import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import { Archive, Ban, CheckCircle2, Eye, Send, Trash2 } from 'lucide-react';

const statuses = ['all', 'pending', 'instructions_sent', 'confirmed', 'cancelled', 'archived'];

export default function DonationsIndex({ donations = [], filters = { status: 'all' } }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const isAdmin = roles.includes('Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const setStatus = (status) => router.get('/admin/donations', { status }, { preserveState: true });
    const updateStatus = (donation, status) => router.patch(`/admin/donations/${donation.id}`, { status }, { preserveScroll: true });
    const sendInstructions = (donation) => router.post(`/admin/donations/${donation.id}/send-instructions`, {}, { preserveScroll: true });
    const destroy = (donation) => {
        requestDelete({
            url: `/admin/donations/${donation.id}`,
            title: `Remove donation from ${donation.donor_name}?`,
            description: 'This donation request will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout title="Donation Requests">
            <div className="mb-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                    <button key={status} onClick={() => setStatus(status)} className={`rounded-full px-4 py-2 text-sm font-black ${filters.status === status ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'}`}>
                        {formatStatus(status)}
                    </button>
                ))}
            </div>
            <AdminTable columns={['Donor', 'Amount', 'Type', 'Method', 'Message', 'Status', 'Actions']}>
                {donations.map((donation) => (
                    <tr key={donation.id}>
                        <td className="px-5 py-4"><p className="font-black">{donation.donor_name}</p><p className="text-sm text-slate-500">{donation.donor_email}</p><p className="text-sm text-slate-500">{donation.donor_phone}</p></td>
                        <td className="px-5 py-4 font-black text-[#9DD8EA]">{donation.currency} {donation.amount}</td>
                        <td className="px-5 py-4">{donation.donation_type.replaceAll('_', ' ')}</td>
                        <td className="px-5 py-4">{donation.payment_method.replaceAll('_', ' ')}</td>
                        <td className="max-w-md px-5 py-4 text-slate-600">{donation.message || '-'}</td>
                        <td className="px-5 py-4"><StatusBadge active={donation.status === 'confirmed'}>{donation.status}</StatusBadge></td>
                        <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                <IconAction href={`/admin/donations/${donation.id}`} icon={Eye} label={`Open donation from ${donation.donor_name}`} tone="teal" />
                                <IconAction onClick={() => sendInstructions(donation)} icon={Send} label={`Send payment instructions to ${donation.donor_name}`} tone="neutral" />
                                <IconAction onClick={() => updateStatus(donation, 'confirmed')} icon={CheckCircle2} label={`Confirm donation from ${donation.donor_name}`} tone="emerald" />
                                <IconAction onClick={() => updateStatus(donation, 'cancelled')} icon={Ban} label={`Cancel donation from ${donation.donor_name}`} tone="amber" />
                                {isAdmin ? <IconAction onClick={() => updateStatus(donation, 'archived')} icon={Archive} label={`Archive donation from ${donation.donor_name}`} tone="neutral" /> : null}
                                {isSuperAdmin ? <IconAction onClick={() => destroy(donation)} icon={Trash2} label={`Remove donation from ${donation.donor_name} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!donations.length ? <tr><td colSpan="7" className="px-5 py-10 text-center font-bold text-slate-500">No donation requests found.</td></tr> : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}

function formatStatus(status) {
    return status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
