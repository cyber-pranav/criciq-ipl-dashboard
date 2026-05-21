import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { generateMomentumData } from '../../utils/winProbability';

function MomentumTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded px-3 py-2 text-sm">
      <p className="text-muted text-xs mb-1">Over {label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function MomentumWorm({ team1 = 'CSK', team2 = 'MI', matchData }) {
  const data = useMemo(() => {
    if (matchData) return matchData;
    return generateMomentumData({
      team1,
      team2,
      winner: team1,
      win_by_runs: 15,
      win_by_wickets: 0,
    });
  }, [team1, team2, matchData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
        <XAxis
          dataKey="over"
          tick={{ fill: '#6B7A99', fontSize: 11 }}
          axisLine={{ stroke: '#1E2D4A' }}
          label={{ value: 'Overs', position: 'insideBottomRight', offset: -5, fill: '#6B7A99', fontSize: 10 }}
        />
        <YAxis
          tick={{ fill: '#6B7A99', fontSize: 11 }}
          axisLine={{ stroke: '#1E2D4A' }}
          label={{ value: 'Runs', angle: -90, position: 'insideLeft', fill: '#6B7A99', fontSize: 10 }}
        />
        <Tooltip content={<MomentumTooltip />} />
        <Area
          type="monotone"
          dataKey="team1Runs"
          name={team1}
          stroke="#00D4FF"
          fill="#00D4FF"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="team2Runs"
          name={team2}
          stroke="#F59E0B"
          fill="#F59E0B"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
