/**
 * Phase Analysis — breaks down T20 innings into four phases and
 * generates simulated phase-level stats from aggregate data.
 */

export const PHASES = [
  { name: 'Powerplay', overs: '1-6', key: 'powerplay' },
  { name: 'Middle', overs: '7-11', key: 'middle' },
  { name: 'Accelerator', overs: '12-16', key: 'accelerator' },
  { name: 'Death', overs: '17-20', key: 'death' },
];

/* ── deterministic seed from a string ── */
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ── seeded pseudo-random (Mulberry32) ── */
function seededRandom(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Phase multipliers (relative to overall average) ── */
const PHASE_SCORING_MULTIPLIERS = {
  powerplay: 1.15,
  middle: 0.85,
  accelerator: 0.95,
  death: 1.25,
};

const PHASE_WICKET_MULTIPLIERS = {
  powerplay: 0.9,
  middle: 1.1,
  accelerator: 1.0,
  death: 1.3,
};

const PHASE_BOUNDARY_MULTIPLIERS = {
  powerplay: 1.3,
  middle: 0.7,
  accelerator: 0.9,
  death: 1.4,
};

/**
 * Generate simulated phase stats for a team.
 *
 * @param {string} teamShortName - e.g. 'CSK', 'MI'
 * @param {Array}  allMatches    - matches dataset (used for win rate)
 * @param {Array}  allPlayers    - players dataset (used for profile)
 * @returns {{ phase: string, scoringRate: number, wicketLossRate: number, boundaryFrequency: number }[]}
 */
export function getTeamPhaseProfile(teamShortName, allMatches = [], allPlayers = []) {
  const rand = seededRandom(hashSeed(teamShortName));

  /* Derive a team strength factor from win rate (0.3–0.7 expected range) */
  const teamMatches = allMatches.filter(
    (m) =>
      m.team1 === teamShortName ||
      m.team2 === teamShortName ||
      (m.team1_short ?? '') === teamShortName ||
      (m.team2_short ?? '') === teamShortName,
  );
  const wins = teamMatches.filter(
    (m) => m.winner === teamShortName || (m.winner_short ?? '') === teamShortName,
  ).length;
  const winRate = teamMatches.length > 0 ? wins / teamMatches.length : 0.5;

  /* Count batters vs bowlers in squad for weighting */
  const squad = allPlayers.filter(
    (p) =>
      p.team === teamShortName ||
      (p.team_short ?? '') === teamShortName,
  );
  const avgSR =
    squad.reduce((s, p) => s + Number(p.strikeRate ?? p.strike_rate ?? 130), 0) /
      (squad.length || 1);

  /* Base scoring rate scaled by team strength */
  const baseScoringRate = 7 + winRate * 3 + (avgSR - 130) * 0.02;
  const baseWicketRate = 1.5 - winRate * 0.5;
  const baseBoundaryFreq = 1.2 + winRate * 0.8;

  return PHASES.map(({ name, key }) => {
    const jitter = 0.9 + rand() * 0.2;
    return {
      phase: name,
      scoringRate: parseFloat(
        Math.max(6, Math.min(12, baseScoringRate * PHASE_SCORING_MULTIPLIERS[key] * jitter)).toFixed(1),
      ),
      wicketLossRate: parseFloat(
        Math.max(0.5, Math.min(3, baseWicketRate * PHASE_WICKET_MULTIPLIERS[key] * jitter)).toFixed(1),
      ),
      boundaryFrequency: parseFloat(
        Math.max(0.5, Math.min(3, baseBoundaryFreq * PHASE_BOUNDARY_MULTIPLIERS[key] * jitter)).toFixed(1),
      ),
    };
  });
}

/**
 * Generate simulated phase stats for an individual player.
 *
 * @param {object} player - player record with runs, average, strikeRate, role, matches, etc.
 * @returns {{ phase: string, runs: number, average: number, strikeRate: number }[]}
 */
export function getPlayerPhaseProfile(player) {
  const name = player.name ?? player.player ?? 'Unknown';
  const rand = seededRandom(hashSeed(name));

  const totalRuns = Number(player.runs ?? player.totalRuns ?? 0);
  const overallAvg = Number(player.average ?? player.batting_average ?? 25);
  const overallSR = Number(player.strikeRate ?? player.strike_rate ?? 125);

  const role = (player.role ?? '').toLowerCase();

  /* Role-based phase distribution multipliers */
  const isAnchor = role.includes('batter') || role.includes('batsman');
  const isPower = role.includes('all') || role.includes('rounder');

  const runsDistribution = {
    powerplay: isAnchor ? 0.30 : isPower ? 0.22 : 0.25,
    middle: isAnchor ? 0.30 : isPower ? 0.25 : 0.28,
    accelerator: isAnchor ? 0.22 : isPower ? 0.28 : 0.25,
    death: isAnchor ? 0.18 : isPower ? 0.25 : 0.22,
  };

  const srMultipliers = {
    powerplay: isAnchor ? 1.0 : 1.15,
    middle: 0.85,
    accelerator: 1.0,
    death: isPower ? 1.35 : 1.2,
  };

  return PHASES.map(({ name: phaseName, key }) => {
    const jitter = 0.92 + rand() * 0.16;
    const phaseRuns = Math.round(totalRuns * runsDistribution[key] * jitter);
    const phaseAvg = parseFloat(Math.max(5, overallAvg * (0.8 + rand() * 0.4)).toFixed(1));
    const phaseSR = parseFloat(
      Math.max(80, Math.min(220, overallSR * srMultipliers[key] * jitter)).toFixed(1),
    );

    return {
      phase: phaseName,
      runs: phaseRuns,
      average: phaseAvg,
      strikeRate: phaseSR,
    };
  });
}
