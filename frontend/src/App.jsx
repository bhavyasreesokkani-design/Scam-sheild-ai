import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import ScamScanner from './pages/ScamScanner';
import UrlChecker from './pages/UrlChecker';
import ImageScanner from './pages/ImageScanner';
import ScanHistory from './pages/ScanHistory';
import ScamReports from './pages/ScamReports';
import ScamEducation from './pages/ScamEducation';
import CallAnalysisPreview from './pages/CallAnalysisPreview';
import Settings from './pages/Settings';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020B18] text-slate-100 font-sans antialiased flex flex-col">
      {/* Sidebar Component (~230px) */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Layout Area offset by sidebar width on desktop */}
      <div className="lg:pl-[230px] flex-1 flex flex-col min-h-screen">
        {/* Header Top Bar */}
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<ScamScanner />} />
            <Route path="/url-checker" element={<UrlChecker />} />
            <Route path="/image-scanner" element={<ImageScanner />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/reports" element={<ScamReports />} />
            <Route path="/education" element={<ScamEducation />} />
            <Route path="/call-analysis" element={<CallAnalysisPreview />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
