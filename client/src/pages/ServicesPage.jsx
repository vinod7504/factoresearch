import React from 'react';
import PageHeader from '../components/PageHeader';
import Services from '../components/Services';

const ServicesPage = () => {
    return (
        <div className="inner-page services-page">
            <div className="services-page-bg" aria-hidden="true">
                <span className="services-orb orb-a" />
                <span className="services-orb orb-b" />
                <span className="services-orb orb-c" />
                <span className="services-grid-lines" />
            </div>
            <PageHeader
                eyebrow="What We Do"
                title="Research"
                highlight="Services"
                subtitle="Choose a service below to open its full details on a dedicated page."
            />
            <Services />
        </div>
    );
};

export default ServicesPage;
