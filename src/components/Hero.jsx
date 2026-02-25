import React from 'react';
import { motion as Motion } from 'framer-motion';
import { TrendingUp, Star, Users } from 'lucide-react';
import { RouteLink } from '../router';
import { siteData } from '../data/siteData';

const Hero = () => {
    const [primaryMetric, secondaryMetric] = siteData.hero.stats;

    return (
        <section id="home" className="hero-section">
            <div className="container hero-content">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-text"
                >
                    <div className="badge">
                        <TrendingUp size={14} /> <span>{siteData.hero.badge}</span>
                    </div>
                    <h1 className="hero-title">{siteData.hero.title}</h1>
                    <p className="hero-subtitle">{siteData.hero.description}</p>
                    <div className="hero-btns">
                        <RouteLink to={siteData.hero.primaryAction.path} className="btn-primary">
                            {siteData.hero.primaryAction.label}
                        </RouteLink>
                        <RouteLink to={siteData.hero.secondaryAction.path} className="btn-outline">
                            {siteData.hero.secondaryAction.label}
                        </RouteLink>
                    </div>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hero-image"
                >
                    <div className="stat-card glass-card">
                        <Star className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">{primaryMetric.value}</span>
                            <span className="stat-label">{primaryMetric.label}</span>
                        </div>
                    </div>
                    <div className="security-card glass-card">
                        <Users className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">{secondaryMetric.value}</span>
                            <span className="stat-label">{secondaryMetric.label}</span>
                        </div>
                    </div>
                </Motion.div>
            </div>

            <div className="hero-background">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>
            </div>
        </section>
    );
};

export default Hero;
