import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IconTrophy,
  IconCricket,
  IconFlame,
  IconTarget,
  IconArrowUpRight,
  IconArrowDownRight,
} from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import useIPLStore from '../store/useIPLStore';
import StatCard from '../components/stats/StatCard';
import MatchCard from '../components/stats/MatchCard';
import LiveTicker from '../components/layout/LiveTicker';
import RunsChart from '../components/charts/RunsChart';
import WicketHeatmap from '../components/charts/WicketHeatmap';
import ClutchLeaderboard from '../components/analytics/ClutchLeaderboard';
import DailyDigestBanner from '../components/ai/DailyDigestBanner';
import { formatNumber } from '../utils/formatters';

/* ━━━ Skeleton block helper ━━━ */
function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

function SectionSkeleton({ rows = 5, height = 'h-8' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} className={`w-full ${height}`} />
      ))}
    </div>
  );
}

/* ━━━ Custom recharts tooltip ━━━ */
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

export default function Dashboard() {
  const loading = useIPLStore((s) => s.isLoading);
  const seasonStats = useIPLStore((s) => s.seasonStats);
  const topBatsmen = useIPLStore((s) => s.topBatsmen);
  const topBowlers = useIPLStore((s) => s.topBowlers);
  const recentMatches = useIPLStore((s) => s.recentMatches);

  /* ── Derived hero stats ── */
  const heroStats = useMemo(() => {
    if (!seasonStats) return null;
    return {
      totalMatches: seasonStats.totalMatches ?? 0,
      totalRuns: seasonStats.totalRuns ?? 0,
      mostWickets: seasonStats.mostWickets ?? { player: '—', wickets: 0 },
      highestScore: seasonStats.highestScore ?? 0,
    };
  }, [seasonStats]);

  /* ── Top 5 batsmen with bar proportions ── */
  const top5Batsmen = useMemo(() => {
    if (!topBatsmen?.length) return [];
    const slice = topBatsmen.slice(0, 5);
    const maxRuns = Math.max(...slice.map((b) => b.runs || 0), 1);
    return slice.map((b, idx) => ({ ...b, rank: idx + 1, proportion: ((b.runs || 0) / maxRuns) * 100 }));
  }, [topBatsmen]);

  /* ── Top 5 bowlers for economy chart ── */
  const top5Bowlers = useMemo(() => {
    if (!topBowlers?.length) return [];
    return topBowlers.slice(0, 5).map((b) => ({
      name: b.player || b.name || '—',
      economy: b.economy ?? 0,
      wickets: b.wickets ?? 0,
    }));
  }, [topBowlers]);

  /* ── Recent 5 matches ── */
  const last5Matches = useMemo(() => {
    if (!recentMatches?.length) return [];
    return recentMatches.slice(0, 5);
  }, [recentMatches]);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <div className="space-y-6">
      {/* ── Daily Digest Banner ── */}
      <DailyDigestBanner />

      {/* ── SECTION A: Hero Stats Row ── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !heroStats ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card">
                <SkeletonBlock className="h-4 w-24 mb-3" />
                <SkeletonBlock className="h-8 w-32" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                label="Total Matches"
                value={heroStats.totalMatches}
                icon={IconCricket}
                delta={null}
              />
              <StatCard
                label="Total Runs"
                value={heroStats.totalRuns}
                icon={IconFlame}
                delta={null}
              />
              <StatCard
                label="Most Wickets"
                value={heroStats.mostWickets.wickets}
                icon={IconTarget}
                delta={null}
              />
              <StatCard
                label="Highest Score"
                value={heroStats.highestScore}
                icon={IconTrophy}
                delta={null}
              />
            </>
          )}
        </div>
      </section>

      {/* ── SECTION B: Live Match Ticker ── */}
      <section>
        <LiveTicker />
      </section>

      {/* ── SECTION C: Bento Grid — Main Dashboard ── */}
      <section className="bento-grid">
        {/* Season Runs Timeline (60%) */}
        <div className="bento-3 bg-surface border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Season Runs Timeline
          </h2>
          {loading ? (
            <SkeletonBlock className="w-full h-64" />
          ) : (
            <RunsChart data={null} />
          )}
        </div>

        {/* Top 5 Batsmen (40%) */}
        <div className="bento-2 bg-surface border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Top 5 Batsmen This Season
          </h2>
          {loading ? (
            <SectionSkeleton rows={5} height="h-12" />
          ) : top5Batsmen.length === 0 ? (
            <p className="text-muted text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {top5Batsmen.map((b) => (
                <Link
                  key={b.rank}
                  to={`/player/${b.id || b.playerId || b.rank}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 group hover:bg-surface-hover rounded-md px-2 py-2 transition-colors">
                    <span className="text-muted font-mono text-sm w-5 text-right">
                      {b.rank}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: b.teamColor || '#00D4FF' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {b.player || b.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="font-mono text-xs text-cyan">
                          {formatNumber(b.runs)} runs
                        </span>
                        <span className="font-mono text-xs text-muted">
                          SR {b.strikeRate ?? '—'}
                        </span>
                        {b.delta != null && (
                          <span
                            className={`flex items-center text-xs ${
                              b.delta >= 0 ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {b.delta >= 0 ? (
                              <IconArrowUpRight size={12} />
                            ) : (
                              <IconArrowDownRight size={12} />
                            )}
                            {Math.abs(b.delta)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-10 mr-2 mt-1 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan rounded-full transition-all duration-500"
                      style={{ width: `${b.proportion}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION D: Clutch Index + Analytics ── */}
      <section>
        <ClutchLeaderboard />
      </section>

      {/* ── SECTION E: Bottom 3 Columns ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Col 1: Wicket Heatmap */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Wicket Heatmap
          </h2>
          {loading ? <SkeletonBlock className="w-full h-52" /> : <WicketHeatmap />}
        </div>

        {/* Col 2: Economy Rate Leaders */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Economy Rate Leaders
          </h2>
          {loading ? (
            <SkeletonBlock className="w-full h-52" />
          ) : top5Bowlers.length === 0 ? (
            <p className="text-muted text-sm">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={top5Bowlers}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#6B7A99', fontSize: 11 }}
                  axisLine={{ stroke: '#1E2D4A' }}
                  domain={[0, 'auto']}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#E8EDF5', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                <Bar dataKey="economy" name="Economy" radius={[0, 4, 4, 0]} barSize={16}>
                  {top5Bowlers.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? '#F59E0B' : '#00D4FF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Col 3: Recent Match Results */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Recent Matches
          </h2>
          {loading ? (
            <SectionSkeleton rows={5} height="h-14" />
          ) : last5Matches.length === 0 ? (
            <p className="text-muted text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {last5Matches.map((match, idx) => (
                <MatchCard key={match.id || idx} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
