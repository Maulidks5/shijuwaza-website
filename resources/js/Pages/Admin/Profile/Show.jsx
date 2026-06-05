import { useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import RoleBadge from '../../../Components/Admin/RoleBadge';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function ProfileShow({ profile }) {
    const initials = profile.name
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const profileForm = useForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatar: null,
        _method: 'patch',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (event) => {
        event.preventDefault();
        profileForm.post('/admin/profile', { forceFormData: true });
    };

    const submitPassword = (event) => {
        event.preventDefault();
        passwordForm.patch('/admin/profile/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AdminLayout title="My Profile">
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-[#F3FBFD]" />
                        ) : (
                            <div className="grid h-24 w-24 place-items-center rounded-full bg-[#9DD8EA] text-3xl font-black text-[#173B49] ring-4 ring-[#F3FBFD]">
                                {initials}
                            </div>
                        )}
                        <h2 className="mt-5 text-3xl font-black text-[#245E73]">{profile.name}</h2>
                        <p className="mt-2 text-slate-600">{profile.email}</p>
                        <div className="mt-4"><RoleBadge role={profile.role} /></div>
                        <p className="mt-4 text-sm font-semibold text-slate-500">Joined {profile.joined_at}</p>
                    </div>
                </section>

                <div className="grid gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="mb-6">
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Personal information</p>
                            <h2 className="mt-2 text-2xl font-black text-[#245E73]">Update your profile</h2>
                        </div>
                        <form onSubmit={submitProfile} className="grid gap-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="Name" error={profileForm.errors.name}>
                                    <input className={inputClass} value={profileForm.data.name} onChange={(event) => profileForm.setData('name', event.target.value)} />
                                </Field>
                                <Field label="Email" error={profileForm.errors.email}>
                                    <input type="email" className={inputClass} value={profileForm.data.email} onChange={(event) => profileForm.setData('email', event.target.value)} />
                                </Field>
                                <Field label="Phone" error={profileForm.errors.phone}>
                                    <input className={inputClass} value={profileForm.data.phone} onChange={(event) => profileForm.setData('phone', event.target.value)} />
                                </Field>
                                <Field label="Profile photo" error={profileForm.errors.avatar}>
                                    <input type="file" accept="image/*" onChange={(event) => profileForm.setData('avatar', event.target.files[0])} />
                                </Field>
                            </div>
                            <button disabled={profileForm.processing} className="justify-self-start rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Profile</button>
                        </form>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="mb-6">
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Security</p>
                            <h2 className="mt-2 text-2xl font-black text-[#245E73]">Change password</h2>
                        </div>
                        <form onSubmit={submitPassword} className="grid gap-5">
                            <Field label="Current password" error={passwordForm.errors.current_password}>
                                <input type="password" className={inputClass} value={passwordForm.data.current_password} onChange={(event) => passwordForm.setData('current_password', event.target.value)} />
                            </Field>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="New password" error={passwordForm.errors.password}>
                                    <input type="password" className={inputClass} value={passwordForm.data.password} onChange={(event) => passwordForm.setData('password', event.target.value)} />
                                </Field>
                                <Field label="Confirm new password" error={passwordForm.errors.password_confirmation}>
                                    <input type="password" className={inputClass} value={passwordForm.data.password_confirmation} onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)} />
                                </Field>
                            </div>
                            <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-600">Use at least 8 characters with uppercase, lowercase, and numbers.</p>
                            <button disabled={passwordForm.processing} className="justify-self-start rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Change Password</button>
                        </form>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
