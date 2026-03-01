import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const SEBIModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
        </AnimatePresence>
    );
};

export default SEBIModal;
