import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 420);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`fixed bottom-24 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#245E73] text-white shadow-xl shadow-[#245E73]/20 outline-none transition duration-200 hover:-translate-y-1 hover:bg-[#0786A4] focus-visible:ring-4 focus-visible:ring-[#5BAFCB]/30 sm:bottom-24 sm:right-6 ${
                visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
        >
            <ArrowUp aria-hidden="true" size={22} />
        </button>
    );
}
