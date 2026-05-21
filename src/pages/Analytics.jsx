import React, { useState } from 'react';
import { IconFlask } from '@tabler/icons-react';
import ClutchLeaderboard from '../components/analytics/ClutchLeaderboard';
import MatchupMatrix from '../components/analytics/MatchupMatrix';
import MomentumWorm from '../components/analytics/MomentumWorm';
import PhaseRadar from '../components/analytics/PhaseRadar';

const TEAMS = [
  { id: 'CSK', name: 'Chennai Super Kings' },
  { id: 'MI', name: 'Mumbai Indians' },
  { id: 'RCB', name: 'Royal Challengers Bengaluru' },
  { id: 'KKR', name: 'Kolkata Knight Riders' },
  { id: 'DC', name: 'Delhi Capitals' },
  { id: 'PBKS', name: 'Punjab Kings' },
  { id: 'RR', name: 'Rajasthan Royals' },
  { id: 'SRH', name: 'Sunrisers Hyderabad' },
  { id: 'GT', name: 'Gujarat Titans' },
  { id: 'LSG', name: 'Lucknow Super Giants' },
];

export default function Analytics() {
  const [phaseTeam, setPhaseTeam] = useState('CSK');
  const [wormTeam1, setWormTeam1] = useState('CSK');
  const [wormTeam2, setWormTeam2] = useState('MI');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <IconFlask size={24} className="text-cyan" stroke={1.5} />
          Analytics Lab
        </h1>
        <p className="text-muted text-sm mt-1">Advanced cricket intelligence powered by data</p>
      </div>

      {/* Row 1: Clutch Leaderboard */}
      <section className="bg-surface border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
          🔥 Clutch Index Leaderboard
        </h2>
        <ClutchLeaderboard />
      </section>

      {/* Row 2: Matchup Matrix + Phase Radar */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-surface border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            ⚔️ Batter vs Bowler Matchup Matrix
          </h2>
          <MatchupMatrix />
        </div>

        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              📡 Phase Intelligence
            </h2>
            <select
              value={phaseTeam}
              onChange={(e) => setPhaseTeam(e.target.value)}
              className="bg-navy text-text text-xs border border-border rounded px-2 py-1 outline-none focus:border-cyan"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.id}</option>
              ))}
            </select>
          </div>
          <PhaseRadar teamShortName={phaseTeam} />
        </div>
      </section>

      {/* Row 3: Momentum Worm */}
      <section className="bg-surface border border-border rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            📈 Momentum Worm Chart
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={wormTeam1}
              onChange={(e) => setWormTeam1(e.target.value)}
              className="bg-navy text-text text-xs border border-border rounded px-2 py-1 outline-none focus:border-cyan"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.id}</option>
              ))}
            </select>
            <span className="text-muted text-xs font-bold">VS</span>
            <select
              value={wormTeam2}
              onChange={(e) => setWormTeam2(e.target.value)}
              className="bg-navy text-text text-xs border border-border rounded px-2 py-1 outline-none focus:border-cyan"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.id}</option>
              ))}
            </select>
          </div>
        </div>
        <MomentumWorm team1={wormTeam1} team2={wormTeam2} />
      </section>
    </div>
  );
}
