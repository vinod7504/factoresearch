import React, { useEffect, useState } from 'react';
import { RouterContext } from './routerContext';
import { useRouter } from './useRouter';

const normalizePath = (path) => {
    if (!path) return '/';

    const cleanPath = path.split('?')[0].split('#')[0] || '/';

    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        return cleanPath.slice(0, -1);
    }

    return cleanPath;
};

const isModifiedClick = (event) => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export const RouterProvider = ({ children }) => {
    const [path, setPath] = useState(() => normalizePath(window.location.pathname));

    useEffect(() => {
        const handlePopState = () => {
            setPath(normalizePath(window.location.pathname));
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (nextPath) => {
        const normalizedNextPath = normalizePath(nextPath);

        setPath((currentPath) => {
            if (normalizedNextPath === currentPath) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return currentPath;
            }

            window.history.pushState({}, '', normalizedNextPath);
            return normalizedNextPath;
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <RouterContext.Provider value={{ path, navigate }}>
            {children}
        </RouterContext.Provider>
    );
};

export const RouteLink = ({ to, onClick, target, ...props }) => {
    const { navigate } = useRouter();
    const isExternal = /^https?:\/\//.test(to);

    const handleClick = (event) => {
        if (onClick) {
            onClick(event);
        }

        if (event.defaultPrevented || isExternal || target === '_blank') {
            return;
        }

        if (event.button !== 0 || isModifiedClick(event)) {
            return;
        }

        event.preventDefault();
        navigate(to);
    };

    return <a href={to} onClick={handleClick} target={target} {...props} />;
};
