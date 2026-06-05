import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import IconAction from '../../../Components/Admin/IconAction';
import ConfirmDialog from '../../../Components/Admin/ConfirmDialog';
import useConfirmDelete from '../../../Components/Admin/useConfirmDelete';
import { Archive, CheckCheck, Eye, PhoneCall, Trash2 } from 'lucide-react';

const statuses = ['all', 'new', 'reviewed', 'contacted', 'archived'];
const types = ['all', 'funding', 'training', 'advocacy', 'research', 'media', 'technical_support', 'other'];

export default function PartnershipRequestsIndex({ requests = [], filters = { status: 'all', type: 'all' } }) {
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { dialogProps, requestDelete } = useConfirmDelete();
    const filter = (key, value) => router.get('/admin/partnership-requests', { ...filters, [key]: value }, { preserveState: true });
    const updateStatus = (request, status) => router.patch(`/admin/partnership-requests/${request.id}`, { status }, { preserveScroll: true });
    const destroy = (request) => {
        requestDelete({
            url: `/admin/partnership-requests/${request.id}`,
            title: `Remove request from ${request.organization_name}?`,
            description: 'This partnership request will be permanently removed from the system. This action cannot be undone.',
        });
    };

    return (
        <AdminLayout title="Partnership Requests">
            <div className="mb-5 grid gap-3 lg:grid-cols-2">
                <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => <button key={status} onClick={() => filter('status', status)} className={`rounded-full px-4 py-2 text-sm font-black ${filters.status === status ? 'bg-[#9DD8EA] text-[#173B49]' : 'bg-white text-slate-700'}`}>{status}</button>)}
                </div>
                <div className="flex flex-wrap gap-2">
                    {types.map((type) => <button key={type} onClick={() => filter('type', type)} className={`rounded-full px-4 py-2 text-sm font-black ${filters.type === type ? 'bg-[#9DD8EA] text-[#245E73]' : 'bg-white text-slate-700'}`}>{type.replaceAll('_', ' ')}</button>)}
                </div>
            </div>
            <AdminTable columns={['Organization', 'Type', 'Message', 'Status', 'Actions']}>
                {requests.map((request) => (
                    <tr key={request.id}>
                        <td className="px-5 py-4"><p className="font-black">{request.organization_name}</p><p className="text-sm text-slate-500">{request.contact_person}</p><p className="text-sm text-slate-500">{request.email}</p></td>
                        <td className="px-5 py-4 capitalize">{request.partnership_type.replaceAll('_', ' ')}</td>
                        <td className="max-w-lg px-5 py-4 text-slate-600">{request.message}</td>
                        <td className="px-5 py-4"><StatusBadge active={request.status !== 'archived'}>{request.status}</StatusBadge></td>
                        <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                <IconAction href={`/admin/partnership-requests/${request.id}`} icon={Eye} label={`Open request from ${request.organization_name}`} tone="teal" />
                                <IconAction onClick={() => updateStatus(request, 'reviewed')} icon={CheckCheck} label={`Mark ${request.organization_name} as reviewed`} tone="neutral" />
                                <IconAction onClick={() => updateStatus(request, 'contacted')} icon={PhoneCall} label={`Mark ${request.organization_name} as contacted`} tone="emerald" />
                                <IconAction onClick={() => updateStatus(request, 'archived')} icon={Archive} label={`Archive ${request.organization_name}`} tone="amber" />
                                {isSuperAdmin ? <IconAction onClick={() => destroy(request)} icon={Trash2} label={`Remove ${request.organization_name} permanently`} tone="red" /> : null}
                            </div>
                        </td>
                    </tr>
                ))}
                {!requests.length ? <tr><td colSpan="5" className="px-5 py-10 text-center font-bold text-slate-500">No partnership requests found.</td></tr> : null}
            </AdminTable>
            <ConfirmDialog {...dialogProps} />
        </AdminLayout>
    );
}
