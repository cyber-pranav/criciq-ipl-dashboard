// src/components/analytics/ClutchLeaderboard.jsx
import { useMemo } from 'react';
import { IconFlame, IconInfoCircle } from '@tabler/icons-react';
import { getAllPlayers } from '../../services/iplData';
import { getClutchLeaderboard } from '../../utils/clutchIndex';
import { getTeamColor } from '../../utils/formatters';

const CATEGORY_STYLES = {
  'Elite Closer': 'bg-[#10B981]/20 text-[#10B981]',
  'Reliable': 'bg-[#F59E0B]/20 text-[#F59E0B]',
  'Inconsistent': 'bg-[#EF4444]/20 text-[#EF4444]',
};

function ClutchRow({ rank, player }) {
  const catStyle = CATEGORY_STYLES[player.clutchCategory] || CATEGORY_STYLES['Inconsistent'];

  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-border hover:bg-surface-hover transition-colors">
      <span className="text-muted font-mono text-xs w-4 shrink-0">{rank}</span>
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: getTeamColor(player.team) }}
        title={player.team}
      />
      <span className="text-text text-sm truncate flex-1 min-w-0">{player.name}</span>
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catStyle} shrink-0`}>
        {player.clutchCategory}
      </span>
      <span className="font-mono text-sm text-cyan tabular-nums w-12 text-right shrink-0">
        {player.clutchScore.toFixed(1)}
      </span>
      <span className="text-muted text-xs shrink-0">/10</span>
    </div>
  );
}

function ColumnHeader({ title }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
      <IconFlame size={14} className="text-amber" />
      <span className="text-[11px] font-medium tracking-wide uppercase text-muted">{title}</span>
    </div>
  );
}

export default function ClutchLeaderboard() {
  const players = useMemo(() => getAllPlayers(), []);

  const batsmen = useMemo(
    () => getClutchLeaderboard(players, 'batting', 5),
    [players],
  );

  const bowlers = useMemo(
    () => getClutchLeaderboard(players, 'bowling', 5),
    [players],
  );

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text tracking-wide">
          Clutch Index
        </h3>
        <div className="group relative">
          <IconInfoCircle size={14} className="text-muted cursor-help" />
          <div className="absolute right-0 top-6 z-50 hidden group-hover:block w-56 p-2 bg-navy border border-border rounded text-[11px] text-muted leading-relaxed shadow-lg">
            Measures performance under pressure in death overs, chases, and playoffs
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 divide-x divide-border">
        {/* Batsmen */}
        <div>
          <ColumnHeader title="Clutch Batsmen" />
          {batsmen.map((p, i) => (
            <ClutchRow key={p.id} rank={i + 1} player={p} />
          ))}
        </div>

        {/* Bowlers */}
        <div>
          <ColumnHeader title="Clutch Bowlers" />
          {bowlers.map((p, i) => (
            <ClutchRow key={p.id} rank={i + 1} player={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
