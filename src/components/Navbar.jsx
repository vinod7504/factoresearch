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
    ShieldAlert,
    ShieldCheck,
    Award,
    MessageSquare,
    Eye,
    CheckCircle2,
} from 'lucide-react';
import { RouteLink } from '../router';
import { useRouter } from '../useRouter';
import { navLinks, pricingLinks } from '../routes';
import { siteData } from '../data/siteData';
import { legalLinks } from '../data/legalData';

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

const legalMenuMeta = {
    '/legal/disclaimer': {
        Icon: ShieldAlert,
        subtitle: 'Important market risk and service limitation disclosures.',
    },
    '/legal/mitc': {
        Icon: ShieldCheck,
        subtitle: 'Most Important Terms and Conditions for research services.',
    },
    '/legal/privacy-policy': {
        Icon: ShieldCheck,
        subtitle: 'How your personal data is handled and protected by us.',
    },
    '/legal/terms-and-conditions': {
        Icon: Award,
        subtitle: 'Terms governing access and usage of our services.',
    },
    '/legal/return-and-refund-policy': {
        Icon: Target,
        subtitle: 'No refund/No cancellation/Policy for subscriptions.',
    },
    '/legal/grievance-redressal': {
        Icon: MessageSquare,
        subtitle: 'Steps to raise complaints and resolution timelines.',
    },
    '/legal/investor-charter': {
        Icon: Eye,
        subtitle: 'Investor rights, responsibilities, and service standards.',
    },
    '/legal/complaint-board': {
        Icon: Activity,
        subtitle: 'Complaint statistics and disclosures in a transparent format.',
    },
    '/legal/compliance-audit-status': {
        Icon: CheckCircle2,
        subtitle: 'Current compliance and audit status as per regulations.',
    },
};

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
    const pricingCloseTimerRef = useRef(null);
    const legalCloseTimerRef = useRef(null);

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

    useEffect(() => {
        return () => {
            if (pricingCloseTimerRef.current) {
                clearTimeout(pricingCloseTimerRef.current);
            }
            if (legalCloseTimerRef.current) {
                clearTimeout(legalCloseTimerRef.current);
            }
        };
    }, []);

    const linkClassName = (targetPath) => (path === targetPath ? 'active' : '');
    const isPricingActive = path === '/pricing' || path.startsWith('/pricing/');
    const isLegalActive = legalLinks.some((item) => item.path === path);
    const primaryNavLinks = navLinks.filter((item) => item.path !== '/pricing' && item.path !== '/contact');
    const contactLink = navLinks.find((item) => item.path === '/contact');

    const handlePricingHoverOpen = () => {
        if (pricingCloseTimerRef.current) clearTimeout(pricingCloseTimerRef.current);
        setIsLegalMenuOpen(false);
        setIsPricingMenuOpen(true);
    };

    const handlePricingHoverClose = () => {
        pricingCloseTimerRef.current = setTimeout(() => {
            setIsPricingMenuOpen(false);
        }, 120);
    };

    const handleLegalHoverOpen = () => {
        if (legalCloseTimerRef.current) clearTimeout(legalCloseTimerRef.current);
        setIsPricingMenuOpen(false);
        setIsLegalMenuOpen(true);
    };

    const handleLegalHoverClose = () => {
        legalCloseTimerRef.current = setTimeout(() => {
            setIsLegalMenuOpen(false);
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
                    <div
                        className="pricing-menu"
                        ref={pricingMenuRef}
                        onMouseEnter={handlePricingHoverOpen}
                        onMouseLeave={handlePricingHoverClose}
                    >
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
                    <div
                        className="legal-menu"
                        ref={legalMenuRef}
                        onMouseEnter={handleLegalHoverOpen}
                        onMouseLeave={handleLegalHoverClose}
                    >
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
                                    renderRichDropdownLink(
                                        item,
                                        legalMenuMeta,
                                        ShieldCheck,
                                        `legal-dropdown-link ${linkClassName(item.path)}`,
                                        () => setIsLegalMenuOpen(false)
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
                            {legalLinks.map((item) =>
                                renderRichDropdownLink(
                                    item,
                                    legalMenuMeta,
                                    ShieldCheck,
                                    `mobile-legal-link-card ${linkClassName(item.path)}`,
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
