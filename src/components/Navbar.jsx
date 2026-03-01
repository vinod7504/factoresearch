import React, { useState, useEffect, useRef } from 'react';
import {
    Menu,
    X,
    ArrowUpRight,
    ChevronDown,
    BarChart3,
    TrendingUp,
    Activity,
    Layers3,
    Target,
    Sparkles,
} from 'lucide-react';
import { RouteLink } from '../router';
import { useRouter } from '../useRouter';
import { navLinks, pricingLinks } from '../routes';
import { siteData } from '../data/siteData';

const serviceLinks = [
    {
        key: 'equity-research',
        label: 'Equity Research & Stock Recommendations',
        path: '/services',
        Icon: TrendingUp,
        subtitle: 'Research-backed stock ideas with entry, exit, and risk guidance.',
    },
    {
        key: 'fundamental-research',
        label: 'Fundamental Research Reports',
        path: '/services',
        Icon: BarChart3,
        subtitle: 'Business, valuation, and financial quality analysis for investors.',
    },
    {
        key: 'technical-analysis',
        label: 'Technical Analysis, Market Trends & Live Index Tracking',
        path: '/services',
        Icon: Activity,
        subtitle: 'Momentum, charts, index tracking, and short-term market structure.',
    },
    {
        key: 'portfolio-baskets',
        label: 'Portfolio Baskets',
        path: '/services',
        Icon: Layers3,
        subtitle: 'Curated baskets with allocation logic and periodic review updates.',
    },
    {
        key: 'thematic-sectoral',
        label: 'Thematic & Sectoral Research',
        path: '/services',
        Icon: Target,
        subtitle: 'Sector-focused research across emerging trends and market cycles.',
    },
    {
        key: 'educational-content',
        label: 'Educational Content & Market Learning',
        path: '/services',
        Icon: Sparkles,
        subtitle: 'Courses, webinars, and practical market-learning resources.',
    },
];

const pricingMenuMeta = {
    '/pricing/stock-cash': {
        Icon: BarChart3,
        subtitle: 'Cash market recommendations with clear entry and exit levels.',
    },
    '/pricing/stock-future': {
        Icon: TrendingUp,
        subtitle: 'Trend-driven futures setups with risk-managed execution.',
    },
    '/pricing/stock-option': {
        Icon: Activity,
        subtitle: 'Stock option strategies with strike and volatility guidance.',
    },
    '/pricing/index-future': {
        Icon: Layers3,
        subtitle: 'Nifty and Bank Nifty futures calls for active traders.',
    },
    '/pricing/index-option': {
        Icon: Target,
        subtitle: 'Index option plans for expiry-based market opportunities.',
    },
    '/pricing/investment-services': {
        Icon: Sparkles,
        subtitle: 'Research-led portfolio and investment planning support.',
    },
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
    const [isPricingMenuOpen, setIsPricingMenuOpen] = useState(false);
    const [isMobileServicesMenuOpen, setIsMobileServicesMenuOpen] = useState(false);
    const [isMobilePricingMenuOpen, setIsMobilePricingMenuOpen] = useState(false);
    const { path } = useRouter();
    const servicesMenuRef = useRef(null);
    const pricingMenuRef = useRef(null);
    const servicesCloseTimerRef = useRef(null);
    const pricingCloseTimerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
                setIsServicesMenuOpen(false);
            }
            if (pricingMenuRef.current && !pricingMenuRef.current.contains(event.target)) {
                setIsPricingMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    useEffect(() => {
        return () => {
            if (servicesCloseTimerRef.current) {
                clearTimeout(servicesCloseTimerRef.current);
            }
            if (pricingCloseTimerRef.current) {
                clearTimeout(pricingCloseTimerRef.current);
            }
        };
    }, []);

    const linkClassName = (targetPath) => (path === targetPath ? 'active' : '');
    const isServicesActive = path === '/services';
    const isPricingActive = path === '/pricing' || path.startsWith('/pricing/');
    const primaryNavLinks = navLinks.filter(
        (item) => item.path !== '/services' && item.path !== '/pricing' && item.path !== '/contact'
    );
    const contactLink = navLinks.find((item) => item.path === '/contact');

    const handleServicesHoverOpen = () => {
        if (servicesCloseTimerRef.current) clearTimeout(servicesCloseTimerRef.current);
        setIsPricingMenuOpen(false);
        setIsServicesMenuOpen(true);
    };

    const handleServicesHoverClose = () => {
        servicesCloseTimerRef.current = setTimeout(() => {
            setIsServicesMenuOpen(false);
        }, 120);
    };

    const handlePricingHoverOpen = () => {
        if (pricingCloseTimerRef.current) clearTimeout(pricingCloseTimerRef.current);
        setIsServicesMenuOpen(false);
        setIsPricingMenuOpen(true);
    };

    const handlePricingHoverClose = () => {
        pricingCloseTimerRef.current = setTimeout(() => {
            setIsPricingMenuOpen(false);
        }, 120);
    };

    const renderRichDropdownLink = (item, metaMap, FallbackIcon, className, onClick) => {
        const meta = metaMap[item.path] || {};
        const Icon = meta.Icon || FallbackIcon;
        return (
            <RouteLink key={item.path} to={item.path} className={className} onClick={onClick}>
                <span className="dropdown-link-icon">
                    <Icon size={16} />
                </span>
                <span className="dropdown-link-copy">
                    <span className="dropdown-link-title">{item.label}</span>
                    <span className="dropdown-link-subtitle">{meta.subtitle}</span>
                </span>
            </RouteLink>
        );
    };

    const handleMobileClose = () => {
        setIsMobileMenuOpen(false);
        setIsMobileServicesMenuOpen(false);
        setIsMobilePricingMenuOpen(false);
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
                    <div
                        className="pricing-menu"
                        ref={servicesMenuRef}
                        onMouseEnter={handleServicesHoverOpen}
                        onMouseLeave={handleServicesHoverClose}
                    >
                        <button
                            type="button"
                            className={`pricing-trigger ${isServicesActive ? 'active' : ''}`}
                            onClick={() => {
                                setIsPricingMenuOpen(false);
                                setIsServicesMenuOpen((open) => !open);
                            }}
                        >
                            Services <ChevronDown size={14} className={isServicesMenuOpen ? 'open' : ''} />
                        </button>
                        {isServicesMenuOpen && (
                            <div className="pricing-dropdown glass-card">
                                {serviceLinks.map((item) => (
                                    <RouteLink
                                        key={item.key}
                                        to={item.path}
                                        className={`pricing-dropdown-link ${linkClassName(item.path)}`}
                                        onClick={() => setIsServicesMenuOpen(false)}
                                    >
                                        <span className="dropdown-link-icon">
                                            <item.Icon size={16} />
                                        </span>
                                        <span className="dropdown-link-copy">
                                            <span className="dropdown-link-title">{item.label}</span>
                                            <span className="dropdown-link-subtitle">{item.subtitle}</span>
                                        </span>
                                    </RouteLink>
                                ))}
                            </div>
                        )}
                    </div>
                    <div
                        className="pricing-menu"
                        ref={pricingMenuRef}
                        onMouseEnter={handlePricingHoverOpen}
                        onMouseLeave={handlePricingHoverClose}
                    >
                        <button
                            type="button"
                            className={`pricing-trigger ${isPricingActive ? 'active' : ''}`}
                            onClick={() => setIsPricingMenuOpen((open) => !open)}
                        >
                            Pricing <ChevronDown size={14} className={isPricingMenuOpen ? 'open' : ''} />
                        </button>
                        {isPricingMenuOpen && (
                            <div className="pricing-dropdown glass-card">
                                {pricingLinks.map((item) => (
                                    renderRichDropdownLink(
                                        item,
                                        pricingMenuMeta,
                                        BarChart3,
                                        `pricing-dropdown-link ${linkClassName(item.path)}`,
                                        () => setIsPricingMenuOpen(false)
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                    {contactLink && (
                        <RouteLink to={contactLink.path} className={linkClassName(contactLink.path)}>
                            {contactLink.label}
                        </RouteLink>
                    )}
                    <RouteLink
                        to={siteData.hero.primaryAction.path}
                        className="nav-cta"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Onboarding <ArrowUpRight size={16} />
                    </RouteLink>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => {
                        setIsMobileMenuOpen(!isMobileMenuOpen);
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
                        className={`mobile-pricing-trigger ${isServicesActive ? 'active' : ''}`}
                        onClick={() => {
                            setIsMobilePricingMenuOpen(false);
                            setIsMobileServicesMenuOpen((open) => !open);
                        }}
                    >
                        Services <ChevronDown size={14} className={isMobileServicesMenuOpen ? 'open' : ''} />
                    </button>
                    {isMobileServicesMenuOpen && (
                        <div className="mobile-pricing-links">
                            {serviceLinks.map((item) => (
                                <RouteLink
                                    key={item.key}
                                    to={item.path}
                                    className={`mobile-pricing-link-card ${linkClassName(item.path)}`}
                                    onClick={handleMobileClose}
                                >
                                    <span className="dropdown-link-icon">
                                        <item.Icon size={16} />
                                    </span>
                                    <span className="dropdown-link-copy">
                                        <span className="dropdown-link-title">{item.label}</span>
                                        <span className="dropdown-link-subtitle">{item.subtitle}</span>
                                    </span>
                                </RouteLink>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        className={`mobile-pricing-trigger ${isPricingActive ? 'active' : ''}`}
                        onClick={() => {
                            setIsMobileServicesMenuOpen(false);
                            setIsMobilePricingMenuOpen((open) => !open);
                        }}
                    >
                        Pricing <ChevronDown size={14} className={isMobilePricingMenuOpen ? 'open' : ''} />
                    </button>
                    {isMobilePricingMenuOpen && (
                        <div className="mobile-pricing-links">
                            {pricingLinks.map((item) =>
                                renderRichDropdownLink(
                                    item,
                                    pricingMenuMeta,
                                    BarChart3,
                                    `mobile-pricing-link-card ${linkClassName(item.path)}`,
                                    handleMobileClose
                                )
                            )}
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
                    <RouteLink
                        to={siteData.hero.primaryAction.path}
                        className="nav-cta"
                        onClick={handleMobileClose}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Onboarding
                    </RouteLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
