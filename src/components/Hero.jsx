import React from 'react';
import { motion as Motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { RouteLink } from '../router';
import { siteData } from '../data/siteData';
import homeShowcaseVideo from '../assets/WhatsApp Video 2026-02-27 at 5.24.20 PM.mp4';

const Hero = () => {
    const textReveal = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.14,
                delayChildren: 0.1,
            },
        },
    };

    const textItem = {
        hidden: { opacity: 0, y: 24 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <section id="home" className="hero-section">
            <div className="container hero-content">
                <Motion.div
                    variants={textReveal}
                    initial="hidden"
                    animate="show"
                    className="hero-text"
                >
                    <Motion.div variants={textItem} className="badge">
                        <TrendingUp size={14} /> <span>{siteData.hero.badge}</span>
                    </Motion.div>
                    <Motion.h1 variants={textItem} className="hero-title">
                        {siteData.hero.title}
                    </Motion.h1>
                    <Motion.p variants={textItem} className="hero-subtitle">
                        {siteData.hero.description}
                    </Motion.p>
                    <Motion.div variants={textItem} className="hero-btns">
                        <RouteLink
                            to={siteData.hero.primaryAction.path}
                            className="btn-primary"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {siteData.hero.primaryAction.label}
                        </RouteLink>
                        <RouteLink to={siteData.hero.secondaryAction.path} className="btn-outline">
                            {siteData.hero.secondaryAction.label}
                        </RouteLink>
                    </Motion.div>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.95, delay: 0.35 }}
                    className="hero-image"
                >
                    {/* <HeroMarketErrorBoundary>
                        <HeroMarketPanel />
                    </HeroMarketErrorBoundary> */}
                    <div className="hero-video-block">
                        <div className="hero-video-shell">
                            <video
                                className="hero-video-player"
                                src={homeShowcaseVideo}
                                controls
                                preload="metadata"
                                playsInline
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <p className="hero-video-caption">About Factoresearch</p>
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
