import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import MarketTicker from './components/MarketTicker';
import Footer from './components/Footer';
import SEBIModal from './components/SEBIModal';
import FloatingChatWidget from './components/FloatingChatWidget';
import NotFoundPage from './pages/NotFoundPage';
import { routeComponents, routeTitles } from './routes';
import { RouterProvider } from './router';
import { useRouter } from './useRouter';
import './App.css';

const AppShell = () => {
    const { path } = useRouter();
    const PageComponent = routeComponents[path] || NotFoundPage;

    useEffect(() => {
        document.title = routeTitles[path] || 'Page Not Found | FactoResearch';
    }, [path]);

    return (
        <div className="app-wrapper">
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
