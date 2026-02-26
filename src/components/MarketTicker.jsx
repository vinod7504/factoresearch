import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const REFRESH_INTERVAL_MS = 120000;
const REQUEST_TIMEOUT_MS = 8500;
const CACHE_TTL_MS = 60000;
const RATE_LIMIT_BACKOFF_MS = 5 * 60 * 1000;

const MARKET_INDEXES = [
    { label: 'SENSEX', symbols: ['^BSESN'], logo: '/images/market/bse.svg' },
    { label: 'NIFTY 50', symbols: ['^NSEI'], logo: '/images/market/nse.svg' },
    { label: 'BANKNIFTY', symbols: ['^NSEBANK'], logo: '/images/market/nse.svg' },
    { label: 'FINNIFTY', symbols: ['^CNXFIN'], logo: '/images/market/nse.svg' },
    { label: 'NIFTY 100', symbols: ['^CNX100'], logo: '/images/market/nse.svg' },
    { label: 'NIFTY MIDCAP 50', symbols: ['^NSEMDCP50'], logo: '/images/market/nse.svg' },
    { label: 'NIFTY IT', symbols: ['^CNXIT'], logo: '/images/market/nse.svg' },
];

const marketPayloadCache = {
    payload: null,
    timestamp: 0,
    inflight: null,
    backoffUntil: 0,
};

const emptyQuote = (index) => ({
    ...index,
    price: null,
    change: null,
    changePercent: null,
});

const toFiniteNumber = (value) => {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const formatSigned = (value) => {
    if (typeof value !== 'number') return '--';
    const formatted = Math.abs(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${value >= 0 ? '+' : '-'}${formatted}`;
};

const formatPrice = (value) => {
    if (typeof value !== 'number') return '--';
    return `₹${value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const fetchJsonWithTimeout = async (url) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            cache: 'no-store',
            signal: controller.signal,
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            const error = new Error(`Ticker fetch failed with status ${response.status}`);
            error.status = response.status;
            throw error;
        }
        const text = await response.text();
        return JSON.parse(text);
    } finally {
        clearTimeout(timeoutId);
    }
};

const buildEndpoints = (symbolsQuery) => {
    const queryOne = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsQuery}`;
    const queryTwo = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbolsQuery}`;

    return [
        `/api/market?symbols=${symbolsQuery}`,
        `/api/market-alt?symbols=${symbolsQuery}`,
        queryOne,
        queryTwo,
    ];
};

const hasValidPayload = (payload) => Array.isArray(payload?.quoteResponse?.result);

const fetchPayloadWithCache = async (endpoints) => {
    const now = Date.now();

    if (marketPayloadCache.payload && now - marketPayloadCache.timestamp < CACHE_TTL_MS) {
        return marketPayloadCache.payload;
    }

    if (marketPayloadCache.inflight) {
        return marketPayloadCache.inflight;
    }

    if (marketPayloadCache.backoffUntil > now) {
        if (marketPayloadCache.payload) return marketPayloadCache.payload;

        const backoffError = new Error('Ticker request backoff active.');
        backoffError.status = 429;
        throw backoffError;
    }

    marketPayloadCache.inflight = (async () => {
        let payload = null;
        let sawRateLimit = false;

        for (const endpoint of endpoints) {
            try {
                payload = await fetchJsonWithTimeout(endpoint);
                if (hasValidPayload(payload)) break;
            } catch (error) {
                if (error?.status === 429) sawRateLimit = true;
                payload = null;
            }
        }

        if (!hasValidPayload(payload)) {
            if (sawRateLimit) {
                marketPayloadCache.backoffUntil = Date.now() + RATE_LIMIT_BACKOFF_MS;
            }
            throw new Error('No market payload available.');
        }

        marketPayloadCache.payload = payload;
        marketPayloadCache.timestamp = Date.now();
        marketPayloadCache.backoffUntil = 0;
        return payload;
    })();

    try {
        return await marketPayloadCache.inflight;
    } finally {
        marketPayloadCache.inflight = null;
    }
};

const MarketTicker = () => {
    const [quotes, setQuotes] = useState(() => MARKET_INDEXES.map(emptyQuote));
    const [isLiveFeed, setIsLiveFeed] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const symbols = MARKET_INDEXES.flatMap((item) => item.symbols);
        const symbolsQuery = encodeURIComponent(symbols.join(','));
        const endpoints = buildEndpoints(symbolsQuery);

        const fetchQuotes = async () => {
            try {
                const payload = await fetchPayloadWithCache(endpoints);
                if (!isMounted) return;

                const results = Array.isArray(payload.quoteResponse.result) ? payload.quoteResponse.result : [];
                const quoteMap = new Map(results.map((item) => [item.symbol, item]));

                const mappedQuotes = MARKET_INDEXES.map((index) => {
                    const quote = index.symbols.map((symbol) => quoteMap.get(symbol)).find(Boolean);
                    return {
                        ...index,
                        price: toFiniteNumber(quote?.regularMarketPrice),
                        change: toFiniteNumber(quote?.regularMarketChange),
                        changePercent: toFiniteNumber(quote?.regularMarketChangePercent),
                    };
                });

                const liveCount = mappedQuotes.filter((item) => typeof item.price === 'number').length;
                setQuotes(mappedQuotes);
                setIsLiveFeed(liveCount >= 4);
                setHasError(liveCount === 0);
            } catch {
                if (!isMounted) return;
                setIsLiveFeed(false);
                setHasError(true);
            }
        };

        fetchQuotes();
        const intervalId = setInterval(fetchQuotes, REFRESH_INTERVAL_MS);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <section className="market-ticker" aria-label="Live market values">
            <div className="ticker-shell">
                <div className={`ticker-status ${isLiveFeed ? 'live' : 'offline'}`}>
                    <span className="ticker-dot" />
                    {isLiveFeed ? 'Live NSE/BSE' : 'Feed reconnecting'}
                </div>

                <div className="ticker-marquee" role="status" aria-live="polite">
                    <div className="ticker-track">
                        {[0, 1].map((copyIndex) => (
                            <div className="ticker-group" key={copyIndex}>
                                {quotes.map((quote) => {
                                    const isUp = typeof quote.change === 'number' && quote.change > 0;
                                    const isDown = typeof quote.change === 'number' && quote.change < 0;
                                    const trendClass = isUp ? 'up' : isDown ? 'down' : 'flat';

                                    return (
                                        <div className="ticker-item" key={`${copyIndex}-${quote.label}`}>
                                            <img src={quote.logo} alt={`${quote.label} exchange logo`} className="ticker-logo" />
                                            <span className="ticker-symbol">{quote.label}</span>
                                            <span className="ticker-price">{formatPrice(quote.price)}</span>
                                            <span className={`ticker-change ${trendClass}`}>
                                                {isUp && <TrendingUp size={12} />}
                                                {isDown && <TrendingDown size={12} />}
                                                {typeof quote.change === 'number' && typeof quote.changePercent === 'number'
                                                    ? `${formatSigned(quote.change)} (${formatSigned(quote.changePercent)}%)`
                                                    : '--'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {hasError && <p className="ticker-fallback">Live market feed is temporarily unavailable.</p>}
            </div>
        </section>
    );
};

export default MarketTicker;
