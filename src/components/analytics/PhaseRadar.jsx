import React, { useMemo } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getTeamPhaseProfile } from '../../utils/phaseAnalysis';
import { MATCHES_DATA, getAllPlayers } from '../../services/iplData';

export default function PhaseRadar({ teamShortName = 'CSK' }) {
  const data = useMemo(() => {
    const profile = getTeamPhaseProfile(teamShortName, MATCHES_DATA, getAllPlayers());
    return profile.map((p) => ({
      phase: p.phase,
      'Scoring Rate': Math.min(100, Math.round((p.scoringRate / 12) * 100)),
      'Boundary Freq': Math.min(100, Math.round((p.boundaryFrequency / 3) * 100)),
      'Wicket Control': Math.min(100, Math.round(((3 - p.wicketLossRate) / 3) * 100)),
    }));
  }, [teamShortName]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#1E2D4A" />
          <PolarAngleAxis
            dataKey="phase"
            tick={{ fill: '#E8EDF5', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#6B7A99', fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="Scoring Rate"
            dataKey="Scoring Rate"
            stroke="#00D4FF"
            fill="#00D4FF"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Boundary Freq"
            dataKey="Boundary Freq"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="Wicket Control"
            dataKey="Wicket Control"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(val) => <span style={{ color: '#6B7A99', fontSize: 11 }}>{val}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
