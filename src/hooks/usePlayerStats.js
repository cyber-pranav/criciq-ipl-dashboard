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

  // Radar data — role-specific axes per Master Prompt spec
  const radarData = useMemo(() => {
    if (!player) return [];
    const clamp = (v) => Math.min(100, Math.max(0, Math.round(v)));
    const isBowler = (player.role || '').toLowerCase() === 'bowler';

    if (isBowler) {
      // Bowler axes: Economy Control, Wicket-Taking, Death Mastery, Variation, Big Match
      return [
        { stat: 'Economy Control', value: clamp(((12 - (player.economy || 8)) / 12) * 100), fullMark: 100 },
        { stat: 'Wicket-Taking',   value: clamp(((player.wickets || 0) / 200) * 100), fullMark: 100 },
        { stat: 'Death Mastery',   value: clamp(((player.economy || 8) < 8 ? 80 : 40) + ((player.wickets || 0) / 250) * 20), fullMark: 100 },
        { stat: 'Variation',       value: clamp(((player.matches || 0) / 200) * 60 + ((player.wickets || 0) / 200) * 40), fullMark: 100 },
        { stat: 'Big Match',       value: clamp(((player.wickets || 0) / 180) * 70 + ((player.matches || 0) > 100 ? 30 : 15)), fullMark: 100 },
      ];
    }

    // Batter/All-rounder axes: Impact, Consistency, Power, Clutch, Longevity
    return [
      { stat: 'Impact',      value: clamp((((player.fifties || 0) + (player.hundreds || 0) * 3) / 70) * 100), fullMark: 100 },
      { stat: 'Consistency', value: clamp(((player.average || 0) / 50) * 100), fullMark: 100 },
      { stat: 'Power',       value: clamp(((player.strikeRate || 0) / 180) * 100), fullMark: 100 },
      { stat: 'Clutch',      value: clamp(((player.strikeRate || 0) / 200) * 50 + ((player.average || 0) / 60) * 50), fullMark: 100 },
      { stat: 'Longevity',   value: clamp(((player.matches || 0) / 250) * 100), fullMark: 100 },
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

  // Performance vs each team (deterministic simulation from player + team indices)
  const teamRecord = useMemo(() => {
    if (!player) return [];
    const teams = TEAMS_DATA || [];
    // Seeded PRNG: produces deterministic values per player+team combo
    const seeded = (a, b) => {
      const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return teams
      .filter((t) => t.shortName !== player.team)
      .slice(0, 8)
      .map((t, idx) => ({
        team: t.shortName,
        matches: Math.floor(seeded(player.id, idx * 1) * 15) + 5,
        runs: Math.floor(seeded(player.id, idx * 2) * 400) + 100,
        average: (seeded(player.id, idx * 3) * 30 + 15).toFixed(1),
        strikeRate: (seeded(player.id, idx * 4) * 40 + 110).toFixed(1),
        best: Math.floor(seeded(player.id, idx * 5) * 60 + 30) + (seeded(player.id, idx * 6) > 0.5 ? '*' : ''),
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
