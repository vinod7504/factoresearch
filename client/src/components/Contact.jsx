import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { siteData } from '../data/siteData';
import { submitContactForm } from '../utils/contactApi';
import WhatsAppBrandIcon from './WhatsAppBrandIcon';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
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
                service: '',
                message: trimmedMessage,
                pageUrl: window.location.href,
            });
            setFormStatus('Thank you. Your enquiry was sent successfully.');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
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
                    <h2 className="section-title">
                        Contact <span className="gradient-text">Facto Research</span>
                    </h2>
                    <p className="section-subtitle">
                        Please contact us directly with questions, comments, or scheduling inquiries.
                    </p>
                </div>
                <div className="contact-main-wrapper contact-form-only glass-card">
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
                                    placeholder="+91"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group-v3">
                                <label>Message</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your enqiry in detail..."
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="contact-form-actions">
                                <Motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary luxury-submit"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Submit Enquiry'} <ArrowRight size={18} />
                                </Motion.button>
                                <a
                                    className="contact-whatsapp-btn whatsapp-action-btn"
                                    href={siteData.contact.whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    <WhatsAppBrandIcon size={17} />
                                    <span>Message us on WhatsApp</span>
                                </a>
                            </div>
                            {formStatus && <p className="contact-form-status">{formStatus}</p>}
                        </form>
                        {/* <div className="contact-trust-row"> */}
                            {/* <span className="contact-trust-pill">SEBI Registered RA</span> */}
                            {/* <span className="contact-trust-pill">Dedicated Human Support</span> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
