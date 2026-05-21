import React, { useMemo } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { generateMomentumData } from '../../utils/winProbability';

function MomentumTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const t1 = payload.find((p) => p.dataKey === 'team1Runs');
  const t2 = payload.find((p) => p.dataKey === 'team2Runs');
  const diff = t1 && t2 ? t1.value - t2.value : 0;
  return (
    <div className="bg-surface border border-border rounded px-3 py-2 text-sm">
      <p className="text-muted text-xs mb-1">Over {label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
      {diff !== 0 && (
        <p className="text-[10px] mt-1" style={{ color: diff > 0 ? '#00D4FF' : '#F59E0B' }}>
          Lead: {Math.abs(diff)} runs
        </p>
      )}
    </div>
  );
}

/**
 * Momentum Worm chart using ComposedChart with Area + Line overlays.
 * Shows run accumulation for two teams with crossover reference lines.
 */
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

  const crossovers = useMemo(() => {
    if (!data?.length) return [];
    const points = [];
    for (let i = 1; i < data.length; i++) {
      const prevDiff = (data[i - 1].team1Runs || 0) - (data[i - 1].team2Runs || 0);
      const currDiff = (data[i].team1Runs || 0) - (data[i].team2Runs || 0);
      if ((prevDiff > 0 && currDiff <= 0) || (prevDiff < 0 && currDiff >= 0) || (prevDiff === 0 && currDiff !== 0)) {
        points.push(data[i].over);
      }
    }
    return points;
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
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

        {crossovers.map((over, i) => (
          <ReferenceLine
            key={i}
            x={over}
            stroke="#E040FB"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: '⚡', position: 'top', fontSize: 10 }}
          />
        ))}

        <Area
          type="monotone"
          dataKey="team1Runs"
          name={team1}
          stroke="transparent"
          fill="#00D4FF"
          fillOpacity={0.12}
        />
        <Line
          type="monotone"
          dataKey="team1Runs"
          name={team1}
          stroke="#00D4FF"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#00D4FF' }}
        />

        <Area
          type="monotone"
          dataKey="team2Runs"
          name={team2}
          stroke="transparent"
          fill="#F59E0B"
          fillOpacity={0.12}
        />
        <Line
          type="monotone"
          dataKey="team2Runs"
          name={team2}
          stroke="#F59E0B"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#F59E0B' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
