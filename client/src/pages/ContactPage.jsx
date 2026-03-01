import React from 'react';
import PageHeader from '../components/PageHeader';
import Contact from '../components/Contact';

const ContactPage = () => {
    return (
        <div className="inner-page">
            <PageHeader
                eyebrow="Direct Support"
                title="Get In"
                highlight="Touch"
                subtitle="Please contact us directly with questions, comments, or scheduling inquiries."
            />
            <Contact />
        </div>
    );
};

export default ContactPage;
