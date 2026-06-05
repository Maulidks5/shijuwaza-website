import { Head, usePage } from '@inertiajs/react';

const siteName = 'SHIJUWAZA';
const defaultDescription = 'SHIJUWAZA advances disability rights, inclusion, OPD leadership, and accountable participation for persons with disabilities in Zanzibar.';
const defaultImage = '/images/activities/shijuwaza-training-08.jpeg';

export default function SeoHead({ title, description = defaultDescription, image = defaultImage, type = 'website' }) {
    const { url } = usePage();
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const canonical = absoluteUrl(url?.split('?')[0] || '/');
    const imageUrl = absoluteUrl(image || defaultImage);

    return (
        <Head title={title || siteName}>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={imageUrl} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Head>
    );
}

function absoluteUrl(path) {
    if (!path) {
        return defaultImage;
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    if (typeof window === 'undefined') {
        return path;
    }

    return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
}
