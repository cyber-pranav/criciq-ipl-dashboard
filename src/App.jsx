import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import PlayerProfile from './pages/PlayerProfile';
import TeamAnalysis from './pages/TeamAnalysis';
import HeadToHead from './pages/HeadToHead';
import AskAI from './pages/AskAI';
import Analytics from './pages/Analytics';
import WhatIf from './pages/WhatIf';
import FranchisePicker from './components/ui/FranchisePicker';
import NLSearchModal from './components/ai/NLSearchModal';
import useIPLStore from './store/useIPLStore';
import useThemeStore from './store/useThemeStore';

export default function App() {
  const loadDashboardData = useIPLStore((s) => s.loadDashboardData);
  const applyTheme = useThemeStore((s) => s.applyTheme);

  useEffect(() => {
    loadDashboardData();
    applyTheme();
  }, [loadDashboardData, applyTheme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="flex min-h-screen bg-navy text-text">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen md:ml-60">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/players" element={<Navigate to="/" replace />} />
                <Route path="/player/:playerId" element={<PlayerProfile />} />
                <Route path="/teams" element={<Navigate to="/team/csk" replace />} />
                <Route path="/team/:teamId" element={<TeamAnalysis />} />
                <Route path="/head-to-head" element={<HeadToHead />} />
                <Route path="/ask" element={<AskAI />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/what-if" element={<WhatIf />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <FranchisePicker />
          <NLSearchModal />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
