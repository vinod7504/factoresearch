import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OnboardingPage from './pages/OnboardingPage';
import StockCashPricingPage from './pages/pricing/StockCashPricingPage';
import StockFuturePricingPage from './pages/pricing/StockFuturePricingPage';
import StockOptionPricingPage from './pages/pricing/StockOptionPricingPage';
import IndexFuturePricingPage from './pages/pricing/IndexFuturePricingPage';
import IndexOptionPricingPage from './pages/pricing/IndexOptionPricingPage';
import InvestmentServicesPricingPage from './pages/pricing/InvestmentServicesPricingPage';
import DisclaimerPage from './pages/legal/DisclaimerPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsConditionsPage from './pages/legal/TermsConditionsPage';
import MITCPage from './pages/legal/MITCPage';
import ReturnRefundPolicyPage from './pages/legal/ReturnRefundPolicyPage';
import GrievanceRedressalPage from './pages/legal/GrievanceRedressalPage';
import InvestorCharterPage from './pages/legal/InvestorCharterPage';
import ComplaintBoardPage from './pages/legal/ComplaintBoardPage';
import ComplianceAuditStatusPage from './pages/legal/ComplianceAuditStatusPage';

export const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact Us', path: '/contact' },
];

export const pricingLinks = [
    { label: 'Stock Cash', path: '/pricing/stock-cash' },
    { label: 'Stock Future', path: '/pricing/stock-future' },
    { label: 'Stock Option', path: '/pricing/stock-option' },
    { label: 'Index Future', path: '/pricing/index-future' },
    { label: 'Index Option', path: '/pricing/index-option' },
    { label: 'Investment Services', path: '/pricing/investment-services' },
];

export const routeComponents = {
    '/': HomePage,
    '/services': ServicesPage,
    '/pricing': PricingPage,
    '/pricing/stock-cash': StockCashPricingPage,
    '/pricing/stock-future': StockFuturePricingPage,
    '/pricing/stock-option': StockOptionPricingPage,
    '/pricing/index-future': IndexFuturePricingPage,
    '/pricing/index-option': IndexOptionPricingPage,
    '/pricing/investment-services': InvestmentServicesPricingPage,
    '/about': AboutPage,
    '/contact': ContactPage,
    '/onboarding': OnboardingPage,
    '/legal/disclaimer': DisclaimerPage,
    '/legal/privacy-policy': PrivacyPolicyPage,
    '/legal/terms-and-conditions': TermsConditionsPage,
    '/legal/mitc': MITCPage,
    '/legal/return-and-refund-policy': ReturnRefundPolicyPage,
    '/legal/grievance-redressal': GrievanceRedressalPage,
    '/legal/investor-charter': InvestorCharterPage,
    '/legal/complaint-board': ComplaintBoardPage,
    '/legal/compliance-audit-status': ComplianceAuditStatusPage,
};

export const routeTitles = {
    '/': 'FactoResearch',
    '/services': 'Services | FactoResearch',
    '/pricing': 'Pricing | FactoResearch',
    '/pricing/stock-cash': 'Stock Cash | FactoResearch',
    '/pricing/stock-future': 'Stock Future | FactoResearch',
    '/pricing/stock-option': 'Stock Option | FactoResearch',
    '/pricing/index-future': 'Index Future | FactoResearch',
    '/pricing/index-option': 'Index Option | FactoResearch',
    '/pricing/investment-services': 'Investment Services | FactoResearch',
    '/about': 'About Us | FactoResearch',
    '/contact': 'Contact Us | FactoResearch',
    '/onboarding': 'Onboarding | FactoResearch',
    '/legal/disclaimer': 'Disclaimer | FactoResearch',
    '/legal/privacy-policy': 'Privacy Policy | FactoResearch',
    '/legal/terms-and-conditions': 'Terms & Conditions | FactoResearch',
    '/legal/mitc': 'MITC | FactoResearch',
    '/legal/return-and-refund-policy': 'Refund Policy | FactoResearch',
    '/legal/grievance-redressal': 'Grievance Redressal | FactoResearch',
    '/legal/investor-charter': 'Investor Charter | FactoResearch',
    '/legal/complaint-board': 'Complaint Board | FactoResearch',
    '/legal/compliance-audit-status': 'Compliance Audit Status | FactoResearch',
};
