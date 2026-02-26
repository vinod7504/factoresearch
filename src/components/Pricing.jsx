import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RouteLink } from '../router';
import { siteData } from '../data/siteData';
import { sebiRiskDisclosure } from '../data/legalData';

const durations = [
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'halfyearly', label: 'Halfyearly' },
    { key: 'yearly', label: 'Yearly' },
];

const Pricing = ({ planSlug = 'stock-cash' }) => {
    const selectedPlan =
        siteData.pricingPlans.find((plan) => plan.slug === planSlug) || siteData.pricingPlans[0];

    return (
        <section id="pricing" className="section-padding bg-darker">
            <div className="container">
                <div className="pricing-plan-switch">
                    {siteData.pricingPlans.map((plan) => (
                        <RouteLink
                            key={plan.slug}
                            to={`/pricing/${plan.slug}`}
                            className={`plan-switch-btn ${selectedPlan.slug === plan.slug ? 'active' : ''}`}
                        >
                            {plan.menuLabel}
                        </RouteLink>
                    ))}
                </div>

                <h2 className="section-title pricing-main-title">{selectedPlan.title}</h2>

                <div className="pricing-columns-grid">
                    {durations.map((duration) => (
                        <article key={duration.key} className="pricing-column glass-card">
                            <h3>{duration.label}</h3>
                            <ul>
                                {selectedPlan.features.map((feature) => (
                                    <li key={`${duration.key}-${feature}`}>
                                        <CheckCircle2 size={16} className="check-icon" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="plan-price-badge">{selectedPlan.prices[duration.key]}</div>
                        </article>
                    ))}
                </div>

                <div className="pricing-action-row">
                    <RouteLink
                        to={siteData.hero.primaryAction.path}
                        className="btn-primary"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Start Onboarding
                    </RouteLink>
                    <a
                        className="btn-outline"
                        href={siteData.contact.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        WhatsApp Us
                    </a>
                </div>

                <article className="glass-card pricing-risk-disclosure">
                    <p>{sebiRiskDisclosure}</p>
                </article>
            </div>
        </section>
    );
};

export default Pricing;
