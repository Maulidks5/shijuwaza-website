export default function LogoMark({ variant = 'light', logoUrl = '/images/shijuwaza-logo-cropped.png' }) {
    const textColor = variant === 'dark' ? 'text-white' : 'text-[#245E73]';
    const subTextColor = variant === 'dark' ? 'text-blue-100' : 'text-[#5BAFCB]';
    const hasCustomLogo = logoUrl && !logoUrl.includes('shijuwaza-logo-cropped.png');
    const imageTone = variant === 'dark' && !hasCustomLogo ? 'invert brightness-0' : '';

    return (
        <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-14 w-28 shrink-0 place-items-center overflow-hidden sm:h-16 sm:w-36 lg:h-[72px] lg:w-44">
                <img
                    src={logoUrl}
                    alt="SHIJUWAZA logo"
                    className={`max-h-full max-w-full object-contain ${hasCustomLogo ? 'mix-blend-multiply' : imageTone}`}
                />
            </span>
            <span className={`${hasCustomLogo ? 'hidden xl:block' : 'hidden sm:block'}`}>
                <span className={`block text-xl font-black leading-none tracking-wide ${textColor}`}>SHIJUWAZA</span>
                <span className={`mt-1 block text-xs font-semibold uppercase tracking-[0.14em] ${subTextColor}`}>
                    Zanzibar OPD Federation
                </span>
            </span>
        </span>
    );
}
