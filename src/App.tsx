import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Navigation } from './components/Navigation';
import Dashboard  from './pages/Dashboarded7fix (1)';
import { DataEntry } from './pages/DataEntry';
import { SalesTable } from './pages/SalesTable_improved';
import CustomerPrediction from './pages/enhanced_prediction_component';
import { CompanyOverview } from './pages/CompanyOverview';
import { AdminPanel } from './pages/AdminPanel';
import SalesCompetitionDashboard from './pages/competation';
import { Footer } from './components/Footer';
import Login from './pages/login';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DealsProvider } from './contexts/DealsContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent = React.memo(() => {
  const location = useLocation();
  const showFooter = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Navigation />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/data-entry" element={
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          } />
          <Route path="/sales-table" element={
            <ProtectedRoute>
              <SalesTable />
            </ProtectedRoute>
          } />
          <Route path="/prediction" element={
            <ProtectedRoute>
              <CustomerPrediction />
            </ProtectedRoute>
          } />
          <Route path="/competition" element={
            <ProtectedRoute>
              <SalesCompetitionDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company-overview" element={
            <ProtectedRoute>
              <CompanyOverview />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/competation" element={
            <ProtectedRoute>
              <SalesCompetitionDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
});

AppContent.displayName = 'AppContent';

function App() {
  useTheme();

  return (
    <AuthProvider>
      <NotificationProvider>
        <DealsProvider>
          <Router>
            <AppContent />
          </Router>
        </DealsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;