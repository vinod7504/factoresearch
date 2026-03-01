import React from 'react';
import { Sparkles, Target, Eye } from 'lucide-react';
import { siteData } from '../data/siteData';

const valueCards = [
    { key: 'values', icon: Sparkles },
    { key: 'mission', icon: Target },
    { key: 'vision', icon: Eye },
];

const TrustSection = () => {
    return (
        <section className="section-padding trust-section bg-darker">
            <div className="container">
                <div className="trust-grid">
                    {valueCards.map((valueCard) => {
                        const item = siteData[valueCard.key];
                        const IconComponent = valueCard.icon;

                        return (
                            <article key={valueCard.key} className="trust-card glass-card value-card">
                                <div className="trust-heading">
                                    <IconComponent size={18} className="trust-icon" />
                                    <h3>{item.heading}</h3>
                                </div>
                                <p>{item.statement}</p>
                                {item.explanation && <p>{item.explanation}</p>}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
