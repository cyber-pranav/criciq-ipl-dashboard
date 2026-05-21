import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  IconUser,
  IconBallBaseball,
  IconTarget,
  IconFlame,
  IconChartBar,
  IconSparkles,
  IconArrowLeft,
} from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import usePlayerStats from '../hooks/usePlayerStats';
import PerformanceRadar from '../components/charts/PerformanceRadar';
import StatTable from '../components/stats/StatTable';
import { formatNumber } from '../utils/formatters';

/* ━━━ Constants ━━━ */
const ROLE_COLORS = {
  batsman: 'bg-cyan text-navy',
  bowler: 'bg-amber text-navy',
  'all-rounder': 'bg-success text-navy',
  allrounder: 'bg-success text-navy',
};

const PIE_COLORS = ['#00D4FF', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899'];

const TABS = [
  { key: 'batting', label: 'Batting' },
  { key: 'bowling', label: 'Bowling' },
  { key: 'career', label: 'Career Summary' },
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
export default function PlayerProfile() {
  const { playerId } = useParams();
  const { player, loading, battingSeasons, bowlingSeasons, innings, radarData, milestones, teamRecord, wicketTypes } =
    usePlayerStats(playerId);

  const [activeTab, setActiveTab] = useState('batting');

  const role = (player?.role || 'batsman').toLowerCase();
  const hasBowling = (player?.wickets ?? 0) > 0 || bowlingSeasons?.length > 0;
  const visibleTabs = hasBowling ? TABS : TABS.filter((t) => t.key !== 'bowling');

  /* ── Innings table columns ── */
  const inningsColumns = useMemo(
    () => [
      { key: 'match', label: 'Match' },
      { key: 'opponent', label: 'VS' },
      { key: 'runs', label: 'Runs', mono: true },
      { key: 'balls', label: 'Balls', mono: true },
      { key: 'fours', label: '4s', mono: true },
      { key: 'sixes', label: '6s', mono: true },
      { key: 'strikeRate', label: 'SR', mono: true },
    ],
    []
  );

  /* ━━━ Loading skeleton ━━━ */
  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-10 w-64" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-16 w-36" />
          ))}
        </div>
        <SkeletonBlock className="h-80 w-full" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted">
        <IconUser size={48} className="mb-4 opacity-40" />
        <p className="text-lg">Player not found</p>
        <Link to="/" className="text-cyan text-sm mt-2 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Back button ── */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-muted hover:text-cyan text-sm transition-colors">
        <IconArrowLeft size={16} />
        Dashboard
      </Link>

      {/* ━━━ HERO SECTION ━━━ */}
      <section className="bg-surface border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">{player.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-muted text-sm">{player.team}</span>
              {player.season && (
                <span className="text-xs bg-border text-muted px-2 py-0.5 rounded">
                  {player.season}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded capitalize ${
                  ROLE_COLORS[role] || ROLE_COLORS.batsman
                }`}
              >
                {player.role || 'Batsman'}
              </span>
            </div>
          </div>

          <Link
            to={`/ask?q=Tell me about ${encodeURIComponent(player.name)}`}
            className="inline-flex items-center gap-2 bg-cyan text-navy font-semibold text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity self-start md:self-auto"
          >
            <IconSparkles size={16} />
            Ask AI about this player
          </Link>
        </div>

        {/* Key stats inline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Matches', value: player.matches ?? 0 },
            { label: 'Runs', value: player.runs ?? 0 },
            { label: 'Average', value: player.average ?? '—' },
            { label: 'Strike Rate', value: player.strikeRate ?? '—' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-muted text-xs uppercase tracking-wider">{s.label}</p>
              <p className="font-mono text-2xl font-bold text-text mt-1">
                {typeof s.value === 'number' ? formatNumber(s.value) : s.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ TAB NAVIGATION ━━━ */}
      <div className="flex border-b border-border">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ━━━ TAB CONTENT ━━━ */}
      <div>
        {/* ── Tab 1: Batting ── */}
        {activeTab === 'batting' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Runs per season bar chart */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                  Runs Per Season
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={battingSeasons || []} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                    <XAxis dataKey="season" tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                    <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                    <Bar dataKey="runs" name="Runs" fill="#00D4FF" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar chart */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                  Batting Profile
                </h3>
                <PerformanceRadar data={radarData} />
              </div>
            </div>

            {/* Innings data table */}
            <div className="bg-surface border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                All Innings
              </h3>
              <StatTable columns={inningsColumns} data={innings || []} />
            </div>
          </div>
        )}

        {/* ── Tab 2: Bowling ── */}
        {activeTab === 'bowling' && hasBowling && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Wickets per season */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                  Wickets Per Season
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={bowlingSeasons || []} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                    <XAxis dataKey="season" tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                    <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="wickets"
                      name="Wickets"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Economy rate trend */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                  Economy Rate Trend
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={bowlingSeasons || []} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                    <XAxis dataKey="season" tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                    <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} domain={[0, 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="economy"
                      name="Economy"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wicket type breakdown pie */}
            <div className="bg-surface border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                Wicket Type Breakdown
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={wicketTypes || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={0}
                      strokeWidth={1}
                      stroke="#0B0F1A"
                    >
                      {(wicketTypes || []).map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
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
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Career Summary ── */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            {/* Milestone timeline */}
            <div className="bg-surface border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                Career Milestones
              </h3>
              {milestones?.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="flex gap-6 pb-2 min-w-max">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="flex flex-col items-center min-w-[120px]">
                        <div className="w-3 h-3 rounded-full bg-cyan mb-2" />
                        <p className="font-mono text-xs text-muted">{m.year || m.season}</p>
                        <p className="text-sm text-text font-medium text-center mt-1">{m.title || m.label}</p>
                        {m.detail && (
                          <p className="text-xs text-muted text-center mt-0.5">{m.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Timeline line */}
                  <div className="h-px bg-border -mt-[calc(100%-2rem)] mx-6" />
                </div>
              ) : (
                <p className="text-muted text-sm">No milestones available</p>
              )}
            </div>

            {/* Head-to-head vs teams */}
            <div className="bg-surface border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                Performance vs Teams
              </h3>
              {teamRecord?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Runs</th>
                        <th>Average</th>
                        <th>SR</th>
                        <th>Best</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamRecord.map((r, idx) => (
                        <tr key={idx}>
                          <td className="text-text">{r.team}</td>
                          <td className="font-mono">{r.matches ?? '—'}</td>
                          <td className="font-mono text-cyan">{r.runs ?? '—'}</td>
                          <td className="font-mono">{r.average ?? '—'}</td>
                          <td className="font-mono">{r.strikeRate ?? '—'}</td>
                          <td className="font-mono text-amber">{r.best ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-sm">No team records available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
