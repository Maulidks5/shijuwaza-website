export function Field({ label, error, children }) {
    return (
        <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{label}</span>
            {children}
            {error ? <span className="text-sm font-semibold text-red-600">{error}</span> : null}
        </label>
    );
}

export const inputClass =
    'w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#9DD8EA] focus:ring-4 focus:ring-[#9DD8EA]/10';

export function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-[#9DD8EA]" />
            <span className="min-w-0 font-bold text-slate-700">{label}</span>
        </label>
    );
}

export function StatusBadge({ active, children }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
            {children || (active ? 'Active' : 'Inactive')}
        </span>
    );
}
