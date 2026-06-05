import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function StatForm({ stat }) {
    const editing = Boolean(stat);
    const { data, setData, post, processing, errors } = useForm({
        label: stat?.label || '',
        value: stat?.value || '',
        description: stat?.description || '',
        icon: stat?.icon || 'BarChart3',
        sort_order: stat?.sort_order || 0,
        is_active: stat?.is_active ?? true,
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/stats/${stat.id}` : '/admin/stats');
    };

    return (
        <AdminLayout title={editing ? 'Edit Homepage Stat' : 'Create Homepage Stat'}>
            <form onSubmit={submit} className="grid max-w-3xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Label" error={errors.label}><input className={inputClass} value={data.label} onChange={(event) => setData('label', event.target.value)} /></Field>
                <Field label="Value" error={errors.value}><input className={inputClass} value={data.value} onChange={(event) => setData('value', event.target.value)} /></Field>
                <Field label="Description" error={errors.description}><input className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} /></Field>
                <Toggle label="Active" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Stat</button>
            </form>
        </AdminLayout>
    );
}
