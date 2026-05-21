import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { IconRefresh } from '@tabler/icons-react';
import { generateWinProbability } from '../../utils/winProbability';

function WinProbTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-surface border border-border rounded px-3 py-2 text-sm">
      <p className="text-muted text-xs mb-1">Over {d.over}</p>
      <p className="font-mono text-cyan">{d.team1 || 'Team 1'}: {d.team1Prob}%</p>
      <p className="font-mono text-amber">{d.team2 || 'Team 2'}: {d.team2Prob}%</p>
    </div>
  );
}

export default function WinProbabilityChart({ match }) {
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => {
    // Add seed to win_by_runs to change the hash seed on each simulation
    const tweakedMatch = { ...match, win_by_runs: (match?.win_by_runs || 0) + seed * 3 };
    const raw = generateWinProbability(tweakedMatch);
    return raw.map((d) => ({
      ...d,
      team1: match?.team1 || 'Team 1',
      team2: match?.team2 || 'Team 2',
    }));
  }, [match, seed]);

  // Show only every 6th ball label (each over)
  const tickFormatter = (val, idx) => {
    if (idx % 6 === 0) return `${Math.floor(idx / 6) + 1}`;
    return '';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted">
            <span className="inline-block w-3 h-0.5 bg-cyan rounded mr-1 align-middle" />
            {match?.team1 || 'Team 1'}
          </span>
          <span className="text-xs text-muted">
            <span className="inline-block w-3 h-0.5 bg-amber rounded mr-1 align-middle" />
            {match?.team2 || 'Team 2'}
          </span>
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-cyan transition-colors"
        >
          <IconRefresh size={14} stroke={1.5} />
          Simulate
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
          <XAxis
            dataKey="ball"
            tick={{ fill: '#6B7A99', fontSize: 10 }}
            axisLine={{ stroke: '#1E2D4A' }}
            tickFormatter={tickFormatter}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6B7A99', fontSize: 10 }}
            axisLine={{ stroke: '#1E2D4A' }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<WinProbTooltip />} />
          <ReferenceLine y={50} stroke="#6B7A99" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="team1Prob"
            name={match?.team1 || 'Team 1'}
            stroke="#00D4FF"
            fill="#00D4FF"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="team2Prob"
            name={match?.team2 || 'Team 2'}
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
