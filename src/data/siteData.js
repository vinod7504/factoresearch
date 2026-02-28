const defaultContact = {
    phone: '+91 99599 37373',
    email: 'support@factoresearch.com',
    address: 'D.No.7, SNO.432/4 Plot No.6, Opp JNTU College, KM Colony, Anantapur, Andhra Pradesh-515002.',
    whatsappUrl: 'https://api.whatsapp.com/send/?phone=919959937373&text&type=phone_number&app_absent=0',
};

const envContact = {
    phone: import.meta.env.VITE_SUPPORT_PHONE || defaultContact.phone,
    email: import.meta.env.VITE_SUPPORT_EMAIL || defaultContact.email,
    address: import.meta.env.VITE_REGISTERED_ADDRESS || defaultContact.address,
    whatsappUrl: import.meta.env.VITE_WHATSAPP_URL || defaultContact.whatsappUrl,
};

const ONBOARDING_URL =
    import.meta.env.VITE_ONBOARDING_URL || 'https://onboarding.cognifyai.in/Facto/';

export const siteData = {
    brand: {
        name: 'Facto Research',
        logoUrl:
            'https://img1.wsimg.com/isteam/ip/890c2873-45ef-40f0-a650-7817ddb60ef4/Untitled%20(512%20x%20512%20px).png/:/rs=w:178,h:178,cg:true,m/cr=w:178,h:178/qt=q:95',
    },
    hero: {
        badge: 'A Decade of Market Mastery',
        title: 'Research Built on Data\nReports Built on Facts.',
        description:
            "Facto Research is led by a veteran Research Analyst with over 10 years of deep-market experience. We help investors navigate Indian financial markets with clarity, confidence, and consistency.",
        primaryAction: { label: 'Onboarding', path: ONBOARDING_URL },
        secondaryAction: { label: 'About Facto Research', path: '/about' },
        stats: [
            { value: '10+', label: 'Years of Experience' },
            { value: 'SEBI', label: 'Reg. No. INH000024480' },
        ],
    },
    about: {
        title: 'About Facto Research',
        decadeTitle: 'A Decade of Market Mastery',
        decadeParagraphs: [
            'Facto Research is led by a veteran Research Analyst with over 10 years of deep-market experience in Indian equities.',
            'A decade in the markets provides a perspective that charts alone cannot show. It brings the wisdom of having navigated diverse market cycles, economic shifts, and structural reforms.',
            "At Facto Research, we believe successful investing is not about following the noise. It is about following the facts. We provide institutional-grade market intelligence to help investors navigate the complexities of Indian financial markets with clarity and confidence.",
        ],
        sebiTitle: 'Institutional Grade. SEBI Registered.',
        sebiParagraph:
            'We are a SEBI Registered Research Analyst firm (Registration No. INH000024480). Our foundation is built on the twin pillars of unmatched experience and regulatory excellence. We bring sophisticated research techniques used by institutional desks to the discerning individual investor.',
        philosophyTitle: 'The Facto Philosophy: "Truth Through Data"',
        philosophyIntro:
            'In a decade of research, we have learned that prices fluctuate, but facts eventually prevail. Our "Facto" methodology is a proprietary research framework refined over 10 years to:',
        philosophyPoints: [
            {
                title: 'Forensic Analysis',
                description: 'Going beyond the P&L statement to understand the true quality of earnings and management integrity.',
            },
            {
                title: 'Identify Structural Winners',
                description: 'Spotting companies that can grow consistently over 3, 5, and 10-year horizons.',
            },
            {
                title: 'Risk Mitigation',
                description: 'Using a decade of historical data to avoid value traps and speculative bubbles.',
            },
        ],
    },
    services: {
        title: 'Our Research Services',
        categories: [
            {
                title: 'Equity Research & Stock Recommendations',
                points: ['Entry/Exit levels', 'Target/SL price', 'Time horizon & risk level', 'Research rationale'],
            },
            {
                title: 'Fundamental Research Reports',
                points: ['Business model', 'Financial performance', 'Valuation metrics', 'Industry outlook'],
            },
            {
                title: 'Technical Analysis, Market Trends & Live Index Tracking',
                points: [
                    'Live tracking of SENSEX & NIFTY',
                    'Short term trends',
                    'Chart patterns',
                    'Indicators & momentum studies',
                    'Support & resistance levels',
                ],
            },
            {
                title: 'Portfolio Baskets',
                points: [
                    'Research rationale for each stock',
                    'Entry range & outlook (indicative)',
                    'Portfolio allocation logic',
                    'Periodic review updates',
                    'Performance tracking',
                ],
            },
            {
                title: 'Thematic & Sectoral Research',
                points: ['Banking & financials', 'PSU stocks', 'Emerging sectors', 'Market trends & cycles', 'Risk disclosure & suitability note'],
            },
            {
                title: 'Educational Content & Market Learning',
                points: [
                    'Stock market courses',
                    'Webinars / seminars',
                    'Research methodology training',
                    'Workshops on analysis tools',
                    'Investing & trading discipline',
                ],
            },
        ],
    },
    pricingPlans: [
        {
            slug: 'stock-cash',
            menuLabel: 'Stock Cash',
            title: 'Stock Cash Premium',
            prices: { quarterly: '50000', halfyearly: '75000', yearly: '115000' },
            features: [
                'Daily Recommendations',
                'Market Analysis Reports',
                'Entry and Exit levels',
                'Target & Stop loss Support',
                'WhatsApp/SMS alerts',
                '24/7 customer support',
            ],
        },
        {
            slug: 'stock-future',
            menuLabel: 'Stock Future',
            title: 'Stock Future Premium',
            prices: { quarterly: '75000', halfyearly: '125000', yearly: '150000' },
            features: [
                'Stock futures setups',
                'Trend and momentum analysis',
                'Risk management logic',
                'Daily strategy updates',
                'WhatsApp support',
                'Research desk access',
            ],
        },
        {
            slug: 'stock-option',
            menuLabel: 'Stock Option',
            title: 'Stock Option Premium',
            prices: { quarterly: '75000', halfyearly: '125000', yearly: '150000' },
            features: [
                'Option strategy recommendations',
                'Strike selection guidance',
                'Volatility and momentum studies',
                'Hedged risk framework',
                'Expiry-focused updates',
                'Priority support',
            ],
        },
        {
            slug: 'index-future',
            menuLabel: 'Index Future',
            title: 'Index Future Premium',
            prices: { quarterly: '75000', halfyearly: '125000', yearly: '150000' },
            features: [
                'Index futures recommendations',
                'Nifty and Bank Nifty focus',
                'Short-term and swing setups',
                'Support and resistance levels',
                'Live market support',
                'Risk-first execution plan',
            ],
        },
        {
            slug: 'index-option',
            menuLabel: 'Index Option',
            title: 'Index Option Premium',
            prices: { quarterly: '75000', halfyearly: '125000', yearly: '150000' },
            features: [
                'Index option strategies',
                'Hedging and adjustment plans',
                'Expiry trend analytics',
                'Position sizing guidance',
                'WhatsApp/SMS alerts',
                'Dedicated support',
            ],
        },
        {
            slug: 'investment-services',
            menuLabel: 'Investment Services',
            title: 'Investment Services',
            prices: { quarterly: 'Custom', halfyearly: 'Custom', yearly: 'Custom' },
            features: [
                'Portfolio guidance',
                'Research-backed allocation ideas',
                'Thematic and sectoral insights',
                'Risk and suitability mapping',
                'Periodic review support',
                'Consultative onboarding',
            ],
        },
    ],
    values: {
        heading: 'Our Values',
        statement:
            'Decisions based on facts, not hearsay. In an era of information overload, we act as a filter.',
        explanation:
            'We combine rigorous fundamental analysis with quantitative data to separate market hype from actual value.',
    },
    mission: {
        heading: 'Our Mission',
        statement:
            'To democratize high-quality equity research and empower our clients with the same level of insight typically reserved for institutional investors. Creating wealth with market research is our profession.',
    },
    vision: {
        heading: 'Our Vision',
        statement:
            'To be the most trusted name in independent equity research in India, where every recommendation is backed by a decade of expertise and a commitment to the absolute facts.',
    },
    team: {
        heading: 'We Belive In Team Work',
        members: [
            {
                role: 'Cheif Research Ananlyst',
                description:
                    'A SEBI-registered Research Analyst with a decade of expertise in equity research. Fundamental and technical analysis to deliver comprehensive market insights.',
            },
            {
                role: 'Pro Research Team',
                description:
                    'Our team of specialized market analysts provides comprehensive, data-driven research across every market segment.',
            },
            {
                role: 'Client support',
                description:
                    'Our dedicated support team ensures seamless service and rapid resolution of all client inquiries and requirements.',
            },
        ],
    },
    contact: {
        phone: envContact.phone,
        whatsapp: envContact.phone,
        whatsappUrl: envContact.whatsappUrl,
        email: envContact.email,
        address: envContact.address,
        intro: 'Please contact us directly with questions, comments, or scheduling inquiries.',
        social: ['Twitter', 'LinkedIn', 'Instagram', 'WhatsApp'],
    },
    footer: {
        disclosure:
            'SEBI Investment Risk Disclosure: Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. Please read the Risk Disclosure Document prescribed by SEBI & exchange before investing.',
    },
};
