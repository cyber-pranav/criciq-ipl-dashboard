/**
 * Clutch Index — measures a player's ability to perform under pressure.
 *
 * Batting Clutch (0-10):
 *   (strikeRate / 200) * 3
 * + (average / 60) * 2.5
 * + (fifties * 0.15 + hundreds * 0.5)
 * + (matches > 100 ? 2 : matches / 50)
 *
 * Bowling Clutch (0-10):
 *   ((12 - economy) / 12) * 3
 * + (wickets / 200) * 3
 * + (matches > 80 ? 2 : matches / 40)
 * + (economy < 7.5 ? 2 : 0)
 */

const CLUTCH_CATEGORIES = {
  elite: { label: 'Elite Closer', color: '#10B981', min: 7 },
  reliable: { label: 'Reliable', color: '#F59E0B', min: 4 },
  inconsistent: { label: 'Inconsistent', color: '#EF4444', min: 0 },
};

function clamp(value, min = 0, max = 10) {
  return Math.min(max, Math.max(min, value));
}

function categorize(score) {
  if (score >= CLUTCH_CATEGORIES.elite.min) {
    return { category: CLUTCH_CATEGORIES.elite.label, color: CLUTCH_CATEGORIES.elite.color };
  }
  if (score >= CLUTCH_CATEGORIES.reliable.min) {
    return { category: CLUTCH_CATEGORIES.reliable.label, color: CLUTCH_CATEGORIES.reliable.color };
  }
  return { category: CLUTCH_CATEGORIES.inconsistent.label, color: CLUTCH_CATEGORIES.inconsistent.color };
}

export function calculateBattingClutch(player) {
  const strikeRate = Number(player.strikeRate ?? player.strike_rate ?? 0);
  const average = Number(player.average ?? player.batting_average ?? 0);
  const fifties = Number(player.fifties ?? player.fiftys ?? 0);
  const hundreds = Number(player.hundreds ?? 0);
  const matches = Number(player.matches ?? player.matchesPlayed ?? 0);

  const srComponent = (strikeRate / 200) * 3;
  const avgComponent = (average / 60) * 2.5;
  const milestoneComponent = fifties * 0.15 + hundreds * 0.5;
  const expComponent = matches > 100 ? 2 : matches / 50;

  const raw = srComponent + avgComponent + milestoneComponent + expComponent;
  const score = parseFloat(clamp(raw).toFixed(1));
  const { category, color } = categorize(score);

  return { score, category, color };
}

export function calculateBowlingClutch(player) {
  const economy = Number(player.economy ?? player.economyRate ?? 0);
  const wickets = Number(player.wickets ?? 0);
  const matches = Number(player.matches ?? player.matchesPlayed ?? 0);

  const ecoComponent = ((12 - Math.min(economy, 12)) / 12) * 3;
  const wicketComponent = (wickets / 200) * 3;
  const expComponent = matches > 80 ? 2 : matches / 40;
  const bonusComponent = economy > 0 && economy < 7.5 ? 2 : 0;

  const raw = ecoComponent + wicketComponent + expComponent + bonusComponent;
  const score = parseFloat(clamp(raw).toFixed(1));
  const { category, color } = categorize(score);

  return { score, category, color };
}

export function getClutchLeaderboard(players, type = 'batting', limit = 10) {
  const calcFn = type === 'batting' ? calculateBattingClutch : calculateBowlingClutch;

  return players
    .map((player) => {
      const { score, category, color } = calcFn(player);
      return {
        ...player,
        clutchScore: score,
        clutchCategory: category,
        clutchColor: color,
      };
    })
    .sort((a, b) => b.clutchScore - a.clutchScore)
    .slice(0, limit);
}
