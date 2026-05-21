import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IconChevronDown,
  IconSwords,
  IconSparkles,
  IconTrendingUp,
  IconArrowRight,
} from '@tabler/icons-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import useIPLStore from '../store/useIPLStore';
import { getHeadToHead } from '../services/iplData';
import { askCricIQ } from '../services/gemini';
import { formatNumber } from '../utils/formatters';

/* ━━━ Constants ━━━ */
const TEAMS = [
  { id: 'csk', name: 'Chennai Super Kings', shortName: 'CSK', color: '#FFC107' },
  { id: 'mi', name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0' },
  { id: 'rcb', name: 'Royal Challengers Bengaluru', shortName: 'RCB', color: '#EC1C24' },
  { id: 'kkr', name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D' },
  { id: 'dc', name: 'Delhi Capitals', shortName: 'DC', color: '#17479E' },
  { id: 'pbks', name: 'Punjab Kings', shortName: 'PBKS', color: '#ED1B24' },
  { id: 'rr', name: 'Rajasthan Royals', shortName: 'RR', color: '#E73895' },
  { id: 'srh', name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#F26522' },
  { id: 'gt', name: 'Gujarat Titans', shortName: 'GT', color: '#1C1C1C' },
  { id: 'lsg', name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A72056' },
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
export default function HeadToHead() {
  const [teamA, setTeamA] = useState('csk');
  const [teamB, setTeamB] = useState('mi');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiPrediction, setAiPrediction] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const teamAInfo = TEAMS.find((t) => t.id === teamA) || TEAMS[0];
  const teamBInfo = TEAMS.find((t) => t.id === teamB) || TEAMS[1];

  /* ── Fetch head-to-head data ── */
  useEffect(() => {
    if (teamA === teamB) {
      setData(null);
      return;
    }
    setLoading(true);
    setAiPrediction('');
    const raw = getHeadToHead(teamAInfo.shortName, teamBInfo.shortName);
    // Map to component's expected shape
    const mapped = {
      teamAWins: raw.team1Wins,
      teamBWins: raw.team2Wins,
      draws: raw.noResult,
      totalMatches: raw.matches,
      encounters: (raw.recentMatches || []).map((m) => ({
        date: m.date,
        season: m.season,
        venue: m.venue,
        winner: m.winner,
        margin: m.win_by_runs || m.win_by_wickets || 0,
        marginType: m.win_by_runs ? 'runs' : 'wickets',
        id: m.id,
      })),
      keyBattles: [],
    };
    setData(mapped);
    setLoading(false);
  }, [teamA, teamB, teamAInfo.shortName, teamBInfo.shortName]);

  /* ── AI Prediction ── */
  const handleAiPredict = async () => {
    setAiLoading(true);
    try {
      const prompt = `Based on IPL history, head-to-head records, and recent form, who would likely win between ${teamAInfo.name} and ${teamBInfo.name}? Give a brief analysis in 3-4 sentences.`;
      const response = await askCricIQ(prompt);
      setAiPrediction(response);
    } catch {
      setAiPrediction('Unable to generate prediction. Please try again.');
    }
    setAiLoading(false);
  };

  /* ── All-time record bar ── */
  const totalGames = (data?.teamAWins ?? 0) + (data?.teamBWins ?? 0) + (data?.draws ?? 0);
  const teamAPercent = totalGames ? ((data?.teamAWins ?? 0) / totalGames) * 100 : 0;
  const drawPercent = totalGames ? ((data?.draws ?? 0) / totalGames) * 100 : 0;
  const teamBPercent = totalGames ? ((data?.teamBWins ?? 0) / totalGames) * 100 : 0;

  /* ── Last 5 encounters ── */
  const last5 = useMemo(() => {
    return (data?.encounters || []).slice(0, 5);
  }, [data]);

  /* ── Run margin chart data ── */
  const marginData = useMemo(() => {
    return (data?.encounters || []).map((e) => ({
      match: e.date || e.season || e.id,
      margin: e.margin ?? 0,
      winner: e.winner,
    })).reverse();
  }, [data]);

  /* ── Key player battles ── */
  const battles = useMemo(() => {
    return data?.keyBattles || [];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* ── Team Selectors ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Team A */}
        <div className="flex-1 w-full">
          <div className="relative">
            <select
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              className="w-full appearance-none bg-surface border border-border text-text rounded-lg px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:border-cyan cursor-pointer"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <IconChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-border bg-surface flex-shrink-0">
          <span className="text-amber font-bold text-lg">VS</span>
        </div>

        {/* Team B */}
        <div className="flex-1 w-full">
          <div className="relative">
            <select
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              className="w-full appearance-none bg-surface border border-border text-text rounded-lg px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:border-cyan cursor-pointer"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <IconChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {teamA === teamB && (
        <div className="bg-surface border border-border rounded-lg p-8 text-center text-muted">
          <IconSwords size={40} className="mx-auto mb-3 opacity-40" />
          <p>Select two different teams to see head-to-head stats.</p>
        </div>
      )}

      {teamA !== teamB && loading && (
        <div className="space-y-4">
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-64 w-full" />
          <SkeletonBlock className="h-48 w-full" />
        </div>
      )}

      {teamA !== teamB && !loading && data && (
        <>
          {/* ── All-time Record Bar ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              All-Time Record
            </h2>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium" style={{ color: teamAInfo.color }}>
                {teamAInfo.shortName}: {data.teamAWins ?? 0}
              </span>
              <span className="flex-1" />
              {(data.draws ?? 0) > 0 && (
                <span className="text-sm text-muted">
                  NR: {data.draws}
                </span>
              )}
              <span className="flex-1" />
              <span className="text-sm font-medium" style={{ color: teamBInfo.color }}>
                {teamBInfo.shortName}: {data.teamBWins ?? 0}
              </span>
            </div>
            <div className="flex h-6 rounded overflow-hidden border border-border">
              <div
                className="transition-all duration-500"
                style={{ width: `${teamAPercent}%`, background: teamAInfo.color }}
              />
              {drawPercent > 0 && (
                <div
                  className="transition-all duration-500 bg-border"
                  style={{ width: `${drawPercent}%` }}
                />
              )}
              <div
                className="transition-all duration-500"
                style={{ width: `${teamBPercent}%`, background: teamBInfo.color }}
              />
            </div>
            <p className="text-xs text-muted mt-2 text-center">
              {totalGames} matches played
            </p>
          </div>

          {/* ── Last 5 Encounters ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Last 5 Encounters
            </h2>
            {last5.length > 0 ? (
              <div className="space-y-3">
                {last5.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 text-xs text-muted font-mono w-20">
                      {e.date || e.season}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text">
                        <span style={{ color: teamAInfo.color }}>{teamAInfo.shortName}</span>
                        {' vs '}
                        <span style={{ color: teamBInfo.color }}>{teamBInfo.shortName}</span>
                      </p>
                      <p className="text-xs text-muted mt-0.5">{e.venue || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text">{e.winner || '—'}</p>
                      <p className="text-xs text-muted font-mono">
                        {e.margin ? `by ${e.margin} ${e.marginType || 'runs'}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">No encounter data available</p>
            )}
          </div>

          {/* ── Key Player Battles ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Key Player Battles
            </h2>
            {battles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {battles.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-navy border border-border rounded-lg p-3">
                    <div className="flex-1 text-right">
                      <p className="text-sm font-medium text-text">{b.player1 || b.batsman}</p>
                      <p className="text-xs text-muted capitalize">{b.role1 || 'Batsman'}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0">
                      <IconSwords size={14} className="text-amber" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text">{b.player2 || b.bowler}</p>
                      <p className="text-xs text-muted capitalize">{b.role2 || 'Bowler'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">No battle data available</p>
            )}
          </div>

          {/* ── Run Margin Over Time ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Run Margin Over Time
            </h2>
            {marginData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={marginData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                  <XAxis dataKey="match" tick={{ fill: '#6B7A99', fontSize: 10 }} axisLine={{ stroke: '#1E2D4A' }} />
                  <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={{ stroke: '#1E2D4A' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="margin"
                    name="Margin"
                    stroke="#00D4FF"
                    fill="#00D4FF"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-sm">No margin data available</p>
            )}
          </div>

          {/* ── AI Prediction ── */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  <IconSparkles size={16} className="inline mr-1.5 text-cyan" />
                  AI Match Prediction
                </h2>
                <p className="text-xs text-muted mt-1">Powered by Gemini</p>
              </div>
              <button
                onClick={handleAiPredict}
                disabled={aiLoading}
                className="inline-flex items-center gap-2 bg-cyan text-navy font-semibold text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <IconSparkles size={16} />
                    Who will win today?
                  </>
                )}
              </button>
            </div>

            {aiPrediction && (
              <div className="chat-ai mt-4">
                <p className="text-sm leading-relaxed">{aiPrediction}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
