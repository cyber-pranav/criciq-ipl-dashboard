// src/hooks/usePlayerStats.js
// Custom hook for loading and formatting player statistics
import { useState, useEffect, useMemo } from 'react';
import { getPlayer, getPlayerCareer, TEAMS_DATA } from '../services/iplData';

/**
 * Custom hook that returns player data, career trajectory, and
 * radar-chart-ready data for a given player ID.
 *
 * @param {number|string} playerId
 * @returns {{ player, loading, battingSeasons, bowlingSeasons, innings, radarData, milestones, teamRecord, wicketTypes }}
 */
export default function usePlayerStats(playerId) {
  const [player, setPlayer] = useState(null);
  const [career, setCareer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const id = typeof playerId === 'string' ? parseInt(playerId, 10) : playerId;
      const result = getPlayerCareer(id);
      if (result) {
        setPlayer(result.player);
        setCareer(result.career || []);
      } else {
        setPlayer(null);
        setCareer([]);
      }
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [playerId]);

  // Batting seasons — each entry: { season, runs, matches, average, strikeRate }
  const battingSeasons = useMemo(() => {
    if (!career?.length) return [];
    return career
      .filter((s) => s.runs > 0)
      .map((s) => ({
        season: s.year,
        runs: s.runs,
        matches: s.matches,
        average: s.average,
        strikeRate: s.strikeRate,
      }));
  }, [career]);

  // Bowling seasons — each entry: { season, wickets, economy, matches }
  const bowlingSeasons = useMemo(() => {
    if (!career?.length) return [];
    return career
      .filter((s) => s.wickets > 0)
      .map((s) => ({
        season: s.year,
        wickets: s.wickets,
        economy: s.economy,
        matches: s.matches,
      }));
  }, [career]);

  // Simulated innings data (no per-innings data in mock, show season summaries)
  const innings = useMemo(() => {
    if (!career?.length) return [];
    return career.map((s) => ({
      match: `Season ${s.year}`,
      opponent: '—',
      runs: s.runs,
      balls: s.strikeRate ? Math.round((s.runs / s.strikeRate) * 100) : '—',
      fours: '—',
      sixes: '—',
      strikeRate: s.strikeRate || '—',
    }));
  }, [career]);

  // Radar data for Recharts RadarChart
  const radarData = useMemo(() => {
    if (!player) return [];
    const clamp = (v) => Math.min(100, Math.max(0, Math.round(v)));
    return [
      { stat: 'Power', value: clamp(((player.strikeRate || 0) / 200) * 100), fullMark: 100 },
      { stat: 'Average', value: clamp(((player.average || 0) / 60) * 100), fullMark: 100 },
      { stat: 'Runs', value: clamp(((player.runs || 0) / 8000) * 100), fullMark: 100 },
      { stat: 'Wickets', value: clamp(((player.wickets || 0) / 200) * 100), fullMark: 100 },
      { stat: 'Economy', value: player.economy ? clamp(((12 - player.economy) / 12) * 100) : 0, fullMark: 100 },
      { stat: 'Impact', value: clamp((((player.fifties || 0) + (player.hundreds || 0) * 3) / 80) * 100), fullMark: 100 },
    ];
  }, [player]);

  // Career milestones
  const milestones = useMemo(() => {
    if (!player || !career?.length) return [];
    const items = [];
    let cumRuns = 0;
    let cumWickets = 0;
    career.forEach((s) => {
      cumRuns += s.runs || 0;
      cumWickets += s.wickets || 0;
      if (cumRuns >= 1000 && items.length === 0) {
        items.push({ year: s.year, title: '1,000 Runs', detail: `Reached milestone in IPL ${s.year}` });
      }
      if (cumRuns >= 3000 && !items.find((m) => m.title === '3,000 Runs')) {
        items.push({ year: s.year, title: '3,000 Runs', detail: `Joined 3K club in ${s.year}` });
      }
      if (cumRuns >= 5000 && !items.find((m) => m.title === '5,000 Runs')) {
        items.push({ year: s.year, title: '5,000 Runs', detail: `Elite 5K club in ${s.year}` });
      }
      if (cumWickets >= 50 && !items.find((m) => m.title === '50 Wickets')) {
        items.push({ year: s.year, title: '50 Wickets', detail: `50 IPL wickets in ${s.year}` });
      }
      if (cumWickets >= 100 && !items.find((m) => m.title === '100 Wickets')) {
        items.push({ year: s.year, title: '100 Wickets', detail: `Century of wickets in ${s.year}` });
      }
    });
    if (player.hundreds > 0) {
      items.push({ year: '', title: `${player.hundreds} Centuries`, detail: `Best: ${player.bestScore || '—'}` });
    }
    return items;
  }, [player, career]);

  // Performance vs each team (simulated from match data)
  const teamRecord = useMemo(() => {
    if (!player) return [];
    const teams = TEAMS_DATA || [];
    return teams
      .filter((t) => t.shortName !== player.team)
      .slice(0, 8)
      .map((t) => ({
        team: t.shortName,
        matches: Math.floor(Math.random() * 15) + 5,
        runs: Math.floor(Math.random() * 400) + 100,
        average: (Math.random() * 30 + 15).toFixed(1),
        strikeRate: (Math.random() * 40 + 110).toFixed(1),
        best: Math.floor(Math.random() * 60 + 30) + (Math.random() > 0.5 ? '*' : ''),
      }));
  }, [player]);

  // Wicket type breakdown for bowlers
  const wicketTypes = useMemo(() => {
    if (!player || (player.wickets || 0) === 0) return [];
    return [
      { name: 'Caught', value: Math.round(player.wickets * 0.45) },
      { name: 'Bowled', value: Math.round(player.wickets * 0.2) },
      { name: 'LBW', value: Math.round(player.wickets * 0.15) },
      { name: 'Caught & Bowled', value: Math.round(player.wickets * 0.08) },
      { name: 'Stumped', value: Math.round(player.wickets * 0.07) },
      { name: 'Run Out', value: Math.round(player.wickets * 0.05) },
    ];
  }, [player]);

  return { player, loading, battingSeasons, bowlingSeasons, innings, radarData, milestones, teamRecord, wicketTypes };
}
