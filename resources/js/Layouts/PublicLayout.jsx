import Footer from '../Components/Home/Footer';
import Navbar from '../Components/Home/Navbar';
import AnnouncementTicker from '../Components/Home/AnnouncementTicker';
import BackToTopButton from '../Components/Public/BackToTopButton';
import WhatsAppButton from '../Components/Public/WhatsAppButton';
import { usePage } from '@inertiajs/react';

export default function PublicLayout({ settings = {}, children }) {
    const { siteSettings = {}, siteAnnouncements = [] } = usePage().props;
    const resolvedSettings = Object.keys(settings).length ? settings : siteSettings;

    return (
        <>
            <Navbar settings={resolvedSettings} />
            <AnnouncementTicker items={siteAnnouncements} />
            <main>{children}</main>
            <Footer settings={resolvedSettings} />
            <BackToTopButton />
            <WhatsAppButton settings={resolvedSettings} />
        </>
    );
}
