import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getAllSeasonStats } from '../../services/iplData';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg px-4 py-3">
      <p className="text-muted text-xs mb-1">Season {label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-mono text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function RunsChart({ data, selectedTeam, comparisonTeam }) {
  const chartData = useMemo(() => {
    if (data) return data;
    // Default: show total runs per season from season stats
    return getAllSeasonStats().map((s) => ({
      season: s.year,
      totalRuns: s.totalRuns,
      avgScore: s.averageScore,
    }));
  }, [data]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="#1E2D4A" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="season"
            tick={{ fill: '#6B7A99', fontSize: 12 }}
            axisLine={{ stroke: '#1E2D4A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7A99', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#6B7A99', fontSize: 12 }}
          />

          {!selectedTeam && !comparisonTeam && (
            <Line
              type="monotone"
              dataKey="totalRuns"
              name="Total Runs"
              stroke="#00D4FF"
              strokeWidth={2}
              dot={{ r: 3, fill: '#00D4FF' }}
              activeDot={{ r: 5, fill: '#00D4FF' }}
            />
          )}

          {selectedTeam && (
            <Line
              type="monotone"
              dataKey="selectedRuns"
              name={selectedTeam}
              stroke="#00D4FF"
              strokeWidth={2}
              dot={{ r: 3, fill: '#00D4FF' }}
              activeDot={{ r: 5, fill: '#00D4FF' }}
            />
          )}

          {comparisonTeam && (
            <Line
              type="monotone"
              dataKey="comparisonRuns"
              name={comparisonTeam}
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 3, fill: '#F59E0B' }}
              activeDot={{ r: 5, fill: '#F59E0B' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
