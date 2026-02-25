import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEBIModal from './components/SEBIModal';
import FloatingChatWidget from './components/FloatingChatWidget';
import NotFoundPage from './pages/NotFoundPage';
import { routeComponents } from './routes';
import { RouterProvider } from './router';
import { useRouter } from './useRouter';
import './App.css';

const AppShell = () => {
    const { path } = useRouter();
    const PageComponent = routeComponents[path] || NotFoundPage;

    return (
        <div className="app-wrapper">
            <Navbar />
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
