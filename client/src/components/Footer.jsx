import React from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';
import { RouteLink } from '../router';
import { navLinks } from '../routes';
import { siteData } from '../data/siteData';
import { legalLinks } from '../data/legalData';

const Footer = () => {
    const phoneHref = `tel:${(siteData.contact.phone || '').replace(/[^\d+]/g, '')}`;
    const emailHref = `mailto:${siteData.contact.email || ''}`;
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.contact.address || '')}`;

    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-info">
                        <div className="logo">
                            <img
                                src={siteData.brand.logoUrl}
                                alt={`${siteData.brand.name} Logo`}
                                className="logo-img"
                                style={{ height: '60px', marginBottom: '20px' }}
                            />
                        </div>
                        <div className="social-links">
                            <a href="#"><Twitter size={20} /></a>
                            <a href="#"><Instagram size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            {navLinks.map((item) => (
                                <li key={item.path}>
                                    <RouteLink to={item.path}>{item.label}</RouteLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            {legalLinks.map((item) => (
                                <li key={item.path}>
                                    <RouteLink to={item.path}>{item.label}</RouteLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Info</h4>
                        <div className="contact-item">
                            <Phone size={18} />
                            <a className="contact-link" href={phoneHref}>
                                {siteData.contact.phone}
                            </a>
                        </div>
                        <div className="contact-item">
                            <Mail size={18} />
                            <a className="contact-link" href={emailHref}>
                                {siteData.contact.email}
                            </a>
                        </div>
                        <div className="contact-item">
                            <MapPin size={18} />
                            <a className="contact-link" href={mapsHref} target="_blank" rel="noreferrer noopener">
                                {siteData.contact.address}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 {siteData.brand.name}. All rights reserved.</p>
                </div>

                <div className="footer-disclosure" style={{ marginTop: '18px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    <p>
                        {siteData.footer.disclosure}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
