import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Activity, BarChart3, Globe2, Layers3 } from 'lucide-react';

const items = [
    {
        title: 'Equity Intelligence',
        description:
            'High-conviction, deep-dive reports on individual stocks. We analyze the forensics so you can invest with confidence.',
        Icon: BarChart3,
    },
    {
        title: 'Strategic Baskets',
        description:
            'Thematic collections of stocks designed for long-term wealth creation, backed by a decade of methodology.',
        Icon: Layers3,
    },
    {
        title: 'Tactical Playbooks',
        description:
            'Short-to-medium term research focusing on price momentum, volume data, and technical setups.',
        Icon: Activity,
    },
    {
        title: 'Macro Outlook',
        description:
            'Big-picture analysis of the Indian economy and global trends to help you stay ahead of the curve.',
        Icon: Globe2,
    },
];

const HomeWhatWeDo = () => {
    return (
        <section className="section-padding home-what-we-do-section">
            <div className="container">
                <h2 className="section-title">What We Do!</h2>
                <div className="what-we-do-grid">
                    {items.map((item, index) => (
                        <Motion.article
                            key={item.title}
                            className="what-we-do-card"
                            initial={{ opacity: 0, y: 36, rotateX: -10 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.7, delay: index * 0.08 }}
                        >
                            <div className="what-we-do-card-inner">
                                <div className="what-we-do-card-icon-wrap">
                                    <item.Icon size={20} className="what-we-do-card-icon" />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <div className="orb orb-one" />
                                <div className="orb orb-two" />
                            </div>
                        </Motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeWhatWeDo;
