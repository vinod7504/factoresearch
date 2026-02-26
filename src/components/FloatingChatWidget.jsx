import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { siteData } from '../data/siteData';

const FloatingChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSend = (event) => {
        event.preventDefault();
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            setStatus('Please fill name, email, and message.');
            return;
        }

        const subject = `Chat Enquiry - ${trimmedName}`;
        const body = [
            'New enquiry from floating contact widget:',
            '',
            `Name: ${trimmedName}`,
            `Email: ${trimmedEmail}`,
            `Message: ${trimmedMessage}`,
            `Page: ${window.location.href}`,
        ].join('\n');

        const recipient = siteData.contact.email || 'support@factoresearch.com';
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        setStatus('Email draft opened. Please click send in your mail app.');
    };

    return (
        <div className="floating-chat-widget">
            {isOpen && (
                <div className="chat-panel glass-card">
                    <div className="chat-panel-header">
                        <h4>Contact Us</h4>
                        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
                            <X size={18} />
                        </button>
                    </div>
                    <p className="chat-panel-subtitle">We&apos;ll respond as soon as we can.</p>
                    <div className="chat-bubble">Tell us your requirement.</div>

                    <form className="chat-panel-form" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Type your message"
                            rows="3"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            required
                        />
                        <button type="submit" className="btn-primary chat-send-btn">
                            Send Email <Send size={15} />
                        </button>
                        {status && <p className="chat-form-status">{status}</p>}
                    </form>

                    <a
                        href={siteData.contact.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="chat-whatsapp-link"
                    >
                        Open WhatsApp Directly
                    </a>
                </div>
            )}

            <button
                type="button"
                className="chat-fab"
                onClick={() => setIsOpen((open) => !open)}
                aria-label="Open contact chat"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>
        </div>
    );
};

export default FloatingChatWidget;
