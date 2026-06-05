import { Link } from '@inertiajs/react';

const styles = {
    neutral: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    teal: 'bg-[#F3FBFD] text-[#245E73] hover:bg-[#E6F6FA]',
    amber: 'bg-[#F3FBFD] text-[#245E73] hover:bg-[#E6F6FA]',
    red: 'bg-red-50 text-red-700 hover:bg-red-100',
    emerald: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
};

export default function IconAction({ href, onClick, icon: Icon, label, tone = 'neutral', as = 'button' }) {
    const className = `grid h-10 w-10 place-items-center rounded-xl transition-all hover:shadow-md ${styles[tone] || styles.neutral}`;
    const content = (
        <>
            <Icon aria-hidden="true" size={18} />
            <span className="sr-only">{label}</span>
        </>
    );

    if (href) {
        return (
            <Link href={href} className={className} title={label} aria-label={label}>
                {content}
            </Link>
        );
    }

    return (
        <button type={as === 'button' ? 'button' : as} onClick={onClick} className={className} title={label} aria-label={label}>
            {content}
        </button>
    );
}
