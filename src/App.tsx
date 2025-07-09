import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DreamLicensePage from './pages/DreamLicensePage';
import AICompanionPage from './pages/AICompanionPage';
import PrivacyPage from './pages/PrivacyPage';
import XRImmersionPage from './pages/XRImmersionPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-gray-100">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="relative">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;