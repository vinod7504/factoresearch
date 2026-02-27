import React from 'react';
import Hero from '../components/Hero';
import HomeWhatWeDo from '../components/HomeWhatWeDo';
import WhyFactoSection from '../components/WhyFactoSection';
import TrustSection from '../components/TrustSection';
import homeShowcaseVideo from '../assets/WhatsApp Video 2026-02-27 at 5.24.20 PM.mp4';

const HomePage = () => {
    return (
        <>
            <Hero />
            <HomeWhatWeDo />
            <WhyFactoSection />
            <TrustSection />
            <section className="home-video-section bg-darker">
                <div className="container">
                    <div className="home-video-card glass-card">
                        <video
                            className="home-video-player"
                            src={homeShowcaseVideo}
                            controls
                            preload="metadata"
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
