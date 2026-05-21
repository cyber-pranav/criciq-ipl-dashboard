// src/hooks/useMatchData.js
// Custom hook for match data, live tickers and venue statistics
import { useState, useEffect, useMemo } from 'react';
import {
  getRecentMatches,
  getLiveMatches,
  getMatchesByVenue,
  MATCHES_DATA,
} from '../services/iplData';

/**
 * Custom hook that returns recent matches, live ticker data,
 * and aggregated venue statistics.
 *
 * @returns {{
 *   recentMatches: Array,
 *   liveMatches: Array,
 *   venueStats: Array,
 *   loading: boolean
 * }}
 */
export default function useMatchData() {
  const [recentMatches, setRecentMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRecentMatches(getRecentMatches(5));
      setLiveMatches(getLiveMatches());
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Aggregate venue statistics from the entire match history.
   * For each venue: total matches, average winning margin,
   * most successful team, and most frequent player_of_match.
   */
  const venueStats = useMemo(() => {
    const venueMap = {};

    MATCHES_DATA.forEach((m) => {
      if (!venueMap[m.venue]) {
        venueMap[m.venue] = {
          venue: m.venue,
          city: m.city,
          totalMatches: 0,
          teamWins: {},
          playerAwards: {},
          totalRunMargin: 0,
          runWinCount: 0,
          totalWicketMargin: 0,
          wicketWinCount: 0,
        };
      }
      const v = venueMap[m.venue];
      v.totalMatches += 1;

      // Track team wins
      if (m.winner) {
        v.teamWins[m.winner] = (v.teamWins[m.winner] || 0) + 1;
      }

      // Track player of match
      if (m.player_of_match) {
        v.playerAwards[m.player_of_match] =
          (v.playerAwards[m.player_of_match] || 0) + 1;
      }

      // Track margins
      if (m.win_by_runs > 0) {
        v.totalRunMargin += m.win_by_runs;
        v.runWinCount += 1;
      }
      if (m.win_by_wickets > 0) {
        v.totalWicketMargin += m.win_by_wickets;
        v.wicketWinCount += 1;
      }
    });

    return Object.values(venueMap)
      .map((v) => {
        // Find most successful team at venue
        const topTeamEntry = Object.entries(v.teamWins).sort(
          (a, b) => b[1] - a[1]
        )[0];
        // Find most awarded player at venue
        const topPlayerEntry = Object.entries(v.playerAwards).sort(
          (a, b) => b[1] - a[1]
        )[0];

        return {
          venue: v.venue,
          city: v.city,
          totalMatches: v.totalMatches,
          avgRunMargin: v.runWinCount
            ? Math.round(v.totalRunMargin / v.runWinCount)
            : 0,
          avgWicketMargin: v.wicketWinCount
            ? parseFloat(
                (v.totalWicketMargin / v.wicketWinCount).toFixed(1)
              )
            : 0,
          mostSuccessfulTeam: topTeamEntry
            ? { team: topTeamEntry[0], wins: topTeamEntry[1] }
            : null,
          topPerformer: topPlayerEntry
            ? { player: topPlayerEntry[0], awards: topPlayerEntry[1] }
            : null,
        };
      })
      .sort((a, b) => b.totalMatches - a.totalMatches);
  }, []);

  return { recentMatches, liveMatches, venueStats, loading };
}
