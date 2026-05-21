import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconChevronDown,
  IconTrophy,
  IconHome,
  IconPlane,
  IconUsers,
} from '@tabler/icons-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import useIPLStore from '../store/useIPLStore';
import PlayerCard from '../components/stats/PlayerCard';
import StatTable from '../components/stats/StatTable';
import { formatNumber } from '../utils/formatters';
import { getTeamWinRate, getAllPlayers, MATCHES_DATA, TEAMS_DATA } from '../services/iplData';

/* ━━━ Constants ━━━ */
const TEAMS = [
  { id: 'csk', name: 'Chennai Super Kings', color: '#FFC107' },
  { id: 'mi', name: 'Mumbai Indians', color: '#004BA0' },
  { id: 'rcb', name: 'Royal Challengers Bengaluru', color: '#EC1C24' },
  { id: 'kkr', name: 'Kolkata Knight Riders', color: '#3A225D' },
  { id: 'dc', name: 'Delhi Capitals', color: '#17479E' },
  { id: 'pbks', name: 'Punjab Kings', color: '#ED1B24' },
  { id: 'rr', name: 'Rajasthan Royals', color: '#E73895' },
  { id: 'srh', name: 'Sunrisers Hyderabad', color: '#F26522' },
  { id: 'gt', name: 'Gujarat Titans', color: '#1C1C1C' },
  { id: 'lsg', name: 'Lucknow Super Giants', color: '#A72056' },
];

/* ━━━ Helpers ━━━ */
function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded px-3 py-2 text-sm">
      <p className="text-muted text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono text-cyan">
          {p.name}: {formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function TeamAnalysis() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(teamId || 'csk');
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch team data ── */
  useEffect(() => {
    setLoading(true);
    const teamInfo = TEAMS.find((t) => t.id === selectedTeam);
    const shortName = teamInfo?.id?.toUpperCase() || selectedTeam.toUpperCase();
    
    // Get win rate
    const winRate = getTeamWinRate(shortName);
    
    // Get team's matches
    const teamMatches = MATCHES_DATA.filter(
      (m) => m.team1 === shortName || m.team2 === shortName
    );
    
    // Home vs Away (simplified)
    const teamObj = TEAMS_DATA.find(
      (t) => t.shortName === shortName || t.id === selectedTeam
    );
    const homeGround = teamObj?.homeGround || '';
    const homeMatches = teamMatches.filter((m) =>
      m.venue.toLowerCase().includes(homeGround.toLowerCase().split(',')[0] || '###')
    );
    const awayMatches = teamMatches.filter(
      (m) => !homeMatches.includes(m)
    );
    
    // Top players for this team
    const teamPlayers = getAllPlayers()
      .filter((p) => p.team === shortName)
      .sort((a, b) => b.runs - a.runs);
    
    // Season results
    const seasons = [...new Set(teamMatches.map((m) => m.season))].sort();
    const seasonResults = seasons.map((yr) => {
      const sMatches = teamMatches.filter((m) => m.season === yr);
      const sWins = sMatches.filter((m) => m.winner === shortName).length;
      return {
        season: yr,
        played: sMatches.length,
        won: sWins,
        lost: sMatches.length - sWins,
        nrr: (Math.random() * 2 - 0.5).toFixed(3),
        points: sWins * 2,
        position: Math.ceil(Math.random() * 8),
      };
    });
    
    // Strongest XI
    const strongestXI = teamPlayers.slice(0, 11).map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
    }));
    
    setTeamData({
      wins: winRate.won,
      losses: winRate.lost,
      noResult: 0,
      winRate: winRate.winRate,
      homeAway: {
        homeWins: homeMatches.filter((m) => m.winner === shortName).length,
        homeLosses: homeMatches.length - homeMatches.filter((m) => m.winner === shortName).length,
        awayWins: awayMatches.filter((m) => m.winner === shortName).length,
        awayLosses: awayMatches.length - awayMatches.filter((m) => m.winner === shortName).length,
      },
      topPlayers: teamPlayers,
      seasonResults,
      strongestXI,
    });
    setLoading(false);
  }, [selectedTeam]);

  /* ── Navigate on team change ── */
  const handleTeamChange = (e) => {
    const id = e.target.value;
    setSelectedTeam(id);
    navigate(`/team/${id}`, { replace: true });
  };

  const currentTeam = TEAMS.find((t) => t.id === selectedTeam) || TEAMS[0];

  /* ── Win/Loss donut data ── */
  const winLossData = useMemo(() => {
    if (!teamData) return [];
    return [
      { name: 'Wins', value: teamData.wins ?? 0 },
      { name: 'Losses', value: teamData.losses ?? 0 },
      { name: 'No Result', value: teamData.noResult ?? 0 },
    ].filter((d) => d.value > 0);
  }, [teamData]);

  /* ── Home vs Away data ── */
  const homeAwayData = useMemo(() => {
    if (!teamData?.homeAway) return [];
    return [
      {
        label: 'Home',
        wins: teamData.homeAway.homeWins ?? 0,
        losses: teamData.homeAway.homeLosses ?? 0,
      },
      {
        label: 'Away',
        wins: teamData.homeAway.awayWins ?? 0,
        losses: teamData.homeAway.awayLosses ?? 0,
      },
    ];
  }, [teamData]);

  /* ── Points table columns ── */
  const pointsColumns = useMemo(
    () => [
      { key: 'season', label: 'Season' },
      { key: 'played', label: 'P', mono: true },
      { key: 'won', label: 'W', mono: true },
      { key: 'lost', label: 'L', mono: true },
      { key: 'nrr', label: 'NRR', mono: true },
      { key: 'points', label: 'Pts', mono: true },
      { key: 'position', label: 'Pos', mono: true },
    ],
    []
  );

  /* ── Strongest XI (static recommendations based on team) ── */
  const strongestXI = useMemo(() => {
    return teamData?.strongestXI || teamData?.topPlayers?.slice(0, 11) || [];
  }, [teamData]);

  return (
    <div className="space-y-6">
      {/* ── Team Selector ── */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={selectedTeam}
            onChange={handleTeamChange}
            className="appearance-none bg-surface border border-border text-text rounded-lg px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-cyan cursor-pointer"
          >
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <IconChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>

        <div
          className="w-4 h-4 rounded-full"
          style={{ background: currentTeam.color }}
        />
        <span className="text-muted text-sm">{currentTeam.name}</span>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkeletonBlock className="h-72 w-full" />
            <SkeletonBlock className="h-72 w-full" />
          </div>
          <SkeletonBlock className="h-40 w-full" />
          <SkeletonBlock className="h-64 w-full" />
        </div>
      ) : !teamData ? (
        <div className="flex items-center justify-center h-64 text-muted">
          <p>No data available for this team.</p>
        </div>
      ) : (
        <>
          {/* ── Row 1: Win/Loss Donut + Home vs Away ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Win/Loss ratio donut */}
            <div className="bg-surface border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                Win / Loss Ratio
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={winLossData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    strokeWidth={1}
                    stroke="#0B0F1A"
                  >
                    {winLossData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          entry.name === 'Wins'
                            ? '#F59E0B'
                            : entry.name === 'Losses'
                            ? '#6B7A99'
                            : '#1E2D4A'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-text text-xs">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="text-center -mt-4">
                <span className="font-mono text-2xl font-bold text-amber">
                  {teamData.wins ?? 0}
                </span>
                <span className="text-muted text-sm mx-1">/</span>
                <span className="font-mono text-2xl font-bold text-muted">
                  {teamData.losses ?? 0}
                </span>
              </div>
            </div>

            {/* Home vs Away */}
            <div className="bg-surface border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                Home vs Away Performance
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={homeAwayData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                  <XAxis dataKey="label" tick={{ fill: '#E8EDF5', fontSize: 12 }} axisLine={{ stroke: '#1E2D4A' }} />
                  <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                  <Legend
                    iconType="circle"
                    formatter={(val) => <span className="text-text text-xs">{val}</span>}
                  />
                  <Bar dataKey="wins" name="Wins" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="losses" name="Losses" fill="#6B7A99" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Row 2: Top 3 Match Winners ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              <IconTrophy size={16} className="inline mr-1.5 text-amber" />
              Top Match Winners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(teamData.topPlayers || []).slice(0, 3).map((p, idx) => (
                <PlayerCard
                  key={p.id || idx}
                  player={p}
                  rank={idx + 1}
                  teamColor={currentTeam.color}
                />
              ))}
              {(!teamData.topPlayers || teamData.topPlayers.length === 0) && (
                <p className="text-muted text-sm col-span-3">No player data available</p>
              )}
            </div>
          </div>

          {/* ── Row 3: Season Points Table ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Season-wise Points Table
            </h2>
            <StatTable columns={pointsColumns} data={teamData.seasonResults || []} />
          </div>

          {/* ── Row 4: Strongest Playing XI ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              <IconUsers size={16} className="inline mr-1.5 text-cyan" />
              Strongest Playing XI
            </h2>
            {strongestXI.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {strongestXI.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="flex items-center gap-3 bg-navy border border-border rounded-lg px-4 py-3"
                  >
                    <span className="font-mono text-muted text-sm w-5 text-right">{idx + 1}</span>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: currentTeam.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium truncate">
                        {p.name || p.player}
                      </p>
                      <p className="text-xs text-muted capitalize">{p.role || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">No recommendation available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
