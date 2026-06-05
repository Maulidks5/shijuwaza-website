import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

const IDLE_LIMIT_MS = 10 * 60 * 1000;

export default function SessionSecurity() {
    const timerRef = useRef(null);
    const loggingOutRef = useRef(false);

    useEffect(() => {
        const logout = () => {
            if (loggingOutRef.current) {
                return;
            }

            loggingOutRef.current = true;
            router.post('/logout', {}, { replace: true });
        };

        const resetTimer = () => {
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(logout, IDLE_LIMIT_MS);
        };

        const activityEvents = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
        activityEvents.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));
        resetTimer();

        return () => {
            window.clearTimeout(timerRef.current);
            activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
        };
    }, []);

    return null;
}
