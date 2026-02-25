import React from 'react';
import { motion as Motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { siteData } from '../data/siteData';

const Services = () => {
    return (
        <section id="services" className="section-padding">
            <div className="container">
                <h2 className="section-title">{siteData.services.title}</h2>
                <div className="services-grid service-detailed-grid">
                    {siteData.services.categories.map((category, index) => (
                        <Motion.article
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="service-card glass-card detailed-service-card"
                        >
                            <h3>{category.title}</h3>
                            <ul className="service-points">
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
