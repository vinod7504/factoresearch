import React from 'react';
import { RouteLink } from '../router';

const NotFoundPage = () => {
    return (
        <section className="inner-page not-found section-padding">
            <div className="container not-found-content glass-card">
                <p className="page-header-eyebrow">404</p>
                <h1 className="page-header-title">Page Not <span className="gradient-text">Found</span></h1>
                <p className="page-header-subtitle">
                    The route you requested does not exist. Go back to the homepage and continue browsing.
                </p>
                <RouteLink to="/" className="btn-primary">Back to Home</RouteLink>
            </div>
        </section>
    );
};

export default NotFoundPage;
