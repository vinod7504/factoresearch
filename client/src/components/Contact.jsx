import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, MessageSquare } from 'lucide-react';
import { siteData } from '../data/siteData';
import { submitContactForm } from '../utils/contactApi';

const Contact = () => {
    const serviceOptions = siteData.services.categories.map((category) => category.title);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        service: siteData.services.categories[0]?.title || '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
    const serviceSelectRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (serviceSelectRef.current && !serviceSelectRef.current.contains(event.target)) {
                setIsServiceMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, []);

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

    const handleServiceSelect = (serviceOption) => {
        setFormData((prev) => ({
            ...prev,
            service: serviceOption,
        }));
        setIsServiceMenuOpen(false);
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
            setIsServiceMenuOpen(false);
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
                <div className={`contact-main-wrapper contact-form-only glass-card${isServiceMenuOpen ? ' service-menu-open' : ''}`}>
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
                                <label>Service Interested In</label>
                                <div className="contact-service-select" ref={serviceSelectRef}>
                                    <button
                                        type="button"
                                        className={`contact-service-trigger${isServiceMenuOpen ? ' open' : ''}`}
                                        onClick={() => {
                                            if (isSubmitting) return;
                                            setIsServiceMenuOpen((open) => !open);
                                        }}
                                        aria-haspopup="listbox"
                                        aria-expanded={isServiceMenuOpen}
                                        disabled={isSubmitting}
                                    >
                                        <span>{formData.service}</span>
                                        <ChevronDown size={16} className={isServiceMenuOpen ? 'open' : ''} />
                                    </button>
                                    {isServiceMenuOpen && (
                                        <div className="contact-service-menu" role="listbox">
                                            {serviceOptions.map((serviceOption) => (
                                                <button
                                                    key={serviceOption}
                                                    type="button"
                                                    className={`contact-service-option${
                                                        formData.service === serviceOption ? ' selected' : ''
                                                    }`}
                                                    onClick={() => handleServiceSelect(serviceOption)}
                                                    role="option"
                                                    aria-selected={formData.service === serviceOption}
                                                >
                                                    <span>{serviceOption}</span>
                                                    {formData.service === serviceOption && (
                                                        <Check size={14} className="contact-service-check" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
