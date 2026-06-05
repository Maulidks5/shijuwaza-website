export default function LogoMark({ variant = 'light' }) {
    const textColor = variant === 'dark' ? 'text-white' : 'text-[#245E73]';
    const subTextColor = variant === 'dark' ? 'text-blue-100' : 'text-[#5BAFCB]';
    const imageTone = variant === 'dark' ? 'invert brightness-0' : '';

    return (
        <span className="flex items-center gap-3">
            <span className="grid h-12 w-24 shrink-0 place-items-center sm:h-14 sm:w-30 lg:h-16 lg:w-36">
                <img
                    src="/images/shijuwaza-logo-cropped.png"
                    alt="SHIJUWAZA logo"
                    className={`h-full w-full object-contain ${imageTone}`}
                />
            </span>
            <span className="hidden sm:block">
                <span className={`block text-xl font-black leading-none tracking-wide ${textColor}`}>SHIJUWAZA</span>
                <span className={`mt-1 block text-xs font-semibold uppercase tracking-[0.14em] ${subTextColor}`}>
                    Zanzibar OPD Federation
                </span>
            </span>
        </span>
    );
}
