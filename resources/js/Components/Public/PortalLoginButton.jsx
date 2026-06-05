import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Lock, LogIn, Mail, X } from 'lucide-react';

export default function PortalLoginButton({
    children = 'Member Login',
    className = 'btn-primary',
    iconOnly = false,
    title = 'Login',
    ariaLabel = 'Login to portal',
    onOpened,
}) {
    const [open, setOpen] = useState(false);

    const showLogin = () => {
        setOpen(true);
        onOpened?.();
    };

    return (
        <>
            <button type="button" onClick={showLogin} className={className} title={title} aria-label={ariaLabel}>
                {iconOnly ? <LogIn aria-hidden="true" size={18} /> : children}
            </button>
            {open ? <PortalLoginModal onClose={() => setOpen(false)} /> : null}
        </>
    );
}

function PortalLoginModal({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/login', {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-[#245E73]/75 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="portal-login-title">
            <button type="button" className="absolute inset-0 cursor-default" aria-label="Close login form" onClick={onClose} />
            <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl border border-white/40 bg-white p-6 shadow-2xl shadow-[#245E73]/25 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
                            <Lock aria-hidden="true" size={24} />
                        </div>
                        <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#5BAFCB]">SHIJUWAZA Portal</p>
                        <h2 id="portal-login-title" className="mt-2 text-2xl font-black text-[#245E73]">Login to continue</h2>
                        <p className="mt-2 leading-7 text-slate-600">
                            Use your assigned credentials to access the admin dashboard or member portal.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200" aria-label="Close login form">
                        <X aria-hidden="true" size={20} />
                    </button>
                </div>

                <div className="mt-6 grid gap-4">
                    <label className="grid gap-2">
                        <span className="text-sm font-black text-slate-700">Email Address</span>
                        <span className="relative">
                            <Mail aria-hidden="true" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                type="email"
                                autoComplete="email"
                                autoFocus
                                aria-invalid={errors.email ? 'true' : 'false'}
                                className="w-full rounded-xl border border-slate-200 px-11 py-3 outline-none transition focus:border-[#5BAFCB] focus:ring-4 focus:ring-[#5BAFCB]/10"
                            />
                        </span>
                        {errors.email ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.email}</span> : null}
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-black text-slate-700">Password</span>
                        <span className="relative">
                            <Lock aria-hidden="true" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={errors.password ? 'true' : 'false'}
                                className="w-full rounded-xl border border-slate-200 px-11 py-3 outline-none transition focus:border-[#5BAFCB] focus:ring-4 focus:ring-[#5BAFCB]/10"
                            />
                        </span>
                        {errors.password ? <span role="alert" className="text-sm font-semibold text-red-600">{errors.password}</span> : null}
                    </label>

                    <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-[#5BAFCB]" />
                        Remember me
                    </label>

                    <button disabled={processing} className="btn-primary justify-center disabled:opacity-60">
                        {processing ? 'Signing in...' : 'Login'}
                    </button>
                    <a href="/login" className="text-center text-sm font-black text-[#5BAFCB] hover:text-[#245E73]">
                        Open full login page
                    </a>
                </div>
            </form>
        </div>
    );
}
