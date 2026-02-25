import React from 'react';
import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';
import TrustSection from '../components/TrustSection';
import FAQSection from '../components/FAQSection';

const AboutPage = () => {
    return (
        <div className="inner-page">
            <PageHeader
                eyebrow="Who We Are"
                title="About"
                highlight="Facto Research"
                subtitle="A decade of market mastery, institutional-grade analysis, and a commitment to truth through data."
            />
            <AboutSection />
            <TrustSection />
            <FAQSection />
        </div>
    );
};

export default AboutPage;
