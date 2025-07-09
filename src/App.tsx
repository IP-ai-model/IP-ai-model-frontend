import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DreamLicensePage from './pages/DreamLicensePage';
import AICompanionPage from './pages/AICompanionPage';
import PrivacyPage from './pages/PrivacyPage';
import XRImmersionPage from './pages/XRImmersionPage';
import { IPModelProvider } from './contexts/IPModelContext';
import { useWallet } from './hooks/useWallet';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { wallet } = useWallet();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'dreamlicense':
        return <DreamLicensePage />;
      case 'ai-companion':
        return <AICompanionPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'xr-immersion':
        return <XRImmersionPage />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <IPModelProvider provider={wallet.provider} address={wallet.address}>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-gray-100">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="relative">
          {renderPage()}
        </main>
      </div>
    </IPModelProvider>
  );
}

export default App;