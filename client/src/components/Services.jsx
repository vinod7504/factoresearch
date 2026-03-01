import React from 'react';
import { motion as Motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { siteData } from '../data/siteData';

const Services = () => {
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
                    <p className="services-v2-subtitle">
                        Data-backed, action-focused research support for investors across market cycles.
                    </p>
                </Motion.div>

                <div className="services-grid service-detailed-grid services-v2-grid">
                    {siteData.services.categories.map((category, index) => (
                        <Motion.article
                            key={category.title}
                            initial={{ opacity: 0, y: 26, rotateX: -8 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.62 }}
                            className="service-card glass-card detailed-service-card services-v2-card"
                        >
                            <div className="service-card-tag">0{index + 1}</div>
                            <h3>{category.title}</h3>
                            <ul className="service-points services-v2-points">
                                {category.points.map((point) => (
                                    <li key={point}>
                                        <CheckCircle2 size={16} className="check-icon" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </Motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
