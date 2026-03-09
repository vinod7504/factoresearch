import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, ChevronDown, Check } from 'lucide-react';
import { useRouter } from '../useRouter';
import { siteData } from '../data/siteData';
import { submitContactForm } from '../utils/contactApi';

const SEBIModal = () => {
    const { navigate } = useRouter();
    const serviceOptions = siteData.services.categories.map((category) => category.title);
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
    const [isAdviceOpen, setIsAdviceOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interestedServices: [],
    });
    const [formStatus, setFormStatus] = useState('');
    const [formStatusType, setFormStatusType] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
    const serviceSelectRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsDisclaimerOpen(true), 1000);
        return () => clearTimeout(timer);
    }, []);

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

    const openAdviceModal = () => {
        setIsAdviceOpen(true);
        setFormStatus('');
        setFormStatusType('');
        setIsSubmitted(false);
        setIsServiceMenuOpen(false);
    };

    const handleAccept = () => {
        setIsDisclaimerOpen(false);
        openAdviceModal();
    };

    const handleCloseDisclaimer = () => {
        setIsDisclaimerOpen(false);
        openAdviceModal();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formStatus) {
            setFormStatus('');
            setFormStatusType('');
        }
    };

    const handleServiceToggle = (serviceOption) => {
        setFormData((prev) => ({
            ...prev,
            interestedServices: prev.interestedServices.includes(serviceOption)
                ? prev.interestedServices.filter((service) => service !== serviceOption)
                : [...prev.interestedServices, serviceOption],
        }));
        if (formStatus) {
            setFormStatus('');
            setFormStatusType('');
        }
    };

    const handleCloseAdvice = () => {
        setIsAdviceOpen(false);
        setIsServiceMenuOpen(false);
        setFormStatus('');
        setFormStatusType('');
        setIsSubmitted(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPhone = formData.phone.trim();
        const selectedServicesText = formData.interestedServices.join(', ');

        if (!trimmedName || !trimmedEmail || !trimmedPhone) {
            setFormStatus('Name, phone number, and email are required.');
            setFormStatusType('error');
            return;
        }

        setIsSubmitted(true);

        submitContactForm({
            formType: 'advice',
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            service: selectedServicesText,
            message: '',
            pageUrl: window.location.href,
        })
            .then(() => {
                setFormStatus('Thank you. We will contact you soon within 24 hours.');
                setFormStatusType('success');

                setTimeout(() => {
                    setIsAdviceOpen(false);
                    navigate('/');
                }, 1800);
            })
            .catch((error) => {
                setIsSubmitted(false);
                setFormStatus(error.message || 'Unable to submit enquiry right now.');
                setFormStatusType('error');
            });
    };

    const selectedServiceCount = formData.interestedServices.length;
    const selectedServiceLabel = selectedServiceCount === 0
        ? 'Interested Services (Optional)'
        : selectedServiceCount === 1
            ? formData.interestedServices[0]
            : `${selectedServiceCount} services selected`;

    return (
        <AnimatePresence>
            {isDisclaimerOpen && (
                <div className="modal-overlay">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="modal-content glass-card"
                    >
                        <div className="modal-header">
                            <ShieldAlert className="warning-icon" size={32} />
                            <h2>Regulatory Disclosure</h2>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={handleCloseDisclaimer}
                                aria-label="Close disclaimer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Facto Research is a SEBI Registered Research Analyst (Registration No: INH000024480).
                                Investment in securities market are subject to market risks. Read all the related documents
                                carefully before investing.
                            </p>
                            <p>
                                Registration granted by SEBI and certification from NISM in no way guarantee performance of
                                the intermediary or provide any assurance of returns to investors.
                            </p>
                            <div className="disclosure-box">
                                <strong>Important:</strong> We do not provide profit sharing services or guaranteed returns.
                                Beware of fraudsters using our name.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-primary full-width" onClick={handleAccept}>
                                I Understand & Accept
                            </button>
                        </div>
                    </Motion.div>
                </div>
            )}

            {isAdviceOpen && (
                <div className="modal-overlay">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="modal-content glass-card advice-modal-content"
                    >
                        <div className="modal-header advice-modal-header">
                            <div>
                                <h2>Get In Touch!</h2>
                                <p>Your Information will never be shared with any third party</p>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={handleCloseAdvice}
                                aria-label="Close advice form"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form className="advice-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name *"
                                required
                                disabled={isSubmitted}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email *"
                                required
                                disabled={isSubmitted}
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Mobile Number *"
                                required
                                disabled={isSubmitted}
                            />
                            <div className="advice-form-field">
                                <div className="advice-select" ref={serviceSelectRef}>
                                    <button
                                        type="button"
                                        className={`advice-select-trigger${isServiceMenuOpen ? ' open' : ''}`}
                                        onClick={() => {
                                            if (isSubmitted) return;
                                            setIsServiceMenuOpen((open) => !open);
                                        }}
                                        aria-haspopup="listbox"
                                        aria-expanded={isServiceMenuOpen}
                                        disabled={isSubmitted}
                                    >
                                        <span className={selectedServiceCount === 0 ? 'advice-select-placeholder' : ''}>
                                            {selectedServiceLabel}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`advice-select-chevron${isServiceMenuOpen ? ' open' : ''}`}
                                        />
                                    </button>
                                    {isServiceMenuOpen && (
                                        <div className="advice-select-menu" role="listbox" aria-multiselectable="true">
                                            {serviceOptions.map((serviceOption) => (
                                                <button
                                                    key={serviceOption}
                                                    type="button"
                                                    className={`advice-select-option${
                                                        formData.interestedServices.includes(serviceOption) ? ' selected' : ''
                                                    }`}
                                                    onClick={() => handleServiceToggle(serviceOption)}
                                                    role="option"
                                                    aria-selected={formData.interestedServices.includes(serviceOption)}
                                                >
                                                    <span>{serviceOption}</span>
                                                    {formData.interestedServices.includes(serviceOption) && (
                                                        <Check size={14} className="advice-select-check" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {selectedServiceCount > 0 && (
                                    <div className="advice-selected-tags">
                                        {formData.interestedServices.map((serviceOption) => (
                                            <span key={serviceOption} className="advice-selected-tag">
                                                {serviceOption}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="btn-primary advice-submit-btn" type="submit" disabled={isSubmitted}>
                                {isSubmitted ? 'Submitting...' : 'Send enquiry'}
                            </button>
                            {formStatus && (
                                <p
                                    className={`advice-form-status${
                                        formStatusType ? ` advice-form-status-${formStatusType}` : ''
                                    }`}
                                >
                                    {formStatus}
                                </p>
                            )}
                        </form>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SEBIModal;
