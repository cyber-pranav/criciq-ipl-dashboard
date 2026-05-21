// src/utils/constants.js
// Shared constants for CricIQ — eliminates magic number duplication across 5+ files.

/**
 * All 10 current IPL franchises.
 * Single source of truth — imported by TeamAnalysis, HeadToHead, Analytics, formatters, etc.
 * @type {Array<{id: string, name: string, shortName: string, color: string}>}
 */
export const TEAMS = [
  { id: 'csk',  name: 'Chennai Super Kings',         shortName: 'CSK',  color: '#F9CD05' },
  { id: 'mi',   name: 'Mumbai Indians',              shortName: 'MI',   color: '#004BA0' },
  { id: 'rcb',  name: 'Royal Challengers Bengaluru', shortName: 'RCB',  color: '#EC1C24' },
  { id: 'kkr',  name: 'Kolkata Knight Riders',       shortName: 'KKR',  color: '#3A225D' },
  { id: 'dc',   name: 'Delhi Capitals',              shortName: 'DC',   color: '#004C93' },
  { id: 'pbks', name: 'Punjab Kings',                shortName: 'PBKS', color: '#ED1B24' },
  { id: 'rr',   name: 'Rajasthan Royals',            shortName: 'RR',   color: '#EA1A85' },
  { id: 'srh',  name: 'Sunrisers Hyderabad',         shortName: 'SRH',  color: '#FF822A' },
  { id: 'gt',   name: 'Gujarat Titans',              shortName: 'GT',   color: '#1C1C1C' },
  { id: 'lsg',  name: 'Lucknow Super Giants',        shortName: 'LSG',  color: '#A72056' },
];

/**
 * Quick lookup: team short name → hex color.
 * @type {Object<string, string>}
 */
export const TEAM_COLORS = Object.fromEntries(
  TEAMS.map((t) => [t.shortName, t.color])
);

/**
 * Over-phase breakpoints for phase analysis.
 * Matches the IPL standard phase definitions.
 */
export const PHASES = {
  POWERPLAY:    { label: 'Powerplay',    start: 1,  end: 6  },
  MIDDLE:       { label: 'Middle Overs', start: 7,  end: 11 },
  ACCELERATOR:  { label: 'Accelerator',  start: 12, end: 16 },
  DEATH:        { label: 'Death Overs',  start: 17, end: 20 },
};

/**
 * Clutch Index classification thresholds.
 * Elite (>= 8.5): 🟢 | Reliable (>= 6): 🟡 | Choker (< 6): 🔴
 */
export const CLUTCH_THRESHOLDS = {
  elite: 8.5,
  reliable: 6,
};

/**
 * Gemini API fetch timeout in milliseconds (10 seconds).
 * @type {number}
 */
export const API_TIMEOUT_MS = 10_000;

/**
 * Cache time-to-live in milliseconds (24 hours).
 * Used by Gemini response cache and Daily Digest cache.
 * @type {number}
 */
export const CACHE_TTL_MS = 86_400_000;

/**
 * Radar chart axis definitions for player profiles.
 */
export const RADAR_AXES = {
  batter:  ['Impact', 'Consistency', 'Power', 'Clutch', 'Longevity'],
  bowler:  ['Economy Control', 'Wicket-Taking', 'Death Mastery', 'Variation', 'Big Match'],
};

/**
 * Archetype classification rules.
 * First matching rule wins.
 * @type {Array<{label: string, emoji: string, condition: (scores: Object) => boolean}>}
 */
export const ARCHETYPES = [
  { label: 'Ice Man',          emoji: '❄️', condition: (s) => s.Clutch > 85 },
  { label: 'Explosive Hitter', emoji: '🔥', condition: (s) => s.Power > 80 && s.Consistency < 60 },
  { label: 'Anchor',           emoji: '🎯', condition: (s) => s.Consistency > 80 && s.Power < 50 },
  { label: 'Complete Batsman', emoji: '👑', condition: (s) => s.Impact > 70 && s.Consistency > 70 && s.Power > 60 },
  { label: 'Rising Star',      emoji: '⭐', condition: (s) => s.Impact > 60 && s.Longevity < 40 },
  { label: 'Veteran',          emoji: '🛡️', condition: (s) => s.Longevity > 80 },
];
