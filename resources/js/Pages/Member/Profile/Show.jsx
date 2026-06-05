import { useForm } from '@inertiajs/react';
import { ExternalLink, ImagePlus, Lock, UserRound } from 'lucide-react';
import MemberLayout from '../../../Layouts/MemberLayout';
import { Field, inputClass } from '../../../Components/Admin/FormControls';

export default function MemberProfileShow({ profile, setupRequired = false }) {
    if (setupRequired || !profile) {
        return (
            <MemberLayout title="My Profile">
                <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">Setup Required</p>
                    <h1 className="mt-3 text-3xl font-black text-[#245E73]">Your profile is not ready yet.</h1>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-700">
                        Please ask the administrator to create or link your member organization profile in Admin Panel &gt; Members.
                    </p>
                </section>
            </MemberLayout>
        );
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        name: profile.name || '',
        acronym: profile.acronym || '',
        description: profile.description || '',
        logo: null,
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        account_name: profile.account_name || '',
        account_email: profile.account_email || '',
        current_password: '',
        password: '',
        password_confirmation: '',
        _method: 'patch',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/member/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset('logo', 'current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <MemberLayout
            title="My Profile"
            actions={<a href={profile.public_url} target="_blank" rel="noreferrer" className="btn-secondary"><ExternalLink aria-hidden="true" size={18} /> Public Profile</a>}
        >
            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <aside className="self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        {profile.logo_url ? (
                            <img src={profile.logo_url} alt="" className="h-20 w-20 rounded-2xl border border-slate-200 object-cover" />
                        ) : (
                            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
                                <UserRound aria-hidden="true" size={34} />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{profile.acronym || 'Member OPD'}</p>
                            <h1 className="mt-1 text-2xl font-black text-[#245E73]">{profile.name}</h1>
                        </div>
                    </div>
                    <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4">
                        <p className="text-sm font-black text-slate-700">Profile approval note</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Changes update your organization profile. Submitted documents and text updates still require admin approval before appearing publicly.
                        </p>
                    </div>
                </aside>

                <div className="grid gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                <ImagePlus aria-hidden="true" size={22} />
                            </span>
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">Organization Information</p>
                                <h2 className="mt-1 text-2xl font-black text-[#245E73]">Public member profile</h2>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <Field label="Organization Name" error={errors.name}>
                                <input className={inputClass} value={data.name} onChange={(event) => setData('name', event.target.value)} />
                            </Field>
                            <Field label="Acronym" error={errors.acronym}>
                                <input className={inputClass} value={data.acronym} onChange={(event) => setData('acronym', event.target.value)} />
                            </Field>
                        </div>
                        <div className="mt-5">
                            <Field label="Description" error={errors.description}>
                                <textarea rows="5" className={inputClass} value={data.description} onChange={(event) => setData('description', event.target.value)} />
                            </Field>
                        </div>
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <Field label="Logo" error={errors.logo}>
                                <input type="file" accept="image/*" onChange={(event) => setData('logo', event.target.files[0])} />
                            </Field>
                            <Field label="Website URL" error={errors.website_url}>
                                <input className={inputClass} value={data.website_url} onChange={(event) => setData('website_url', event.target.value)} />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">Contact Details</p>
                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                            <Field label="Public Email" error={errors.email}>
                                <input type="email" className={inputClass} value={data.email} onChange={(event) => setData('email', event.target.value)} />
                            </Field>
                            <Field label="Phone" error={errors.phone}>
                                <input className={inputClass} value={data.phone} onChange={(event) => setData('phone', event.target.value)} />
                            </Field>
                            <Field label="Location" error={errors.location}>
                                <input className={inputClass} value={data.location} onChange={(event) => setData('location', event.target.value)} />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                <Lock aria-hidden="true" size={22} />
                            </span>
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">Login Account</p>
                                <h2 className="mt-1 text-2xl font-black text-[#245E73]">Portal credentials</h2>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <Field label="Account Name" error={errors.account_name}>
                                <input className={inputClass} value={data.account_name} onChange={(event) => setData('account_name', event.target.value)} />
                            </Field>
                            <Field label="Login Email" error={errors.account_email}>
                                <input type="email" className={inputClass} value={data.account_email} onChange={(event) => setData('account_email', event.target.value)} />
                            </Field>
                        </div>
                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                            <Field label="Current Password" error={errors.current_password}>
                                <input type="password" className={inputClass} value={data.current_password} onChange={(event) => setData('current_password', event.target.value)} />
                            </Field>
                            <Field label="New Password" error={errors.password}>
                                <input type="password" className={inputClass} value={data.password} onChange={(event) => setData('password', event.target.value)} />
                            </Field>
                            <Field label="Confirm Password" error={errors.password_confirmation}>
                                <input type="password" className={inputClass} value={data.password_confirmation} onChange={(event) => setData('password_confirmation', event.target.value)} />
                            </Field>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-500">
                            Fill current password only when changing password. Role and permissions cannot be changed from this page.
                        </p>
                    </section>

                    <button disabled={processing} className="btn-primary justify-self-start disabled:opacity-60">Save Profile</button>
                </div>
            </form>
        </MemberLayout>
    );
}
