import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { useRouter } from '../useRouter';
import { submitContactForm } from '../utils/contactApi';

const SEBIModal = () => {
    const { navigate } = useRouter();
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
    const [isAdviceOpen, setIsAdviceOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState('');
    const [formStatusType, setFormStatusType] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsDisclaimerOpen(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        setIsDisclaimerOpen(false);
        setIsAdviceOpen(true);
        setFormStatus('');
        setFormStatusType('');
        setIsSubmitted(false);
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

    const handleCloseAdvice = () => {
        setIsAdviceOpen(false);
        setFormStatus('');
        setFormStatusType('');
        setIsSubmitted(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPhone = formData.phone.trim();
        const trimmedMessage = formData.message.trim();

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
            message: trimmedMessage,
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
                setFormStatus(error.message || 'Unable to send message right now.');
                setFormStatusType('error');
            });
    };

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
                                onClick={() => setIsDisclaimerOpen(false)}
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
                                <h2>Get An Advice!</h2>
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
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Message (Optional)"
                                rows="4"
                                disabled={isSubmitted}
                            />
                            <button className="btn-primary advice-submit-btn" type="submit" disabled={isSubmitted}>
                                {isSubmitted ? 'Submitting...' : 'Send message'}
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
