import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import MarketTicker from './components/MarketTicker';
import Footer from './components/Footer';
import SEBIModal from './components/SEBIModal';
import FestivalOverlay from './components/FestivalOverlay';
import FloatingChatWidget from './components/FloatingChatWidget';
import NotFoundPage from './pages/NotFoundPage';
import { routeComponents } from './routes';
import { RouterProvider } from './router';
import { useRouter } from './useRouter';
import { applyRouteSeo } from './utils/seo';
import './App.css';

const AppShell = () => {
    const { path } = useRouter();
    const isKnownRoute = Boolean(routeComponents[path]);
    const PageComponent = routeComponents[path] || NotFoundPage;

    useEffect(() => {
        applyRouteSeo(path, { noindex: !isKnownRoute });
    }, [path, isKnownRoute]);

    return (
        <div className="app-wrapper">
            <FestivalOverlay />
            <Navbar />
            <MarketTicker />
            <main className="main-content">
                <PageComponent />
            </main>
            <FloatingChatWidget />
            <Footer />
            <SEBIModal />
        </div>
    );
};

function App() {
    return (
        <RouterProvider>
            <AppShell />
        </RouterProvider>
    );
}

export default App;
