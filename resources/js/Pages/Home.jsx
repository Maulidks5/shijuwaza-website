import AboutPreview from '../Components/Home/AboutPreview';
import AnnouncementTicker from '../Components/Home/AnnouncementTicker';
import DonationSection from '../Components/Home/DonationSection';
import FaqSection from '../Components/Home/FaqSection';
import Footer from '../Components/Home/Footer';
import HeroSection from '../Components/Home/HeroSection';
import ImpactStats from '../Components/Home/ImpactStats';
import Navbar from '../Components/Home/Navbar';
import NewsPreview from '../Components/Home/NewsPreview';
import PartnersSection from '../Components/Home/PartnersSection';
import ProgramCards from '../Components/Home/ProgramCards';
import BackToTopButton from '../Components/Public/BackToTopButton';
import WhatsAppButton from '../Components/Public/WhatsAppButton';

export default function Home({ hero = {}, stats = [], programs = [], newsPosts = [], announcements = [], resources = [], mediaItems = [], partners = [], settings = {} }) {
    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#7CC8DE] focus:px-5 focus:py-3 focus:font-black focus:text-[#245E73]"
            >
                Skip to main content
            </a>
            <Navbar settings={settings} />
            <AnnouncementTicker items={announcements} />
            <main id="main-content">
                <HeroSection hero={hero} />
                <ImpactStats stats={stats} />
                <AboutPreview />
                <ProgramCards programs={programs} />
                <PartnersSection partners={partners} />
                <NewsPreview posts={newsPosts} />
                <FaqSection />
                <DonationSection />
            </main>
            <Footer settings={settings} />
            <BackToTopButton />
            <WhatsAppButton settings={settings} />
        </>
    );
}
