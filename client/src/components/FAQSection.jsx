import React from 'react';
import { siteData } from '../data/siteData';

const FAQSection = () => {
    return (
        <section className="section-padding team-section">
            <div className="container">
                <h2 className="section-title">{siteData.team.heading}</h2>
                <div className="faq-grid team-grid">
                    {siteData.team.members.map((member) => (
                        <article key={member.role} className="faq-card glass-card team-card">
                            <h3>{member.role}</h3>
                            <p>{member.description}</p>
                        </article>
                    ))}
                </div>
                <div className="glass-card risk-disclosure">
                    <p>{siteData.footer.disclosure}</p>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
