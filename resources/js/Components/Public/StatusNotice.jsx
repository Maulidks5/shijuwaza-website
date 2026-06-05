import { usePage } from '@inertiajs/react';

export default function StatusNotice() {
    const { flash = {} } = usePage().props;

    if (!flash.success && !flash.error) {
        return null;
    }

    return (
        <div
            role={flash.success ? 'status' : 'alert'}
            className={`mb-6 rounded-xl border px-5 py-4 font-semibold ${flash.success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}
        >
            {flash.success || flash.error}
        </div>
    );
}
