export default function LogoMark({ variant = 'light', logoUrl = '/images/shijuwaza-logo-horizontal.png' }) {
    const textColor = variant === 'dark' ? 'text-white' : 'text-[#245E73]';
    const subTextColor = variant === 'dark' ? 'text-blue-100' : 'text-[#5BAFCB]';
    const hasCustomLogo = logoUrl && !logoUrl.includes('shijuwaza-logo-cropped.png');
    const imageTone = variant === 'dark' && !hasCustomLogo ? 'invert brightness-0' : '';
    const logoBox = hasCustomLogo
        ? 'h-16 w-56 sm:h-[72px] sm:w-72 lg:h-20 lg:w-80'
        : 'h-14 w-28 sm:h-16 sm:w-36 lg:h-[72px] lg:w-44';

    return (
        <span className="flex min-w-0 items-center gap-3">
            <span className={`grid shrink-0 place-items-center ${logoBox}`}>
                <img
                    src={logoUrl}
                    alt="SHIJUWAZA logo"
                    className={`block h-full w-full object-contain object-left ${hasCustomLogo ? 'mix-blend-multiply' : imageTone}`}
                />
            </span>
            {!hasCustomLogo ? (
                <span className="hidden sm:block">
                    <span className={`block text-xl font-black leading-none tracking-wide ${textColor}`}>SHIJUWAZA</span>
                    <span className={`mt-1 block text-xs font-semibold uppercase tracking-[0.14em] ${subTextColor}`}>
                        Zanzibar OPD Federation
                    </span>
                </span>
            ) : null}
        </span>
    );
}
