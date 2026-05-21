import React, { useMemo, useState } from 'react';
import { getAllPlayers } from '../../services/iplData';
import { truncateName } from '../../utils/formatters';

function seededRandom(a, b) {
  return ((a * 7 + b * 13) % 100) / 100;
}

function getCellColor(sr) {
  if (sr >= 160) return 'rgba(16, 185, 129, 0.3)';
  if (sr >= 130) return 'rgba(245, 158, 11, 0.2)';
  if (sr < 100) return 'rgba(239, 68, 68, 0.2)';
  return 'transparent';
}

export default function MatchupMatrix() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);

  const { batsmen, bowlers, matrix } = useMemo(() => {
    const all = getAllPlayers();
    const bats = all
      .filter((p) => p.role === 'Batsman' || p.role === 'All-rounder')
      .sort((a, b) => (b.runs || 0) - (a.runs || 0))
      .slice(0, 8);
    const bwls = all
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
        return sr;
      })
    );

    return { batsmen: bats, bowlers: bwls, matrix: mat };
  }, []);

  return (
    <div className="overflow-x-auto">
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
              {matrix[ri].map((sr, ci) => (
                <td
                  key={ci}
                  className="p-0"
                  onMouseEnter={() => {
                    setHoveredRow(ri);
                    setHoveredCol(ci);
                  }}
                  onMouseLeave={() => {
                    setHoveredRow(null);
                    setHoveredCol(null);
                  }}
                >
                  <div
                    className="matrix-cell"
                    style={{
                      background: getCellColor(sr),
                      color:
                        sr >= 160
                          ? '#10B981'
                          : sr >= 130
                          ? '#F59E0B'
                          : sr < 100
                          ? '#EF4444'
                          : '#E8EDF5',
                    }}
                  >
                    {sr}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: 'rgba(16,185,129,0.3)' }} />
          SR ≥ 160
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: 'rgba(245,158,11,0.2)' }} />
          SR 130-159
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.2)' }} />
          SR &lt; 100
        </span>
      </div>
    </div>
  );
}
