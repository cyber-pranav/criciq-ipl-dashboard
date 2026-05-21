import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import PlayerProfile from './pages/PlayerProfile';
import TeamAnalysis from './pages/TeamAnalysis';
import HeadToHead from './pages/HeadToHead';
import AskAI from './pages/AskAI';
import useIPLStore from './store/useIPLStore';

export default function App() {
  const loadDashboardData = useIPLStore((s) => s.loadDashboardData);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-navy text-text">
        {/* Sidebar — self-positioning */}
        <Sidebar />

        {/* Main content area */}
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
