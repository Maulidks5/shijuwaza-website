import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function UserForm({ user, roles = [], modules = [], canModifyAccess = true }) {
    const editing = Boolean(user);
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'Editor',
        module_permissions: user?.module_permissions || [],
        _method: editing ? 'put' : 'post',
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/users/${user.id}` : '/admin/users');
    };

    const superAdminSelected = data.role === 'Super Admin';
    const roleLockedPermissions = data.role === 'Admin'
        ? ['view dashboard', 'manage visibility']
        : data.role === 'Editor'
            ? ['view dashboard']
            : [];
    const selectedPermissions = superAdminSelected
        ? modules.map((module) => module.permission)
        : [...new Set([...data.module_permissions, ...roleLockedPermissions])];

    const togglePermission = (permission, checked) => {
        if (!canModifyAccess || superAdminSelected || roleLockedPermissions.includes(permission) || isRestrictedModule(permission)) {
            return;
        }

        setData(
            'module_permissions',
            checked
                ? [...data.module_permissions, permission]
                : data.module_permissions.filter((item) => item !== permission),
        );
    };

    const changeRole = (role) => {
        setData({
            ...data,
            role,
            module_permissions: role === 'Super Admin'
                ? []
                : role === 'Member'
                    ? []
                : data.module_permissions.filter((permission) => !['manage users', 'manage settings'].includes(permission)),
        });
    };

    const isRestrictedModule = (permission) => data.role === 'Member' || (['manage users', 'manage settings'].includes(permission) && data.role !== 'Super Admin');

    return (
        <AdminLayout title={editing ? 'Edit User' : 'Create User'}>
            <form onSubmit={submit} className="grid max-w-3xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Field label="Name" error={errors.name}>
                    <input className={inputClass} value={data.name} onChange={(event) => setData('name', event.target.value)} />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input type="email" className={inputClass} value={data.email} onChange={(event) => setData('email', event.target.value)} />
                </Field>
                <Field label={editing ? 'Password (leave blank to keep current)' : 'Password'} error={errors.password}>
                    <input type="password" className={inputClass} value={data.password} onChange={(event) => setData('password', event.target.value)} />
                </Field>
                <Field label="Role" error={errors.role}>
                    <select className={inputClass} value={data.role} onChange={(event) => changeRole(event.target.value)} disabled={!canModifyAccess}>
                        {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                </Field>
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Module Access</p>
                        <h2 className="mt-2 text-xl font-black text-[#245E73]">Choose exactly which modules and actions this user can access</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-600">
                            Super Admin automatically receives all access. Users and Site Settings remain Super Admin-only.
                        </p>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {modules.map((module) => {
                            const lockedByRole = roleLockedPermissions.includes(module.permission);
                            const disabled = !canModifyAccess || superAdminSelected || lockedByRole || isRestrictedModule(module.permission);
                            const checked = selectedPermissions.includes(module.permission);

                            return (
                                <label key={module.permission} className={`flex items-start gap-3 rounded-lg border bg-white p-4 ${disabled ? 'border-slate-200 opacity-65' : 'border-slate-200'}`}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={disabled}
                                        onChange={(event) => togglePermission(module.permission, event.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-[#9DD8EA]"
                                    />
                                    <span>
                                        <span className="block font-black text-slate-800">{module.label}</span>
                                        <span className="mt-1 block text-xs font-semibold text-slate-500">
                                            {module.permission}{lockedByRole ? ' - included with role' : ''}
                                        </span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    {errors.module_permissions ? <p className="mt-3 text-sm font-semibold text-red-600">{errors.module_permissions}</p> : null}
                </section>
                <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                    Passwords must be at least 8 characters and include uppercase, lowercase, and numbers.
                </p>
                <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save User</button>
            </form>
        </AdminLayout>
    );
}
