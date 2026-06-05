const tones = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    archived: 'bg-slate-200 text-slate-700',
};

export default function StatusPill({ status }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${tones[status] || tones.pending}`}>
            {status}
        </span>
    );
}
