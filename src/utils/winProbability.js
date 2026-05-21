/**
 * Win Probability & Momentum — generates simulated ball-by-ball win
 * probability curves and cumulative run-rate momentum data for a match.
 */

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

/**
 * Format a ball index (0-119) into over.ball notation.
 * @param {number} idx - 0-based ball index
 * @returns {string} e.g. '1.1', '20.0'
 */
function formatOver(idx) {
  const over = Math.floor(idx / 6) + 1;
  const ball = (idx % 6) + 1;
  if (ball === 6 && over < 20) return `${over}.6`;
  if (ball === 6 && over === 20) return '20.0';
  return `${over}.${ball}`;
}

/**
 * Generate a ball-by-ball win probability curve for a match.
 *
 * @param {object} match - { team1, team2, winner, win_by_runs, win_by_wickets }
 * @returns {{ ball: number, over: string, team1Prob: number, team2Prob: number }[]}
 */
export function generateWinProbability(match) {
  const team1 = match.team1 ?? 'Team A';
  const team2 = match.team2 ?? 'Team B';
  const winner = match.winner ?? team1;
  const winByRuns = Number(match.win_by_runs ?? match.winByRuns ?? 0);
  const winByWickets = Number(match.win_by_wickets ?? match.winByWickets ?? 0);

  const team1Wins = winner === team1;
  const totalBalls = 120;
  const seed = hashSeed(`${team1}${team2}${winner}${winByRuns}${winByWickets}`);
  const rand = seededRandom(seed);

  /* Margin affects how quickly the curve separates.
     Big margin → early separation; small margin → stays tight longer. */
  const margin = Math.max(winByRuns, winByWickets * 8);
  const dominance = Math.min(margin / 80, 1);

  const data = [];
  let team1Prob = 50;

  for (let i = 0; i < totalBalls; i++) {
    const progress = i / (totalBalls - 1); // 0 → 1

    /* Target probability at this point in the match */
    const targetProb = team1Wins
      ? 50 + 45 * Math.pow(progress, 1.2 - dominance * 0.5)
      : 50 - 45 * Math.pow(progress, 1.2 - dominance * 0.5);

    /* Sine-wave swings simulate momentum shifts */
    const swing1 = Math.sin(progress * Math.PI * 3.5) * 8 * (1 - progress);
    const swing2 = Math.sin(progress * Math.PI * 7 + 1.2) * 4 * (1 - progress);

    /* Random noise that decreases as the match nears conclusion */
    const noise = (rand() - 0.5) * 12 * (1 - progress * 0.8);

    /* Blend toward target with increasing weight */
    const blend = 0.15 + progress * 0.85;
    team1Prob = team1Prob * (1 - blend) + (targetProb + swing1 + swing2 + noise) * blend;

    /* Clamp */
    team1Prob = Math.max(2, Math.min(98, team1Prob));

    /* Final few balls → force convergence */
    if (i >= totalBalls - 6) {
      const finalTarget = team1Wins ? 95 : 5;
      const finalBlend = (i - (totalBalls - 6)) / 5;
      team1Prob = team1Prob * (1 - finalBlend) + finalTarget * finalBlend;
    }

    const t1 = parseFloat(team1Prob.toFixed(1));

    data.push({
      ball: i + 1,
      over: formatOver(i),
      team1Prob: t1,
      team2Prob: parseFloat((100 - t1).toFixed(1)),
    });
  }

  return data;
}

/**
 * Generate cumulative momentum (worm) data for a match.
 *
 * @param {object} match - { team1, team2, winner, win_by_runs, win_by_wickets }
 * @returns {{ over: number, team1Runs: number, team2Runs: number }[]}
 */
export function generateMomentumData(match) {
  const team1 = match.team1 ?? 'Team A';
  const team2 = match.team2 ?? 'Team B';
  const winner = match.winner ?? team1;
  const winByRuns = Number(match.win_by_runs ?? match.winByRuns ?? 0);

  const team1Wins = winner === team1;
  const seed = hashSeed(`momentum-${team1}${team2}${winner}`);
  const rand = seededRandom(seed);

  /* Phase run-rate templates (runs per over) */
  const phaseRates = [
    7.5, 7.8, 8.0, 7.2, 7.0, 7.5,   // Powerplay (1-6)
    6.5, 6.0, 6.2, 6.8, 7.0,         // Middle (7-11)
    7.5, 8.0, 8.5, 8.2, 7.8,         // Accelerator (12-16)
    9.0, 10.0, 10.5, 11.0,           // Death (17-20)
  ];

  /* Derive approximate innings totals */
  const winnerTotal = 160 + rand() * 40;
  const loserTotal = team1Wins
    ? winnerTotal - Math.max(winByRuns, 5 + rand() * 20)
    : winnerTotal;
  const t1Total = team1Wins ? winnerTotal : loserTotal;
  const t2Total = team1Wins ? loserTotal : winnerTotal;

  let t1Cum = 0;
  let t2Cum = 0;
  const data = [];

  for (let over = 1; over <= 20; over++) {
    const baseRate = phaseRates[over - 1];

    /* Team 1 over scoring */
    const t1Jitter = 0.7 + rand() * 0.6;
    const t1OverRuns = baseRate * t1Jitter * (t1Total / 170);
    t1Cum += Math.round(t1OverRuns);

    /* Team 2 over scoring */
    const t2Jitter = 0.7 + rand() * 0.6;
    const t2OverRuns = baseRate * t2Jitter * (t2Total / 170);
    t2Cum += Math.round(t2OverRuns);

    data.push({
      over,
      team1Runs: t1Cum,
      team2Runs: t2Cum,
    });
  }

  /* Normalize so final totals are realistic */
  const t1Scale = Math.round(t1Total) / (t1Cum || 1);
  const t2Scale = Math.round(t2Total) / (t2Cum || 1);

  let t1Running = 0;
  let t2Running = 0;

  return data.map((d, i) => {
    const prevT1 = i > 0 ? data[i - 1].team1Runs : 0;
    const prevT2 = i > 0 ? data[i - 1].team2Runs : 0;
    const t1OverRuns = Math.round((d.team1Runs - prevT1) * t1Scale);
    const t2OverRuns = Math.round((d.team2Runs - prevT2) * t2Scale);
    t1Running += Math.max(0, t1OverRuns);
    t2Running += Math.max(0, t2OverRuns);

    return {
      over: d.over,
      team1Runs: t1Running,
      team2Runs: t2Running,
    };
  });
}
