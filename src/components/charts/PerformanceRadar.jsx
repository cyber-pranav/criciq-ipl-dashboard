import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const axes = [
  { key: 'average', label: 'Average' },
  { key: 'strikeRate', label: 'Strike Rate' },
  { key: 'boundaryPct', label: 'Boundary%' },
  { key: 'consistency', label: 'Consistency' },
  { key: 'powerplay', label: 'Powerplay' },
  { key: 'deathOvers', label: 'Death Overs' },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2">
      <p className="text-xs text-muted">{item.axis}</p>
      <p className="text-mono text-sm text-cyan">{item.value}</p>
    </div>
  );
}

export default function PerformanceRadar({ data, playerName }) {
  // Accept data as array of { stat, value, fullMark } (from hook) or object { average, strikeRate, ... }
  const chartData = Array.isArray(data) && data.length > 0
    ? data.map((d) => ({ axis: d.stat || d.axis || '', value: d.value ?? 0, fullMark: d.fullMark ?? 100 }))
    : axes.map((axis) => ({
        axis: axis.label,
        value: data?.[axis.key] ?? 0,
        fullMark: 100,
      }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#1E2D4A" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#6B7A99', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#6B7A99', fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name={playerName || 'Player'}
            dataKey="value"
            stroke="#00D4FF"
            fill="#00D4FF"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
