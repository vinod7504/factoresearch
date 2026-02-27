import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

const REFRESH_INTERVAL_MS = 120000;
const REQUEST_TIMEOUT_MS = 8500;
const CACHE_TTL_MS = 60000;
const RATE_LIMIT_BACKOFF_MS = 5 * 60 * 1000;
const DAY_SNAPSHOT_KEY = 'heroMarketSnapshotV1';
const MAX_CHART_POINTS = 22;
const PLACEHOLDER_CANDLE_COUNT = 18;

const HERO_MARKETS = [
    { label: 'NSE NIFTY 50', symbol: '^NSEI', logo: '/images/market/nse.svg' },
    { label: 'BSE SENSEX', symbol: '^BSESN', logo: '/images/market/bse.svg' },
];

const heroMarketCache = {
    payload: null,
    timestamp: 0,
    inflight: null,
    backoffUntil: 0,
};

const emptyMarket = (market) => ({
    ...market,
    price: null,
    change: null,
    changePercent: null,
    candles: [],
});

const sanitizeMarket = (candidate, fallbackMarket) => {
    const source = candidate && typeof candidate === 'object' ? candidate : {};
    const rawCandles = Array.isArray(source.candles) ? source.candles : [];
    const candles = rawCandles
        .map((item) => {
            const open = toFiniteNumber(item?.open);
            const high = toFiniteNumber(item?.high);
            const low = toFiniteNumber(item?.low);
            const close = toFiniteNumber(item?.close);
            if (open === null || high === null || low === null || close === null) return null;
            return { open, high, low, close };
        })
        .filter(Boolean);

    return {
        ...fallbackMarket,
        label: typeof source.label === 'string' && source.label.trim() ? source.label : fallbackMarket.label,
        symbol:
            typeof source.symbol === 'string' && source.symbol.trim()
                ? source.symbol
                : fallbackMarket.symbol,
        logo: typeof source.logo === 'string' && source.logo.trim() ? source.logo : fallbackMarket.logo,
        price: toFiniteNumber(source.price),
        change: toFiniteNumber(source.change),
        changePercent: toFiniteNumber(source.changePercent),
        candles,
    };
};

const sanitizeMarkets = (inputMarkets) =>
    HERO_MARKETS.map((fallbackMarket) => {
        if (!Array.isArray(inputMarkets)) return emptyMarket(fallbackMarket);

        const bySymbol = inputMarkets.find(
            (item) =>
                item &&
                typeof item === 'object' &&
                typeof item.symbol === 'string' &&
                item.symbol === fallbackMarket.symbol
        );

        const byLabel = inputMarkets.find(
            (item) =>
                item &&
                typeof item === 'object' &&
                typeof item.label === 'string' &&
                item.label === fallbackMarket.label
        );

        const match = bySymbol || byLabel;
        return sanitizeMarket(match, fallbackMarket);
    });

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const readDaySnapshot = () => {
    try {
        const raw = localStorage.getItem(DAY_SNAPSHOT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed?.day !== getTodayKey() || !Array.isArray(parsed?.markets)) return null;
        return sanitizeMarkets(parsed.markets);
    } catch {
        return null;
    }
};

const writeDaySnapshot = (markets) => {
    try {
        localStorage.setItem(
            DAY_SNAPSHOT_KEY,
            JSON.stringify({
                day: getTodayKey(),
                markets: sanitizeMarkets(markets),
            })
        );
    } catch {
        // Ignore local storage errors.
    }
};

const toFiniteNumber = (value) => {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const reducePoints = (points, targetCount) => {
    if (points.length <= targetCount) return points;
    const reduced = [];
    const step = (points.length - 1) / (targetCount - 1);
    for (let index = 0; index < targetCount; index += 1) {
        reduced.push(points[Math.round(index * step)]);
    }
    return reduced;
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

const formatSigned = (value) => {
    if (typeof value !== 'number') return '--';
    const absolute = Math.abs(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${value >= 0 ? '+' : '-'}${absolute}`;
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
            const error = new Error(`Hero market fetch failed with status ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } finally {
        clearTimeout(timeoutId);
    }
};

const extractMarketChart = (payload) => {
    const result = payload?.chart?.result?.[0];
    const meta = result?.meta || {};
    const quoteSeries = result?.indicators?.quote?.[0] || {};
    const closes = Array.isArray(quoteSeries.close) ? quoteSeries.close : [];
    const opens = Array.isArray(quoteSeries.open) ? quoteSeries.open : [];
    const highs = Array.isArray(quoteSeries.high) ? quoteSeries.high : [];
    const lows = Array.isArray(quoteSeries.low) ? quoteSeries.low : [];
    const validCloses = closes.filter((value) => typeof value === 'number');
    const candleSeries = [];

    for (let index = 0; index < closes.length; index += 1) {
        const open = toFiniteNumber(opens[index]);
        const high = toFiniteNumber(highs[index]);
        const low = toFiniteNumber(lows[index]);
        const close = toFiniteNumber(closes[index]);

        if (open === null || high === null || low === null || close === null) {
            continue;
        }

        candleSeries.push({ open, high, low, close });
    }

    if (!candleSeries.length && validCloses.length > 1) {
        for (let index = 1; index < validCloses.length; index += 1) {
            const previousClose = validCloses[index - 1];
            const close = validCloses[index];
            candleSeries.push({
                open: previousClose,
                high: Math.max(previousClose, close),
                low: Math.min(previousClose, close),
                close,
            });
        }
    }

    const reducedCandles = reducePoints(candleSeries, MAX_CHART_POINTS);

    const price = toFiniteNumber(meta.regularMarketPrice ?? validCloses[validCloses.length - 1]);
    const referenceClose = toFiniteNumber(
        meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPreviousClose
    );

    let change = toFiniteNumber(meta.regularMarketChange);
    let changePercent = toFiniteNumber(meta.regularMarketChangePercent);

    if (change === null && typeof price === 'number' && typeof referenceClose === 'number') {
        change = price - referenceClose;
    }

    if (changePercent === null && typeof change === 'number' && typeof referenceClose === 'number' && referenceClose !== 0) {
        changePercent = (change / referenceClose) * 100;
    }

    return {
        price,
        change,
        changePercent,
        candles: reducedCandles,
    };
};

const buildChartEndpoints = (symbol) => {
    const encoded = encodeURIComponent(symbol);
    const direct = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=5m&range=1d`;
    const cors = `https://api.allorigins.win/raw?url=${encodeURIComponent(direct)}`;

    return [
        `/api/market-chart/${encoded}?interval=5m&range=1d`,
        `/api/market-chart/${encoded}?interval=1d&range=5d`,
        cors,
    ];
};

const fetchMarket = async (market) => {
    let sawRateLimit = false;
    const endpoints = buildChartEndpoints(market.symbol);

    for (const endpoint of endpoints) {
        try {
            const payload = await fetchJsonWithTimeout(endpoint);
            const parsed = extractMarketChart(payload);
            if (typeof parsed.price === 'number') {
                return {
                    ...market,
                    ...parsed,
                };
            }
        } catch (error) {
            if (error?.status === 429) sawRateLimit = true;
        }
    }

    if (sawRateLimit) {
        const error = new Error('Hero market request rate-limited.');
        error.status = 429;
        throw error;
    }

    return emptyMarket(market);
};

const fetchMarketsWithCache = async () => {
    const now = Date.now();

    if (heroMarketCache.payload && now - heroMarketCache.timestamp < CACHE_TTL_MS) {
        return heroMarketCache.payload;
    }

    if (heroMarketCache.inflight) {
        return heroMarketCache.inflight;
    }

    if (heroMarketCache.backoffUntil > now) {
        if (heroMarketCache.payload) return heroMarketCache.payload;
        const backoffError = new Error('Hero market request backoff active.');
        backoffError.status = 429;
        throw backoffError;
    }

    heroMarketCache.inflight = (async () => {
        const mapped = await Promise.all(
            HERO_MARKETS.map(async (market) => {
                try {
                    return await fetchMarket(market);
                } catch (error) {
                    if (error?.status === 429) {
                        heroMarketCache.backoffUntil = Date.now() + RATE_LIMIT_BACKOFF_MS;
                    }
                    return emptyMarket(market);
                }
            })
        );

        heroMarketCache.payload = mapped;
        heroMarketCache.timestamp = Date.now();
        return mapped;
    })();

    try {
        return await heroMarketCache.inflight;
    } finally {
        heroMarketCache.inflight = null;
    }
};

const buildCandles = (candles) => {
    if (!Array.isArray(candles) || candles.length === 0) {
        return [];
    }

    const minLow = Math.min(...candles.map((candle) => candle.low));
    const maxHigh = Math.max(...candles.map((candle) => candle.high));
    const range = maxHigh - minLow || 1;
    const toY = (value) => 100 - ((value - minLow) / range) * 100;

    return candles.map((candle, index) => {
        const wickTop = Math.max(0, Math.min(100, toY(candle.high)));
        const wickBottom = Math.max(0, Math.min(100, toY(candle.low)));
        const openY = Math.max(0, Math.min(100, toY(candle.open)));
        const closeY = Math.max(0, Math.min(100, toY(candle.close)));
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const bodyHeight = Math.max(bodyBottom - bodyTop, 2.2);
        const wickHeight = Math.max(wickBottom - wickTop, 1.2);

        let direction = 'flat';
        if (candle.close > candle.open) direction = 'up';
        if (candle.close < candle.open) direction = 'down';

        return {
            id: `${index}-${candle.open}-${candle.close}-${candle.high}-${candle.low}`,
            wickTop,
            wickHeight,
            bodyTop,
            bodyHeight,
            direction,
        };
    });
};

const buildPlaceholderCandles = (seedKey) => {
    const seed = seedKey
        .split('')
        .reduce((total, char) => total + char.charCodeAt(0), 0);

    return Array.from({ length: PLACEHOLDER_CANDLE_COUNT }, (_, index) => {
        const phase = seed * 0.015 + index * 0.52;
        const swing = Math.sin(phase) * 17;
        const drift = Math.cos(phase * 0.72) * 6;
        const center = 48 + swing * 0.55 + drift;
        const wickHeight = clamp(16 + Math.abs(Math.sin(phase * 1.4)) * 24, 10, 52);
        const bodyHeight = clamp(6 + Math.abs(Math.cos(phase * 1.25)) * 13, 4, 22);
        const bodyTop = clamp(center - bodyHeight / 2, 4, 94 - bodyHeight);
        const wickTop = clamp(center - wickHeight / 2, 2, 98 - wickHeight);
        const waveDir = Math.sin(phase * 1.7);
        const direction = waveDir > 0.22 ? 'up' : waveDir < -0.22 ? 'down' : 'flat';

        return {
            id: `placeholder-${seedKey}-${index}`,
            wickTop,
            wickHeight,
            bodyTop,
            bodyHeight,
            direction,
        };
    });
};

const getTrendClass = (market) => {
    if (typeof market.change !== 'number') return 'flat';
    if (market.change > 0) return 'up';
    if (market.change < 0) return 'down';
    return 'flat';
};

const HeroMarketPanel = () => {
    const initialSnapshot = readDaySnapshot();
    const [markets, setMarkets] = useState(() => initialSnapshot || sanitizeMarkets([]));
    const [isSnapshot, setIsSnapshot] = useState(() => Boolean(initialSnapshot));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchMarkets = async () => {
            try {
                const mappedMarkets = await fetchMarketsWithCache();
                if (!isMounted) return;

                const hasLiveData = mappedMarkets.some(
                    (market) => typeof market.price === 'number' && market.candles.length > 1
                );

                if (hasLiveData) {
                    const safeMarkets = sanitizeMarkets(mappedMarkets);
                    setMarkets(safeMarkets);
                    writeDaySnapshot(safeMarkets);
                    setIsSnapshot(false);
                    setHasError(false);
                    return;
                }

                const snapshot = readDaySnapshot();
                if (snapshot?.length) {
                    setMarkets(sanitizeMarkets(snapshot));
                    setIsSnapshot(true);
                    setHasError(false);
                    return;
                }

                setMarkets(sanitizeMarkets(mappedMarkets));
                setIsSnapshot(false);
                setHasError(true);
            } catch {
                if (!isMounted) return;

                const snapshot = readDaySnapshot();
                if (snapshot?.length) {
                    setMarkets(sanitizeMarkets(snapshot));
                    setIsSnapshot(true);
                    setHasError(false);
                    return;
                }

                setIsSnapshot(false);
                setHasError(true);
            }
        };

        fetchMarkets();
        const intervalId = setInterval(fetchMarkets, REFRESH_INTERVAL_MS);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <section className="hero-market-stack" aria-label="Live NSE and BSE market chart">
            {markets.map((market, marketIndex) => {
                const fallbackMarket = HERO_MARKETS[marketIndex] || HERO_MARKETS[0];
                const safeMarket = sanitizeMarket(market, fallbackMarket);
                const marketLabel = safeMarket.label;
                const marketSymbol = safeMarket.symbol;
                const trendClass = getTrendClass(safeMarket);
                const liveCandles = buildCandles(safeMarket.candles);
                const hasLiveCandles = liveCandles.length > 0;
                const candles = hasLiveCandles ? liveCandles : buildPlaceholderCandles(marketSymbol);
                const cardTrendClass = hasLiveCandles ? trendClass : 'flat';
                const hasMarketLiveData = typeof safeMarket.price === 'number' && safeMarket.candles.length > 1;
                const feedLabel = hasMarketLiveData ? 'Live' : isSnapshot ? 'Snapshot' : 'Syncing';

                return (
                    <article className="hero-market-card hero-market-card--single glass-card" key={marketSymbol}>
                        <div className="hero-market-header">
                            <div className="hero-market-name-wrap">
                                <img src={safeMarket.logo} alt={`${marketLabel} logo`} className="hero-market-logo" />
                                <span className="hero-market-name">{marketLabel}</span>
                            </div>
                            <div className={`hero-market-feed ${hasMarketLiveData ? 'live' : 'offline'}`}>
                                <span className="hero-market-dot" />
                                {feedLabel}
                            </div>
                        </div>

                        <div className="hero-market-meta">
                            <div className="hero-market-price">{formatPrice(safeMarket.price)}</div>
                            <span className={`hero-market-change ${trendClass}`}>
                                {trendClass === 'up' && <TrendingUp size={13} />}
                                {trendClass === 'down' && <TrendingDown size={13} />}
                                {typeof safeMarket.change === 'number' && typeof safeMarket.changePercent === 'number'
                                    ? `${formatSigned(safeMarket.change)} (${formatSigned(safeMarket.changePercent)}%)`
                                    : '--'}
                            </span>
                        </div>

                        <div className="hero-market-visual">
                            <div className={`hero-market-chart ${cardTrendClass} ${hasLiveCandles ? '' : 'placeholder'}`}>
                                <div
                                    className="hero-boxplot-grid"
                                    role="img"
                                    aria-label={`${marketLabel} animated intraday box plot`}
                                >
                                    {candles.map((candle, index) => {
                                        const isLatest = index === candles.length - 1;
                                        return (
                                            <div className="hero-boxplot-column" key={`${marketSymbol}-${candle.id}`}>
                                                <Motion.span
                                                    className={`hero-candle-wick ${candle.direction} ${isLatest ? 'active' : ''} ${hasLiveCandles ? '' : 'placeholder'}`}
                                                    style={{
                                                        top: `${candle.wickTop}%`,
                                                    }}
                                                    initial={{ height: '0%', opacity: 0 }}
                                                    animate={{ height: `${candle.wickHeight}%`, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.28,
                                                        delay: index * 0.018,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                />
                                                <Motion.span
                                                    className={`hero-candle-body ${candle.direction} ${isLatest ? 'active' : ''} ${hasLiveCandles ? '' : 'placeholder'}`}
                                                    style={{
                                                        top: `${candle.bodyTop}%`,
                                                        animationDelay: `${index * 0.07}s`,
                                                    }}
                                                    initial={{ height: '0%', opacity: 0 }}
                                                    animate={{ height: `${candle.bodyHeight}%`, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.38,
                                                        delay: index * 0.02,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                    <Motion.div
                                        className={`hero-boxplot-scan ${cardTrendClass}`}
                                        initial={{ x: '-45%' }}
                                        animate={{ x: '145%' }}
                                        transition={{
                                            duration: 3.6,
                                            ease: 'linear',
                                            repeat: Infinity,
                                        }}
                                    />
                                </div>
                                {!hasLiveCandles && <div className="hero-boxplot-loading">Syncing live feed...</div>}
                            </div>
                        </div>
                    </article>
                );
            })}

            {hasError && (
                <p className="hero-market-note">
                    Live chart is temporarily unavailable. Displaying the most recent available data.
                </p>
            )}
        </section>
    );
};

export default HeroMarketPanel;
