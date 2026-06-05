import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function useConfirmDelete() {
    const [target, setTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    const requestDelete = ({ url, title, description }) => {
        setTarget({ url, title, description });
    };

    const cancelDelete = () => setTarget(null);

    const confirmDelete = () => {
        if (!target) {
            return;
        }

        setProcessing(true);
        router.delete(target.url, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setTarget(null);
            },
        });
    };

    return {
        dialogProps: {
            open: Boolean(target),
            title: target?.title,
            description: target?.description,
            onCancel: cancelDelete,
            onConfirm: confirmDelete,
            processing,
        },
        requestDelete,
    };
}
