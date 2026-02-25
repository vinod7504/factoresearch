import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { siteData } from '../data/siteData';

const FloatingChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const buildWhatsappUrl = () => {
        const textLines = [
            'Hello Facto Research Team,',
            name ? `Name: ${name}` : null,
            email ? `Email: ${email}` : null,
            `Message: ${message || 'I would like to know more about your services.'}`,
        ].filter(Boolean);

        const encodedText = encodeURIComponent(textLines.join('\n'));
        return `https://api.whatsapp.com/send/?phone=919959937373&text=${encodedText}&type=phone_number&app_absent=0`;
    };

    const handleSend = (event) => {
        event.preventDefault();
        window.open(buildWhatsappUrl(), '_blank', 'noopener,noreferrer');
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
                    <div className="chat-bubble">hello</div>

                    <form className="chat-panel-form" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <textarea
                            placeholder="Type your message"
                            rows="3"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                        />
                        <button type="submit" className="btn-primary chat-send-btn">
                            Send <Send size={15} />
                        </button>
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
