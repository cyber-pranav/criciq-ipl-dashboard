/**
 * Clutch Index — measures a player's ability to perform under pressure.
 *
 * Master Prompt Formula (Batting):
 *   (Death Over SR / Overall SR) × 1.5
 * + (Playoff SR / Group SR) × 1.3
 * + (Chase Wins / Chase Innings) × 1.2
 * - (Duck % in pressure) × 0.8
 *
 * Since we don't have granular phase data, we approximate:
 *   (strikeRate / 130) × 1.5           ← higher SR = better finisher
 * + (average / 35) × 1.3               ← consistency under pressure
 * + (fifties * 0.12 + hundreds * 0.6)  ← clutch milestones
 * + (matches > 100 ? 2 : matches / 50) ← experience factor
 *
 * Scaled to 0-10 range.
 *
 * Classification (Section 1.3):
 *   🟢 Elite (>= 8.5)   — "Ice Man"
 *   🟡 Reliable (>= 6)  — "Dependable"
 *   🔴 Choker (< 6)     — "Pressure Wilts"
 */

import { CLUTCH_THRESHOLDS } from './constants';

/**
 * Clamp a value to [min, max].
 * @param {number} value
 * @param {number} [min=0]
 * @param {number} [max=10]
 * @returns {number}
 */
function clamp(value, min = 0, max = 10) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Categorize a clutch score using the Master Prompt thresholds.
 * @param {number} score - 0-10 clutch score
 * @returns {{ category: string, color: string, emoji: string, badge: string }}
 */
function categorize(score) {
  if (score >= CLUTCH_THRESHOLDS.elite) {
    return { category: 'Elite Closer', color: '#10B981', emoji: '🟢', badge: 'elite' };
  }
  if (score >= CLUTCH_THRESHOLDS.reliable) {
    return { category: 'Reliable', color: '#F59E0B', emoji: '🟡', badge: 'reliable' };
  }
  return { category: 'Choker', color: '#EF4444', emoji: '🔴', badge: 'choker' };
}

/**
 * Calculate the Batting Clutch Index for a player.
 *
 * @param {Object} player - Player object with strikeRate, average, fifties, hundreds, matches
 * @returns {{ score: number, category: string, color: string, emoji: string, badge: string }}
 */
export function calculateBattingClutch(player) {
  const strikeRate = Number(player.strikeRate ?? player.strike_rate ?? 0);
  const average = Number(player.average ?? player.batting_average ?? 0);
  const fifties = Number(player.fifties ?? player.fiftys ?? 0);
  const hundreds = Number(player.hundreds ?? 0);
  const matches = Number(player.matches ?? player.matchesPlayed ?? 0);

  // Death-over finishing proxy: SR relative to IPL average (~130)
  const deathProxy = (strikeRate / 130) * 1.5;
  // Consistency proxy: batting average relative to IPL average (~35)
  const consistencyProxy = (average / 35) * 1.3;
  // Clutch milestone proxy
  const milestoneProxy = fifties * 0.12 + hundreds * 0.6;
  // Experience factor
  const expProxy = matches > 100 ? 2 : matches / 50;

  const raw = deathProxy + consistencyProxy + milestoneProxy + expProxy;
  const score = parseFloat(clamp(raw).toFixed(1));
  const { category, color, emoji, badge } = categorize(score);

  return { score, category, color, emoji, badge };
}

/**
 * Calculate the Bowling Clutch Index for a player.
 *
 * @param {Object} player - Player object with economy, wickets, matches
 * @returns {{ score: number, category: string, color: string, emoji: string, badge: string }}
 */
export function calculateBowlingClutch(player) {
  const economy = Number(player.economy ?? player.economyRate ?? 0);
  const wickets = Number(player.wickets ?? 0);
  const matches = Number(player.matches ?? player.matchesPlayed ?? 0);

  // Death-mastery proxy: economy control
  const ecoProxy = ((12 - Math.min(economy, 12)) / 12) * 3;
  // Wicket-taking ability relative to 200-wicket mark
  const wicketProxy = (wickets / 200) * 3;
  // Experience factor
  const expProxy = matches > 80 ? 2 : matches / 40;
  // Elite economy bonus
  const bonusProxy = economy > 0 && economy < 7.5 ? 2 : 0;

  const raw = ecoProxy + wicketProxy + expProxy + bonusProxy;
  const score = parseFloat(clamp(raw).toFixed(1));
  const { category, color, emoji, badge } = categorize(score);

  return { score, category, color, emoji, badge };
}

/**
 * Generate a Clutch Index leaderboard from a list of players.
 *
 * @param {Array} players - Array of player objects
 * @param {'batting'|'bowling'} [type='batting'] - Which clutch metric to use
 * @param {number} [limit=10] - Max players to return
 * @returns {Array} Sorted array of players with clutchScore, clutchCategory, clutchColor, clutchEmoji, clutchBadge
 */
export function getClutchLeaderboard(players, type = 'batting', limit = 10) {
  const calcFn = type === 'batting' ? calculateBattingClutch : calculateBowlingClutch;

  return players
    .map((player) => {
      const { score, category, color, emoji, badge } = calcFn(player);
      return {
        ...player,
        clutchScore: score,
        clutchCategory: category,
        clutchColor: color,
        clutchEmoji: emoji,
        clutchBadge: badge,
      };
    })
    .sort((a, b) => b.clutchScore - a.clutchScore)
    .slice(0, limit);
}
