import React from 'react';

class HeroMarketErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        // Keep logs in devtools without crashing the full hero section.
        console.error('HeroMarketPanel crashed:', error);
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <section className="hero-market-stack" aria-label="Live market panel fallback">
                <article className="hero-market-card hero-market-card--single glass-card">
                    <div className="hero-market-header">
                        <span className="hero-market-name">Live Market Panel</span>
                    </div>
                    <p className="hero-market-note">
                        Live market panel is temporarily unavailable. Please refresh the page.
                    </p>
                </article>
            </section>
        );
    }
}

export default HeroMarketErrorBoundary;
