import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const REFRESH_INTERVAL_MS = 120000;
const REQUEST_TIMEOUT_MS = 8500;
const CACHE_TTL_MS = 60000;
const RATE_LIMIT_BACKOFF_MS = 5 * 60 * 1000;
const MIN_QUOTES_FOR_FEED = 1;
const DAY_SNAPSHOT_KEY = 'marketTickerDaySnapshotV1';

const MARKET_INDEXES = [
    { label: 'SENSEX', symbols: ['^BSESN'], logo: '/images/market/bse.svg' },
    { label: 'BANKNIFTY', symbols: ['^NSEBANK'], logo: '/images/market/nse.svg' },
    { label: 'NIFTY 50', symbols: ['^NSEI'], logo: '/images/market/nse.svg' },
    { label: 'FINNIFTY', symbols: ['^CNXFIN'], logo: '/images/market/nse.svg' },
    { label: 'NIFTY MIDCAP 50', symbols: ['^NSEMDCP50'], logo: '/images/market/nse.svg' },
    { label: 'NIFTY IT', symbols: ['^CNXIT'], logo: '/images/market/nse.svg' },
];

const marketQuoteCache = {
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

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const readDaySnapshot = () => {
    try {
        const raw = localStorage.getItem(DAY_SNAPSHOT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed?.day !== getTodayKey() || !Array.isArray(parsed?.quotes)) return null;
        return parsed.quotes;
    } catch {
        return null;
    }
};

const writeDaySnapshot = (quotes) => {
    try {
        localStorage.setItem(
            DAY_SNAPSHOT_KEY,
            JSON.stringify({
                day: getTodayKey(),
                quotes,
            })
        );
    } catch {
        // Ignore storage failures; ticker can still run from in-memory state.
    }
};

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
    return value.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
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

        return await response.json();
    } finally {
        clearTimeout(timeoutId);
    }
};

const extractQuoteFromChartPayload = (payload) => {
    const result = payload?.chart?.result?.[0];
    const meta = result?.meta || {};
    const quoteSeries = result?.indicators?.quote?.[0] || {};
    const closes = Array.isArray(quoteSeries.close) ? quoteSeries.close.filter((value) => typeof value === 'number') : [];
    const lastClose = closes.length > 0 ? closes[closes.length - 1] : null;

    const price = toFiniteNumber(meta.regularMarketPrice ?? lastClose);
    const previousClose = toFiniteNumber(
        meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPreviousClose
    );

    let change = toFiniteNumber(meta.regularMarketChange);
    let changePercent = toFiniteNumber(meta.regularMarketChangePercent);

    if (change === null && typeof price === 'number' && typeof previousClose === 'number') {
        change = price - previousClose;
    }

    if (changePercent === null && typeof change === 'number' && typeof previousClose === 'number' && previousClose !== 0) {
        changePercent = (change / previousClose) * 100;
    }

    return {
        price,
        change,
        changePercent,
    };
};

const buildChartEndpoints = (symbol) => {
    const encoded = encodeURIComponent(symbol);
    const direct = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=5d`;
    const cors = `https://api.allorigins.win/raw?url=${encodeURIComponent(direct)}`;

    return [
        `/api/market-chart/${encoded}?interval=1d&range=5d`,
        cors,
    ];
};

const fetchQuoteForIndex = async (index) => {
    let sawRateLimit = false;

    for (const symbol of index.symbols) {
        const endpoints = buildChartEndpoints(symbol);

        for (const endpoint of endpoints) {
            try {
                const payload = await fetchJsonWithTimeout(endpoint);
                const parsed = extractQuoteFromChartPayload(payload);
                if (typeof parsed.price === 'number') {
                    return {
                        ...index,
                        ...parsed,
                    };
                }
            } catch (error) {
                if (error?.status === 429) sawRateLimit = true;
            }
        }
    }

    if (sawRateLimit) {
        const error = new Error('Ticker request rate-limited.');
        error.status = 429;
        throw error;
    }

    return emptyQuote(index);
};

const fetchQuotesWithCache = async () => {
    const now = Date.now();

    if (marketQuoteCache.payload && now - marketQuoteCache.timestamp < CACHE_TTL_MS) {
        return marketQuoteCache.payload;
    }

    if (marketQuoteCache.inflight) {
        return marketQuoteCache.inflight;
    }

    if (marketQuoteCache.backoffUntil > now) {
        if (marketQuoteCache.payload) return marketQuoteCache.payload;
        const backoffError = new Error('Ticker request backoff active.');
        backoffError.status = 429;
        throw backoffError;
    }

    marketQuoteCache.inflight = (async () => {
        const mapped = await Promise.all(
            MARKET_INDEXES.map(async (index) => {
                try {
                    return await fetchQuoteForIndex(index);
                } catch (error) {
                    if (error?.status === 429) {
                        marketQuoteCache.backoffUntil = Date.now() + RATE_LIMIT_BACKOFF_MS;
                    }
                    return emptyQuote(index);
                }
            })
        );

        marketQuoteCache.payload = mapped;
        marketQuoteCache.timestamp = Date.now();
        return mapped;
    })();

    try {
        return await marketQuoteCache.inflight;
    } finally {
        marketQuoteCache.inflight = null;
    }
};

const MarketTicker = () => {
    const [quotes, setQuotes] = useState(() => readDaySnapshot() || MARKET_INDEXES.map(emptyQuote));
    const [isLiveFeed, setIsLiveFeed] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isDaySnapshot, setIsDaySnapshot] = useState(() => Boolean(readDaySnapshot()));

    useEffect(() => {
        let isMounted = true;

        const fetchQuotes = async () => {
            try {
                const mappedQuotes = await fetchQuotesWithCache();
                if (!isMounted) return;

                const liveQuotes = mappedQuotes.filter((item) => typeof item.price === 'number');
                const hasLiveData = liveQuotes.length >= MIN_QUOTES_FOR_FEED;
                if (hasLiveData) {
                    setQuotes(liveQuotes);
                    writeDaySnapshot(liveQuotes);
                    setIsLiveFeed(true);
                    setHasError(false);
                    setIsDaySnapshot(false);
                    return;
                }

                const snapshot = readDaySnapshot();
                if (snapshot?.length) {
                    setQuotes(snapshot);
                    setIsLiveFeed(false);
                    setHasError(false);
                    setIsDaySnapshot(true);
                    return;
                }

                setQuotes(mappedQuotes);
                setIsLiveFeed(false);
                setHasError(true);
                setIsDaySnapshot(false);
            } catch {
                if (!isMounted) return;
                const snapshot = readDaySnapshot();
                if (snapshot?.length) {
                    setQuotes(snapshot);
                    setIsLiveFeed(false);
                    setHasError(false);
                    setIsDaySnapshot(true);
                    return;
                }

                setIsLiveFeed(false);
                setHasError(true);
                setIsDaySnapshot(false);
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
                    {isLiveFeed ? 'Live NSE/BSE' : isDaySnapshot ? 'Day snapshot' : 'Feed reconnecting'}
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
