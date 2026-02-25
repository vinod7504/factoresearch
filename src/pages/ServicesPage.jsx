import React from 'react';
import PageHeader from '../components/PageHeader';
import Services from '../components/Services';

const ServicesPage = () => {
    return (
        <div className="inner-page">
            <PageHeader
                eyebrow="What We Do"
                title="Research"
                highlight="Services"
                subtitle="Equity, fundamental, technical, thematic, portfolio, and educational research services."
            />
            <Services />
        </div>
    );
};

export default ServicesPage;
