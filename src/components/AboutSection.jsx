import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { siteData } from '../data/siteData';

const AboutSection = ({ showActions = false, RouteLink = null }) => {
    const canRenderActions = showActions && RouteLink;

    return (
        <section id="about" className="section-padding">
            <div className="container about-stack">
                <h2 className="section-title">{siteData.about.title}</h2>

                <article className="glass-card about-block">
                    <h3>{siteData.about.decadeTitle}</h3>
                    {siteData.about.decadeParagraphs.map((text) => (
                        <p key={text}>{text}</p>
                    ))}
                </article>

                <article className="glass-card about-block sebi-block">
                    <h3>
                        <ShieldCheck size={18} />
                        <span>{siteData.about.sebiTitle}</span>
                    </h3>
                    <p>{siteData.about.sebiParagraph}</p>
                </article>

                <article className="glass-card about-block">
                    <h3>
                        <Database size={18} />
                        <span>{siteData.about.philosophyTitle}</span>
                    </h3>
                    <p>{siteData.about.philosophyIntro}</p>
                    <ul className="philosophy-list">
                        {siteData.about.philosophyPoints.map((point) => (
                            <li key={point.title}>
                                <strong>{point.title}:</strong> {point.description}
                            </li>
                        ))}
                    </ul>
                </article>

                {canRenderActions && (
                    <div className="home-cta-row">
                        <RouteLink to="/services" className="btn-outline">Our Research Services</RouteLink>
                        <RouteLink to="/contact" className="btn-primary">Talk to Research Desk</RouteLink>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AboutSection;
