import React, { useMemo, useState } from 'react';
import { getAllPlayers } from '../../services/iplData';
import { truncateName } from '../../utils/formatters';

const ROLE_FILTERS = ['All', 'Batsman', 'Bowler', 'All-rounder'];

function seededRandom(a, b) {
  return ((a * 7 + b * 13) % 100) / 100;
}

function getCellColor(sr) {
  if (sr >= 150) return 'rgba(16, 185, 129, 0.3)';
  if (sr >= 100) return 'rgba(245, 158, 11, 0.2)';
  return 'rgba(239, 68, 68, 0.2)';
}

function getCellTextColor(sr) {
  if (sr >= 150) return '#10B981';
  if (sr >= 100) return '#F59E0B';
  return '#EF4444';
}

/**
 * Batter vs Bowler matchup matrix with role filtering and color-coded cells.
 * Green >= 150 SR, Yellow 100-150, Red < 100.
 */
export default function MatchupMatrix() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');

  const { batsmen, bowlers, matrix } = useMemo(() => {
    const all = getAllPlayers();
    const filtered = roleFilter === 'All' ? all : all.filter((p) => p.role === roleFilter || p.role === 'All-rounder');

    const bats = filtered
      .filter((p) => p.role === 'Batsman' || p.role === 'All-rounder')
      .sort((a, b) => (b.runs || 0) - (a.runs || 0))
      .slice(0, 8);
    const bwls = filtered
      .filter((p) => p.role === 'Bowler' || (p.role === 'All-rounder' && (p.wickets || 0) > 30))
      .sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
      .slice(0, 8);

    const mat = bats.map((bat) =>
      bwls.map((bwl) => {
        const sr = Math.round(
          (bat.strikeRate || 130) *
            (8 / (bwl.economy || 8)) *
            (0.8 + seededRandom(bat.id, bwl.id) * 0.4)
        );
        const balls = Math.round(15 + seededRandom(bat.id + 10, bwl.id + 5) * 25);
        const dismissals = Math.round(1 + seededRandom(bat.id + 3, bwl.id + 7) * 4);
        return { sr, balls, dismissals };
      })
    );

    return { batsmen: bats, bowlers: bwls, matrix: mat };
  }, [roleFilter]);

  return (
    <div>
      {/* Role filter buttons */}
      <div className="flex items-center gap-2 mb-4">
        {ROLE_FILTERS.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
              roleFilter === role
                ? 'bg-cyan text-navy border-cyan'
                : 'bg-transparent text-muted border-border hover:border-cyan hover:text-cyan'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto relative">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="text-xs text-muted font-medium p-2 text-left sticky left-0 bg-surface z-10">
                Bat \ Bwl
              </th>
              {bowlers.map((bwl, ci) => (
                <th
                  key={bwl.id}
                  className={`text-xs text-muted font-medium p-1 text-center whitespace-nowrap transition-colors ${
                    hoveredCol === ci ? 'text-cyan' : ''
                  }`}
                >
                  {truncateName(bwl.name, 10)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batsmen.map((bat, ri) => (
              <tr key={bat.id}>
                <td
                  className={`text-xs font-medium p-2 whitespace-nowrap sticky left-0 bg-surface z-10 transition-colors ${
                    hoveredRow === ri ? 'text-cyan' : 'text-text'
                  }`}
                >
                  {truncateName(bat.name, 10)}
                </td>
                {matrix[ri].map((cell, ci) => (
                  <td
                    key={ci}
                    className="p-0 relative"
                    onMouseEnter={() => {
                      setHoveredRow(ri);
                      setHoveredCol(ci);
                      setHoveredCell({ ri, ci });
                    }}
                    onMouseLeave={() => {
                      setHoveredRow(null);
                      setHoveredCol(null);
                      setHoveredCell(null);
                    }}
                  >
                    <div
                      className="matrix-cell"
                      style={{
                        background: getCellColor(cell.sr),
                        color: getCellTextColor(cell.sr),
                      }}
                    >
                      {cell.sr}
                    </div>

                    {/* Hover tooltip */}
                    {hoveredCell?.ri === ri && hoveredCell?.ci === ci && (
                      <div
                        className="absolute z-20 bg-surface border border-border rounded-lg px-3 py-2 shadow-lg"
                        style={{
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginBottom: 4,
                          minWidth: 140,
                          pointerEvents: 'none',
                        }}
                      >
                        <p className="text-[10px] text-muted mb-1">
                          {bat.name} vs {bowlers[ci].name}
                        </p>
                        <p className="text-xs font-mono" style={{ color: getCellTextColor(cell.sr) }}>
                          SR: {cell.sr}
                        </p>
                        <p className="text-[10px] text-muted">
                          {cell.balls} balls • {cell.dismissals} dismissals
                        </p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ background: 'rgba(16,185,129,0.3)' }} />
            SR ≥ 150
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ background: 'rgba(245,158,11,0.2)' }} />
            SR 100-149
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.2)' }} />
            SR &lt; 100
          </span>
        </div>
      </div>
    </div>
  );
}
