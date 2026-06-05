import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Remove Permanently', processingLabel = 'Removing...', onCancel, onConfirm, processing = false }) {
    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onCancel]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-950/10">
                <div className="flex items-start gap-4 border-b border-slate-100 p-6">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-50 text-red-700 ring-8 ring-red-50/60">
                        <AlertTriangle aria-hidden="true" size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 id="confirm-title" className="text-xl font-black text-slate-950">{title}</h2>
                        <p className="mt-2 leading-7 text-slate-600">{description}</p>
                    </div>
                    <button type="button" onClick={onCancel} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#9DD8EA]" aria-label="Close confirmation dialog">
                        <X aria-hidden="true" size={18} />
                    </button>
                </div>
                <div className="flex flex-col-reverse gap-3 bg-slate-50 p-5 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#9DD8EA]">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} disabled={processing} className="rounded-lg bg-red-700 px-5 py-3 font-black text-white outline-none hover:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:opacity-60">
                        {processing ? processingLabel : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
