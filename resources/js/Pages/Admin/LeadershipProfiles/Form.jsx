import { router, useForm, usePage } from '@inertiajs/react';
import { ImageOff, Trash2 } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

export default function LeadershipProfileForm({ profile, categories = {}, parentOptions = [] }) {
    const editing = Boolean(profile);
    const roles = usePage().props.auth.user?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    const { data, setData, post, processing, errors } = useForm({
        category: profile?.category || 'secretariat',
        parent_profile_id: profile?.parent_profile_id || '',
        tree_position: profile?.tree_position || 'down',
        full_name: profile?.full_name || '',
        position: profile?.position || '',
        short_bio: profile?.short_bio || '',
        bio: profile?.bio || '',
        photo: null,
        sort_order: profile?.sort_order || 0,
        is_active: profile?.is_active ?? true,
        _method: editing ? 'put' : 'post',
    });
    const availableParents = parentOptions.filter((option) => option.category === data.category);

    const submit = (event) => {
        event.preventDefault();
        post(editing ? `/admin/leadership-profiles/${profile.id}` : '/admin/leadership-profiles', { forceFormData: true });
    };

    const clearCurrentPhoto = () => {
        if (!profile?.photo_url || !window.confirm(`Clear current photo for ${profile.full_name}?`)) {
            return;
        }

        router.patch(`/admin/leadership-profiles/${profile.id}/clear-photo`, {}, { preserveScroll: true });
    };

    const deleteProfile = () => {
        if (!editing || !window.confirm(`Delete ${profile.full_name} permanently?`)) {
            return;
        }

        router.delete(`/admin/leadership-profiles/${profile.id}`);
    };

    return (
        <AdminLayout title={editing ? 'Edit Profile' : 'Create Profile'}>
            <form onSubmit={submit} className="grid max-w-5xl gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Profile Group" error={errors.category}>
                        <select className={inputClass} value={data.category} onChange={(event) => setData({ ...data, category: event.target.value, parent_profile_id: '' })}>
                            {Object.entries(categories).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Reports / Belongs Under" error={errors.parent_profile_id}>
                        <select className={inputClass} value={data.parent_profile_id} onChange={(event) => setData('parent_profile_id', event.target.value)}>
                            <option value="">None / Top level</option>
                            {availableParents.map((option) => (
                                <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Sort Order" error={errors.sort_order}>
                        <input type="number" min="0" className={inputClass} value={data.sort_order} onChange={(event) => setData('sort_order', event.target.value)} />
                    </Field>
                    <Field label="Tree Position" error={errors.tree_position}>
                        <select className={inputClass} value={data.tree_position} onChange={(event) => setData('tree_position', event.target.value)}>
                            <option value="left">Left</option>
                            <option value="down">Down / Center</option>
                            <option value="right">Right</option>
                        </select>
                    </Field>
                </div>

                <div>
                    <Toggle label="Active / Visible on About page" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Full Name" error={errors.full_name}>
                        <input className={inputClass} value={data.full_name} onChange={(event) => setData('full_name', event.target.value)} />
                    </Field>
                    <Field label="Position / Title" error={errors.position}>
                        <input className={inputClass} value={data.position} onChange={(event) => setData('position', event.target.value)} />
                    </Field>
                </div>

                <Field label="Short Bio" error={errors.short_bio}>
                    <textarea rows="3" className={inputClass} value={data.short_bio} onChange={(event) => setData('short_bio', event.target.value)} />
                </Field>

                <Field label="Full History / Profile" error={errors.bio}>
                    <textarea rows="8" className={inputClass} value={data.bio} onChange={(event) => setData('bio', event.target.value)} />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Profile Photo" error={errors.photo}>
                        <input type="file" accept="image/*" onChange={(event) => setData('photo', event.target.files[0])} />
                        {profile?.photo_url ? (
                            <div className="mt-3 inline-flex flex-wrap items-center gap-3 rounded-xl border border-[#9DD8EA]/30 bg-[#F3FBFD] p-3">
                                <img src={profile.photo_url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                                <span className="text-sm font-bold text-slate-500">Current photo</span>
                                <button
                                    type="button"
                                    onClick={clearCurrentPhoto}
                                    className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-black text-red-700 shadow-sm transition hover:bg-red-50"
                                >
                                    <ImageOff aria-hidden="true" size={16} />
                                    Clear photo
                                </button>
                            </div>
                        ) : null}
                    </Field>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-5 py-3 font-black text-[#173B49] disabled:opacity-60">Save Profile</button>
                    {editing && isSuperAdmin ? (
                        <button
                            type="button"
                            onClick={deleteProfile}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-5 py-3 font-black text-red-700 transition hover:bg-red-100"
                        >
                            <Trash2 aria-hidden="true" size={18} />
                            Delete Profile
                        </button>
                    ) : null}
                </div>
            </form>
        </AdminLayout>
    );
}
