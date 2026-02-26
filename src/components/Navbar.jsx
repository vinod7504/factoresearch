import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { RouteLink } from '../router';
import { useRouter } from '../useRouter';
import { navLinks, pricingLinks } from '../routes';
import { siteData } from '../data/siteData';
import { legalLinks } from '../data/legalData';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPricingMenuOpen, setIsPricingMenuOpen] = useState(false);
    const [isLegalMenuOpen, setIsLegalMenuOpen] = useState(false);
    const [isMobilePricingMenuOpen, setIsMobilePricingMenuOpen] = useState(false);
    const [isMobileLegalMenuOpen, setIsMobileLegalMenuOpen] = useState(false);
    const { path } = useRouter();
    const pricingMenuRef = useRef(null);
    const legalMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (pricingMenuRef.current && !pricingMenuRef.current.contains(event.target)) {
                setIsPricingMenuOpen(false);
            }
            if (legalMenuRef.current && !legalMenuRef.current.contains(event.target)) {
                setIsLegalMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const linkClassName = (targetPath) => (path === targetPath ? 'active' : '');
    const isPricingActive = path === '/pricing' || path.startsWith('/pricing/');
    const isLegalActive = legalLinks.some((item) => item.path === path);
    const primaryNavLinks = navLinks.filter((item) => item.path !== '/pricing' && item.path !== '/contact');
    const contactLink = navLinks.find((item) => item.path === '/contact');

    const handleMobileClose = () => {
        setIsMobileMenuOpen(false);
        setIsMobilePricingMenuOpen(false);
        setIsMobileLegalMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <div className="logo">
                    <RouteLink to="/">
                        <img
                            src={siteData.brand.logoUrl}
                            alt={`${siteData.brand.name} Logo`}
                            className="logo-img"
                        />
                    </RouteLink>
                </div>

                <div className="nav-links desktop">
                    {primaryNavLinks.map((item) => (
                        <RouteLink key={item.path} to={item.path} className={linkClassName(item.path)}>
                            {item.label}
                        </RouteLink>
                    ))}
                    <div className="pricing-menu" ref={pricingMenuRef}>
                        <button
                            type="button"
                            className={`pricing-trigger ${isPricingActive ? 'active' : ''}`}
                            onClick={() => {
                                setIsLegalMenuOpen(false);
                                setIsPricingMenuOpen((open) => !open);
                            }}
                        >
                            Pricing <ChevronDown size={14} className={isPricingMenuOpen ? 'open' : ''} />
                        </button>
                        {isPricingMenuOpen && (
                            <div className="pricing-dropdown glass-card">
                                {pricingLinks.map((item) => (
                                    <RouteLink
                                        key={item.path}
                                        to={item.path}
                                        className={`pricing-dropdown-link ${linkClassName(item.path)}`}
                                        onClick={() => setIsPricingMenuOpen(false)}
                                    >
                                        {item.label}
                                    </RouteLink>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="legal-menu" ref={legalMenuRef}>
                        <button
                            type="button"
                            className={`legal-trigger ${isLegalActive ? 'active' : ''}`}
                            onClick={() => {
                                setIsPricingMenuOpen(false);
                                setIsLegalMenuOpen((open) => !open);
                            }}
                        >
                            Legal <ChevronDown size={14} className={isLegalMenuOpen ? 'open' : ''} />
                        </button>
                        {isLegalMenuOpen && (
                            <div className="legal-dropdown glass-card">
                                {legalLinks.map((item) => (
                                    <RouteLink
                                        key={item.path}
                                        to={item.path}
                                        className={`legal-dropdown-link ${linkClassName(item.path)}`}
                                        onClick={() => setIsLegalMenuOpen(false)}
                                    >
                                        {item.label}
                                    </RouteLink>
                                ))}
                            </div>
                        )}
                    </div>
                    {contactLink && (
                        <RouteLink to={contactLink.path} className={linkClassName(contactLink.path)}>
                            {contactLink.label}
                        </RouteLink>
                    )}
                    <RouteLink to={siteData.hero.primaryAction.path} className="nav-cta">
                        Onboarding <ArrowUpRight size={16} />
                    </RouteLink>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => {
                        setIsMobileMenuOpen(!isMobileMenuOpen);
                        if (isMobileMenuOpen) setIsMobileLegalMenuOpen(false);
                    }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {primaryNavLinks.map((item) => (
                        <RouteLink
                            key={item.path}
                            to={item.path}
                            className={linkClassName(item.path)}
                            onClick={handleMobileClose}
                        >
                            {item.label}
                        </RouteLink>
                    ))}
                    <button
                        type="button"
                        className={`mobile-pricing-trigger ${isPricingActive ? 'active' : ''}`}
                        onClick={() => {
                            setIsMobileLegalMenuOpen(false);
                            setIsMobilePricingMenuOpen((open) => !open);
                        }}
                    >
                        Pricing <ChevronDown size={14} className={isMobilePricingMenuOpen ? 'open' : ''} />
                    </button>
                    {isMobilePricingMenuOpen && (
                        <div className="mobile-pricing-links">
                            {pricingLinks.map((item) => (
                                <RouteLink
                                    key={item.path}
                                    to={item.path}
                                    className={linkClassName(item.path)}
                                    onClick={handleMobileClose}
                                >
                                    {item.label}
                                </RouteLink>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        className={`mobile-legal-trigger ${isLegalActive ? 'active' : ''}`}
                        onClick={() => {
                            setIsMobilePricingMenuOpen(false);
                            setIsMobileLegalMenuOpen((open) => !open);
                        }}
                    >
                        Legal <ChevronDown size={14} className={isMobileLegalMenuOpen ? 'open' : ''} />
                    </button>
                    {isMobileLegalMenuOpen && (
                        <div className="mobile-legal-links">
                            {legalLinks.map((item) => (
                                <RouteLink
                                    key={item.path}
                                    to={item.path}
                                    className={linkClassName(item.path)}
                                    onClick={handleMobileClose}
                                >
                                    {item.label}
                                </RouteLink>
                            ))}
                        </div>
                    )}
                    {contactLink && (
                        <RouteLink
                            to={contactLink.path}
                            className={linkClassName(contactLink.path)}
                            onClick={handleMobileClose}
                        >
                            {contactLink.label}
                        </RouteLink>
                    )}
                    <RouteLink to={siteData.hero.primaryAction.path} className="nav-cta" onClick={handleMobileClose}>
                        Onboarding
                    </RouteLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
