import { Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AdminTable from '../../../Components/Admin/AdminTable';
import { StatusBadge } from '../../../Components/Admin/FormControls';
import { FolderOpen } from 'lucide-react';

export default function MediaIndex({ items = [] }) {
    return (
        <AdminLayout
            title="Media Gallery"
            actions={(
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/media-albums" className="inline-flex items-center gap-2 rounded-lg border border-[#9DD8EA]/20 px-4 py-2 font-black text-[#245E73]">
                        <FolderOpen size={17} aria-hidden="true" /> Albums
                    </Link>
                </div>
            )}
        >
            <AdminTable columns={['Photo', 'Album', 'Source', 'Order', 'Featured', 'Status']}>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td className="px-5 py-4 font-black">{item.title}<p className="font-normal text-slate-500">{item.description}</p></td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-600">{item.album?.name || 'Unassigned'}</td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-600">{item.news_post_id ? 'Update' : 'Legacy'}</td>
                        <td className="px-5 py-4">{item.sort_order}</td>
                        <td className="px-5 py-4"><StatusBadge active={item.is_featured}>{item.is_featured ? 'Featured' : 'Normal'}</StatusBadge></td>
                        <td className="px-5 py-4"><StatusBadge active={item.is_active} /></td>
                    </tr>
                ))}
            </AdminTable>
        </AdminLayout>
    );
}
