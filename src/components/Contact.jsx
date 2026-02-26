import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { siteData } from '../data/siteData';

const Contact = () => {
    return (
        <section id="contact" className="contact-section-v3 section-padding">
            <div className="container">
                <div className="contact-header-v3">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="contact-badge"
                    >
                        <MessageSquare size={14} /> <span>Direct Communication</span>
                    </Motion.div>
                    <h2 className="section-title">Contact <span className="gradient-text">Facto Research</span></h2>
                    <p className="section-subtitle">
                        {siteData.contact.intro}
                    </p>
                </div>

                <div className="contact-main-wrapper glass-card">
                    <div className="contact-info-panel">
                        <div className="contact-hero-visual">
                            <img
                                src="/images/contact/support-analyst.svg"
                                alt="Facto Research analyst support illustration"
                            />
                        </div>
                        <h3 className="panel-title">Contact Information</h3>
                        <p className="panel-desc">Reach us by phone, email, or office visit.</p>

                        <div className="info-items-v3">
                            <div className="info-item-v3">
                                <div className="icon-box-v3">
                                    <Phone size={20} />
                                </div>
                                <div className="info-text-v3">
                                    <span>Call or WhatsApp</span>
                                    <p>{siteData.contact.phone}</p>
                                    <a
                                        className="whatsapp-contact-btn"
                                        href={siteData.contact.whatsappUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="info-item-v3">
                                <div className="icon-box-v3">
                                    <Mail size={20} />
                                </div>
                                <div className="info-text-v3">
                                    <span>Email Address</span>
                                    <p>{siteData.contact.email}</p>
                                </div>
                            </div>

                            <div className="info-item-v3">
                                <div className="icon-box-v3">
                                    <MapPin size={20} />
                                </div>
                                <div className="info-text-v3">
                                    <span>Registered Office</span>
                                    <p>{siteData.contact.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="social-minimal-v3">
                            {siteData.contact.social.map((item) => (
                                <div key={item} className="social-pill">{item}</div>
                            ))}
                        </div>

                        <div className="info-bg-glow"></div>
                    </div>

                    <div className="contact-form-panel">
                        <div className="contact-form-head">
                            <h3>Send Your Requirement</h3>
                            <p>Our onboarding team responds within one business day.</p>
                        </div>
                        <form className="luxury-form">
                            <div className="form-row">
                                <div className="form-group-v3">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Your name" />
                                </div>
                                <div className="form-group-v3">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="Your email" />
                                </div>
                            </div>
                            <div className="form-group-v3">
                                <label>Phone Number</label>
                                <input type="text" placeholder="+91 99599 37373" />
                            </div>
                            <div className="form-group-v3">
                                <label>Service Interested In</label>
                                <select>
                                    {siteData.services.categories.map((category) => (
                                        <option key={category.title}>{category.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group-v3">
                                <label>Message</label>
                                <textarea rows="4" placeholder="How can we help you?" />
                            </div>
                            <Motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary luxury-submit"
                                type="button"
                            >
                                Submit Enquiry <ArrowRight size={18} />
                            </Motion.button>
                        </form>
                        <div className="contact-trust-row">
                            <span className="contact-trust-pill">SEBI Registered RA</span>
                            <span className="contact-trust-pill">Dedicated Human Support</span>
                            <span className="contact-trust-pill">Privacy First Communication</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
