import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { DataEntry } from './pages/DataEntry';
import { SalesTable } from './pages/SalesTable';
import { Prediction } from './pages/Prediction';
import { CompanyOverview } from './pages/CompanyOverview';
import { Footer } from './components/Footer';

function App() {
  useTheme();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Navigation />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-entry" element={<DataEntry />} />
            <Route path="/sales-table" element={<SalesTable />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/company-overview" element={<CompanyOverview />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;