import React from 'react';
import { motion as Motion } from 'framer-motion';

const PageHeader = ({ eyebrow, title, highlight, subtitle }) => {
    return (
        <section className="page-header">
            <div className="container">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="page-header-card glass-card"
                >
                    <span className="page-header-eyebrow">{eyebrow}</span>
                    <h1 className="page-header-title">
                        {title} <span className="gradient-text">{highlight}</span>
                    </h1>
                    <p className="page-header-subtitle">{subtitle}</p>
                </Motion.div>
            </div>
        </section>
    );
};

export default PageHeader;
