import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RouteLink } from '../router';
import { siteData } from '../data/siteData';

const toServicePath = (slug) => `/services/${slug}`;

const Services = () => {
    const categories = siteData.services.categories;

    return (
        <section id="services" className="section-padding services-v2-section">
            <div className="container">
                <Motion.div
                    className="glass-card services-v2-head"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">{siteData.services.title}</h2>
                    <p className="services-v2-subtitle">{siteData.services.subtitle}</p>
                </Motion.div>

                <div className="services-v3-selector-grid" aria-label="Service categories">
                    {categories.map((category, index) => (
                        <RouteLink
                            key={category.slug}
                            to={toServicePath(category.slug)}
                            className="services-v3-selector-link"
                            aria-label={`Open ${category.title}`}
                        >
                            <Motion.article
                                className="glass-card services-v3-selector"
                                initial={{ opacity: 0, y: 24, rotateX: -8 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ delay: index * 0.06, duration: 0.56 }}
                            >
                                <div className="services-v3-selector-head">
                                    <span className="service-card-tag">{String(index + 1).padStart(2, '0')}</span>
                                    <ArrowUpRight size={14} className="services-v3-selector-arrow" />
                                </div>

                                <h3>{category.title}</h3>
                                <p>{category.summary}</p>

                                <ul className="services-v3-preview-points">
                                    {category.points.slice(0, 3).map((point) => (
                                        <li key={`${category.slug}-${point.title}`}>
                                            <CheckCircle2 size={14} className="check-icon" />
                                            <span>{point.title}</span>
                                        </li>
                                    ))}
                                </ul>

                                <span className="services-v3-open-indicator">Click here for full details</span>
                            </Motion.article>
                        </RouteLink>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
