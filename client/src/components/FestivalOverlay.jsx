import React, { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'festivalAnimationSeenV1';
const DISPLAY_DURATION_MS = 4000;
const INDIA_TIMEZONE = 'Asia/Kolkata';

const FESTIVAL_CALENDAR = [
    {
        id: 'new-year',
        greeting: 'Happy New Year',
        message: 'Wishing you a year full of prosperity and growth.',
        theme: 'confetti',
        monthDay: '01-01',
    },
    {
        id: 'makar-sankranti',
        greeting: 'Happy Makar Sankranti',
        message: 'May your ambitions fly high with joy and success.',
        theme: 'kite',
        monthDay: '01-14',
    },
    {
        id: 'republic-day',
        greeting: 'Happy Republic Day',
        message: 'Celebrating the spirit of our nation.',
        theme: 'tricolor',
        monthDay: '01-26',
    },
    {
        id: 'holi',
        greeting: 'Happy Holi',
        message: 'May your day be filled with vibrant colors and happiness.',
        theme: 'holi',
        datesByYear: {
            2026: '2026-03-03',
            2027: '2027-03-24',
            2028: '2028-03-13',
        },
    },
    {
        id: 'independence-day',
        greeting: 'Happy Independence Day',
        message: 'Saluting freedom, courage, and progress.',
        theme: 'tricolor',
        monthDay: '08-15',
    },
    {
        id: 'ganesh-chaturthi',
        greeting: 'Happy Ganesh Chaturthi',
        message: 'May this festival bring wisdom, peace, and prosperity.',
        theme: 'marigold',
        datesByYear: {
            2026: '2026-09-14',
            2027: '2027-09-03',
            2028: '2028-08-23',
        },
    },
    {
        id: 'dussehra',
        greeting: 'Happy Dussehra',
        message: 'May good always triumph over evil.',
        theme: 'marigold',
        datesByYear: {
            2026: '2026-10-20',
            2027: '2027-10-10',
            2028: '2028-09-28',
        },
    },
    {
        id: 'diwali',
        greeting: 'Happy Diwali',
        message: 'May this festival of lights bring joy and prosperity.',
        theme: 'diwali',
        datesByYear: {
            2026: '2026-11-08',
            2027: '2027-10-29',
            2028: '2028-10-17',
        },
        durationDays: 2,
    },
];

const HOLI_BURSTS = [
    { left: '8%', top: '24%', color: '#ef4444', delay: '0s' },
    { left: '20%', top: '70%', color: '#f59e0b', delay: '0.12s' },
    { left: '34%', top: '30%', color: '#10b981', delay: '0.2s' },
    { left: '48%', top: '76%', color: '#3b82f6', delay: '0.28s' },
    { left: '62%', top: '24%', color: '#8b5cf6', delay: '0.36s' },
    { left: '74%', top: '68%', color: '#ec4899', delay: '0.44s' },
    { left: '86%', top: '28%', color: '#f97316', delay: '0.52s' },
];

const DIWALI_FIREWORKS = [
    { left: '16%', top: '24%', color: '#facc15', delay: '0s' },
    { left: '34%', top: '16%', color: '#fb7185', delay: '0.3s' },
    { left: '52%', top: '22%', color: '#22d3ee', delay: '0.6s' },
    { left: '68%', top: '14%', color: '#a78bfa', delay: '0.9s' },
    { left: '84%', top: '26%', color: '#4ade80', delay: '1.2s' },
];

const TRICOLOR_BANDS = [
    { top: '14%', rotate: '-8deg', delay: '0s' },
    { top: '38%', rotate: '6deg', delay: '0.25s' },
    { top: '62%', rotate: '-5deg', delay: '0.5s' },
];

const KITES = [
    { left: '14%', top: '28%', delay: '0s' },
    { left: '34%', top: '14%', delay: '0.4s' },
    { left: '56%', top: '30%', delay: '0.8s' },
    { left: '78%', top: '18%', delay: '1.2s' },
];

const MARIGOLD_PETALS = Array.from({ length: 14 }, (_item, index) => ({
    left: `${6 + (index % 7) * 14}%`,
    delay: `${index * 0.18}s`,
    duration: `${4.6 + (index % 4) * 0.7}s`,
}));

const CONFETTI_BITS = Array.from({ length: 18 }, (_item, index) => ({
    left: `${4 + (index % 9) * 10}%`,
    delay: `${index * 0.1}s`,
    duration: `${3.5 + (index % 5) * 0.6}s`,
    hue: `${(index * 32) % 360}`,
}));

const addDaysToDateKey = (dateKey, days) => {
    const base = new Date(`${dateKey}T00:00:00Z`);
    base.setUTCDate(base.getUTCDate() + days);
    return base.toISOString().slice(0, 10);
};

const getIndianDateKey = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: INDIA_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());

    const byType = (type) => parts.find((part) => part.type === type)?.value || '';
    const year = byType('year');
    const month = byType('month');
    const day = byType('day');
    return `${year}-${month}-${day}`;
};

const resolveFestivalWindow = (festival, yearKey) => {
    const startDateKey = festival.datesByYear?.[yearKey] || (festival.monthDay ? `${yearKey}-${festival.monthDay}` : null);
    if (!startDateKey) {
        return null;
    }

    const durationDays = Math.max(1, Number(festival.durationDays || 1));
    const endDateKey = addDaysToDateKey(startDateKey, durationDays - 1);
    return {
        ...festival,
        startDateKey,
        endDateKey,
        occurrenceKey: startDateKey,
    };
};

const findActiveFestival = (todayKey) => {
    const yearKey = todayKey.slice(0, 4);

    for (const festival of FESTIVAL_CALENDAR) {
        const resolved = resolveFestivalWindow(festival, yearKey);
        if (!resolved) continue;
        if (todayKey >= resolved.startDateKey && todayKey <= resolved.endDateKey) {
            return resolved;
        }
    }

    return null;
};

const hasSeenFestival = (storageKey) => {
    try {
        return localStorage.getItem(storageKey) === '1';
    } catch {
        return false;
    }
};

const markFestivalSeen = (storageKey) => {
    try {
        localStorage.setItem(storageKey, '1');
    } catch {
        // Ignore storage errors and continue.
    }
};

const FestivalEffects = ({ theme }) => {
    if (theme === 'holi') {
        return (
            <div className="festival-effects festival-effects-holi" aria-hidden="true">
                {HOLI_BURSTS.map((burst, index) => (
                    <span
                        key={`holi-${index}`}
                        className="festival-holi-burst"
                        style={{
                            '--festival-left': burst.left,
                            '--festival-top': burst.top,
                            '--festival-color': burst.color,
                            '--festival-delay': burst.delay,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (theme === 'diwali') {
        return (
            <div className="festival-effects festival-effects-diwali" aria-hidden="true">
                {DIWALI_FIREWORKS.map((firework, index) => (
                    <span
                        key={`diwali-${index}`}
                        className="festival-firework"
                        style={{
                            '--festival-left': firework.left,
                            '--festival-top': firework.top,
                            '--festival-color': firework.color,
                            '--festival-delay': firework.delay,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (theme === 'tricolor') {
        return (
            <div className="festival-effects festival-effects-tricolor" aria-hidden="true">
                {TRICOLOR_BANDS.map((band, index) => (
                    <span
                        key={`tri-${index}`}
                        className="festival-tricolor-band"
                        style={{
                            '--festival-top': band.top,
                            '--festival-rotate': band.rotate,
                            '--festival-delay': band.delay,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (theme === 'kite') {
        return (
            <div className="festival-effects festival-effects-kite" aria-hidden="true">
                {KITES.map((kite, index) => (
                    <span
                        key={`kite-${index}`}
                        className="festival-kite"
                        style={{
                            '--festival-left': kite.left,
                            '--festival-top': kite.top,
                            '--festival-delay': kite.delay,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (theme === 'marigold') {
        return (
            <div className="festival-effects festival-effects-marigold" aria-hidden="true">
                {MARIGOLD_PETALS.map((petal, index) => (
                    <span
                        key={`petal-${index}`}
                        className="festival-petal"
                        style={{
                            '--festival-left': petal.left,
                            '--festival-delay': petal.delay,
                            '--festival-duration': petal.duration,
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="festival-effects festival-effects-confetti" aria-hidden="true">
            {CONFETTI_BITS.map((bit, index) => (
                <span
                    key={`confetti-${index}`}
                    className="festival-confetti-bit"
                    style={{
                        '--festival-left': bit.left,
                        '--festival-delay': bit.delay,
                        '--festival-duration': bit.duration,
                        '--festival-hue': bit.hue,
                    }}
                />
            ))}
        </div>
    );
};

const FestivalOverlay = () => {
    const [overlayState, setOverlayState] = useState(() => {
        const todayKey = getIndianDateKey();
        const festival = findActiveFestival(todayKey);
        if (!festival) {
            return { activeFestival: null, isVisible: false };
        }

        const storageKey = `${STORAGE_PREFIX}:${festival.id}:${festival.occurrenceKey}`;
        if (hasSeenFestival(storageKey)) {
            return { activeFestival: null, isVisible: false };
        }

        markFestivalSeen(storageKey);
        return { activeFestival: festival, isVisible: true };
    });

    useEffect(() => {
        if (!overlayState.isVisible) return undefined;

        const timerId = window.setTimeout(() => {
            setOverlayState((previous) => ({
                ...previous,
                isVisible: false,
            }));
        }, DISPLAY_DURATION_MS);

        return () => clearTimeout(timerId);
    }, [overlayState.isVisible]);

    const { activeFestival, isVisible } = overlayState;

    if (!isVisible || !activeFestival) {
        return null;
    }

    return (
        <div className={`festival-overlay festival-theme-${activeFestival.theme}`} aria-hidden="true">
            <FestivalEffects theme={activeFestival.theme} />
            <div className="festival-greeting">
                <h2>{activeFestival.greeting}</h2>
                <p>{activeFestival.message}</p>
            </div>
        </div>
    );
};

export default FestivalOverlay;
