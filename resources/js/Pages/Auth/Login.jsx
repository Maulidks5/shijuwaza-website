import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const portalCopy = {
    admin: {
        title: 'Admin Login',
        description: 'Sign in to manage SHIJUWAZA website content.',
        head: 'Admin Login',
    },
    member: {
        title: 'Member Login',
        description: 'Sign in to access the SHIJUWAZA member portal.',
        head: 'Member Login',
    },
    portal: {
        title: 'Portal Login',
        description: 'Sign in to continue to your SHIJUWAZA portal.',
        head: 'Portal Login',
    },
};

export default function Login({ portal = 'portal' }) {
    const [showPassword, setShowPassword] = useState(false);
    const flash = usePage().props.flash || {};
    const copy = portalCopy[portal] || portalCopy.portal;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <main className="grid min-h-screen place-items-center bg-[#F8FAFC] px-4">
            <Head title={copy.head} />
            <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-[#5BAFCB]/10 bg-white p-8 shadow-2xl shadow-[#245E73]/10">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
                    <Lock aria-hidden="true" size={26} />
                </div>
                <h1 className="mt-6 text-3xl font-black text-[#245E73]">{copy.title}</h1>
                <p className="mt-2 text-slate-600">{copy.description}</p>
                {flash.error ? <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{flash.error}</p> : null}

                <div className="mt-8 grid gap-4">
                    <label className="grid gap-2">
                        <span className="text-sm font-black text-slate-700">Email</span>
                        <input value={data.email} onChange={(event) => setData('email', event.target.value)} type="email" className="rounded-lg border border-slate-200 px-4 py-3" />
                        {errors.email ? <span className="text-sm font-semibold text-red-600">{errors.email}</span> : null}
                    </label>
                    <label className="grid gap-2">
                        <span className="text-sm font-black text-slate-700">Password</span>
                        <span className="relative">
                            <input
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-12"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#245E73]"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                            </button>
                        </span>
                        {errors.password ? <span className="text-sm font-semibold text-red-600">{errors.password}</span> : null}
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} />
                        Remember me
                    </label>
                    <button disabled={processing} className="rounded-lg bg-[#5BAFCB] px-5 py-3 font-black text-white hover:bg-[#245E73] disabled:opacity-60">
                        Sign In
                    </button>
                </div>
            </form>
        </main>
    );
}
