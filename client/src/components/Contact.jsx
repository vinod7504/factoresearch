import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { siteData } from '../data/siteData';
import { submitContactForm } from '../utils/contactApi';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        service: siteData.services.categories[0]?.title || '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formStatus) {
            setFormStatus('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = formData.fullName.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPhone = formData.phone.trim();
        const trimmedMessage = formData.message.trim();

        if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
            setFormStatus('Please fill all required fields before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            await submitContactForm({
                formType: 'contact',
                name: trimmedName,
                email: trimmedEmail,
                phone: trimmedPhone,
                service: formData.service,
                message: trimmedMessage,
                pageUrl: window.location.href,
            });
            setFormStatus('Thank you. Your enquiry was sent successfully.');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                service: siteData.services.categories[0]?.title || '',
                message: '',
            });
        } catch (error) {
            setFormStatus(error.message || 'Unable to send message right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <form className="luxury-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group-v3">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group-v3">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your email"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-group-v3">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 99599 37373"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group-v3">
                                <label>Service Interested In</label>
                                <select
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                >
                                    {siteData.services.categories.map((category) => (
                                        <option key={category.title} value={category.title}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group-v3">
                                <label>Message</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <Motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary luxury-submit"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Submit Enquiry'} <ArrowRight size={18} />
                            </Motion.button>
                            {formStatus && <p className="contact-form-status">{formStatus}</p>}
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
