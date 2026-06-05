import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function MemberUpdateTextModal({ update, onClose }) {
    useEffect(() => {
        if (!update) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, update]);

    if (!update) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[130] grid place-items-center bg-[#245E73]/75 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="member-update-title">
            <button type="button" className="absolute inset-0 cursor-default" aria-label="Close update" onClick={onClose} />
            <article className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-[#245E73]/25">
                <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5BAFCB]">{update.member?.acronym || 'Member OPD'} {update.approved_at ? `- ${update.approved_at}` : ''}</p>
                        <h2 id="member-update-title" className="mt-2 text-2xl font-black leading-tight text-[#245E73]">{update.title}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Close update">
                        <X aria-hidden="true" size={20} />
                    </button>
                </header>
                <div className="max-h-[62vh] overflow-y-auto p-6">
                    <p className="whitespace-pre-line text-lg leading-8 text-slate-700">{update.body || update.excerpt}</p>
                </div>
            </article>
        </div>
    );
}
