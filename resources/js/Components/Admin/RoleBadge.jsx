export default function RoleBadge({ role }) {
    const styles = {
        'Super Admin': 'bg-[#9DD8EA] text-[#173B49]',
        Admin: 'bg-[#E6F6FA] text-[#245E73]',
        Editor: 'bg-slate-200 text-slate-700',
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[role] || 'bg-slate-100 text-slate-600'}`}>
            {role || 'No role'}
        </span>
    );
}
