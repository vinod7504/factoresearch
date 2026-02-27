import React from 'react';
import Hero from '../components/Hero';
import HomeWhatWeDo from '../components/HomeWhatWeDo';
import WhyFactoSection from '../components/WhyFactoSection';
import TrustSection from '../components/TrustSection';

const HomePage = () => {
    return (
        <>
            <Hero />
            <HomeWhatWeDo />
            <WhyFactoSection />
            <TrustSection />
        </>
    );
};

export default HomePage;
