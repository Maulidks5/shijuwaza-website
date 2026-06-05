const fallbackPhone = '255716110270';
const message = 'Hello, I would like to learn more about SHIJUWAZA programs, partnerships, or support opportunities.';

export default function WhatsAppButton({ settings = {} }) {
    const phone = normalizePhone(settings.whatsapp_number || settings.organization_phone || settings.phone || fallbackPhone);
    const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] p-4 text-white shadow-xl shadow-[#245E73]/20 outline-none transition hover:-translate-y-1 hover:bg-[#1ebe5d] focus-visible:ring-4 focus-visible:ring-[#25D366]/35 sm:bottom-6 sm:right-6 sm:px-5"
        >
            <WhatsAppIcon />
            <span className="hidden text-sm font-black sm:inline">Chat with us</span>
            <span className="pointer-events-none absolute bottom-full right-0 mb-3 hidden whitespace-nowrap rounded-lg bg-[#245E73] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100">
                Chat with us
            </span>
        </a>
    );
}

function normalizePhone(value) {
    const digits = String(value || '').replace(/\D/g, '');

    if (digits.startsWith('0')) {
        return `255${digits.slice(1)}`;
    }

    return digits || fallbackPhone;
}

function WhatsAppIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6 fill-current">
            <path d="M16.01 3.2A12.68 12.68 0 0 0 5.25 22.6L3.7 28.8l6.35-1.48A12.68 12.68 0 1 0 16.01 3.2Zm0 22.98c-1.86 0-3.68-.5-5.27-1.45l-.38-.22-3.77.88.91-3.65-.25-.39a10.23 10.23 0 1 1 8.76 4.83Zm5.76-7.66c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.37.24-.68.08-.31-.16-1.32-.49-2.52-1.55-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.62s1.13 3.04 1.29 3.25c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.79.66.75.24 1.44.21 1.98.13.6-.09 1.86-.76 2.12-1.5.26-.73.26-1.36.18-1.5-.08-.13-.29-.21-.6-.37Z" />
        </svg>
    );
}
