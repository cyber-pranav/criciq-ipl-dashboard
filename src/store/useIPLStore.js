// src/store/useIPLStore.js
// Zustand store for CricIQ dashboard state management
import { create } from 'zustand';
import {
  getAllPlayers,
  getTeams,
  getSeasonStats,
  getTopBatsmen,
  getTopBowlers,
  getRecentMatches,
  getLiveMatches,
} from '../services/iplData';

const useIPLStore = create((set, get) => ({
  // ── State ──────────────────────────────────────
  selectedSeason: 2024,
  players: [],
  teams: [],
  seasonStats: null,
  topBatsmen: [],
  topBowlers: [],
  recentMatches: [],
  liveMatches: [],
  searchQuery: '',
  isLoading: true,
  chatMessages: [],
  selectedTeam1: null,
  selectedTeam2: null,

  // ── Actions ────────────────────────────────────

  /**
   * Change the active season and refresh all season-dependent data.
   */
  setSeason: (year) => {
    const season = Number(year);
    set({
      selectedSeason: season,
      seasonStats: getSeasonStats(season),
      topBatsmen: getTopBatsmen(season, 5),
      topBowlers: getTopBowlers(season, 5),
    });
  },

  /**
   * Update the global search query.
   */
  setSearchQuery: (q) => {
    set({ searchQuery: q });
  },

  /**
   * Bootstrap the dashboard: loads all initial data from iplData.js.
   * Call once on app mount.
   */
  loadDashboardData: () => {
    const { selectedSeason } = get();
    set({
      players: getAllPlayers(),
      teams: getTeams(),
      seasonStats: getSeasonStats(selectedSeason),
      topBatsmen: getTopBatsmen(selectedSeason, 5),
      topBowlers: getTopBowlers(selectedSeason, 5),
      recentMatches: getRecentMatches(5),
      liveMatches: getLiveMatches(),
      isLoading: false,
    });
  },

  /**
   * Append a chat message to the AI chat history.
   * @param {{ role: 'user'|'assistant', text: string, timestamp?: number }} msg
   */
  addChatMessage: (msg) => {
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...msg, timestamp: msg.timestamp || Date.now() },
      ],
    }));
  },

  /**
   * Set teams for the head-to-head comparison view.
   * @param {string|null} team1  short name, e.g. 'MI'
   * @param {string|null} team2  short name, e.g. 'CSK'
   */
  setTeamComparison: (team1, team2) => {
    set({ selectedTeam1: team1, selectedTeam2: team2 });
  },

  /**
   * Manually set loading state.
   */
  setLoading: (bool) => {
    set({ isLoading: bool });
  },
}));

export default useIPLStore;
