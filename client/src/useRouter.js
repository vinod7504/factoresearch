import { useContext } from 'react';
import { RouterContext } from './routerContext';

export const useRouter = () => {
    const context = useContext(RouterContext);

    if (!context) {
        throw new Error('useRouter must be used inside RouterProvider.');
    }

    return context;
};
