import { usePage } from '@inertiajs/react';

export function useI18n() {
    const { i18n = {} } = usePage().props;
    const messages = i18n.messages || {};

    return {
        locale: i18n.locale || 'en',
        supported: i18n.supported || ['en', 'sw'],
        t: (key, fallback = key) => messages[key] || fallback,
    };
}
