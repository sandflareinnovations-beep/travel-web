import React, { useState } from 'react';
import Header from './components/Header';
import SearchCard from './components/SearchCard';
import ResultsView from './components/ResultsView';

function App() {
  const [activeTab, setActiveTab] = useState('flights');
  const [env, setEnv] = useState('TEST');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
    // In a real app, this would trigger an API call
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20" style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-0" style={{ height: '500px', width: '100%', position: 'absolute' }}>
        <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(135deg, var(--primary), #1e1b4b)', opacity: 0.05 }}></div>
        <div className="absolute rounded-full" style={{ top: '-6rem', right: '-6rem', width: '24rem', height: '24rem', background: '#60a5fa', filter: 'blur(64px)', opacity: 0.15 }}></div>
        <div className="absolute rounded-full" style={{ top: '8rem', left: '-5rem', width: '18rem', height: '18rem', background: '#c084fc', filter: 'blur(64px)', opacity: 0.15 }}></div>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} env={env} setEnv={setEnv} />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="text-center px-6" style={{ paddingTop: '5rem', paddingBottom: '8rem' }}>
          <h1 className="font-bold mb-4 tracking-tight" style={{ color: 'var(--text-main)', fontSize: '3rem', lineHeight: '1.2' }}>
            Search, Test, and Manage <br />
            <span className="text-gradient">Bookings Seamlessly</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)', maxWidth: '42rem', fontSize: '1.125rem' }}>
            Internal B2B platform for Flyinco flight and hotel operations. Live availability from Benzy, Akbar, and internal inventories.
          </p>
        </div>

        {/* Search Module */}
        <SearchCard onSearch={handleSearch} />

        {/* Results Area */}
        {showResults && (
          <div className="mt-8">
            <ResultsView />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
