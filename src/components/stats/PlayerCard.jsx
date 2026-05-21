import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeltaBadge from './DeltaBadge';

const teamColors = {
  MI: '#004BA0',
  CSK: '#F9CD05',
  RCB: '#EC1C24',
  KKR: '#3A225D',
  DC: '#004C93',
  SRH: '#FF822A',
  RR: '#EA1A85',
  PBKS: '#ED1B24',
  GT: '#1B2133',
  LSG: '#A72056',
};

export default function PlayerCard({ player, rank, showDelta = false }) {
  const navigate = useNavigate();

  const teamColor = teamColors[player.team] || '#6B7A99';
  const deltaDir = player.delta > 0 ? 'up' : player.delta < 0 ? 'down' : 'neutral';

  return (
    <div
      onClick={() => navigate(`/player/${player.id}`)}
      className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-lg cursor-pointer transition-colors hover:border-cyan"
    >
      {/* Rank */}
      <span className="text-mono text-muted text-sm w-6 text-right shrink-0">
        {rank}
      </span>

      {/* Team color dot */}
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: teamColor }}
      />

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <p className="text-text text-sm font-medium truncate">{player.name}</p>
        <p className="text-muted text-xs">{player.team}</p>
      </div>

      {/* Key stat */}
      <span className="text-mono text-text text-sm font-semibold shrink-0">
        {player.stat}
      </span>

      {/* Delta */}
      {showDelta && player.delta !== undefined && (
        <DeltaBadge
          value={`${Math.abs(player.delta)}%`}
          direction={deltaDir}
          size="sm"
        />
      )}
    </div>
  );
}
