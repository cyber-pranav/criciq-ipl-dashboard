import React, { useState, useMemo } from 'react';
import { getOverWiseData } from '../../services/iplData';

function getDangerColor(level) {
  // level 0-1, maps green to red
  const clamped = Math.max(0, Math.min(1, level));
  if (clamped <= 0.25) return '#10B981';
  if (clamped <= 0.5) return '#F59E0B';
  if (clamped <= 0.75) return '#EF8C44';
  return '#EF4444';
}

function getOpacity(level) {
  return 0.4 + Math.min(level, 1) * 0.6;
}

export default function WicketHeatmap({ data }) {
  const [tooltip, setTooltip] = useState(null);

  // data expected: array of { over: 1-20, dangerLevel: 0-1, wickets: number, label: string }
  // Or 2D: rows × 20 overs. We'll handle flat array (20 items).
  const overs = useMemo(() => {
    const raw = data && data.length > 0 ? data : getOverWiseData();
    return raw.map((cell) => ({
      ...cell,
      dangerLevel: cell.dangerLevel > 1 ? cell.dangerLevel / 100 : cell.dangerLevel,
    }));
  }, [data]);

  return (
    <div className="relative">
      {/* Grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${Math.min(overs.length, 20)}, 1fr)` }}
      >
        {overs.map((cell, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded cursor-pointer transition-all duration-150"
            style={{
              backgroundColor: getDangerColor(cell.dangerLevel),
              opacity: getOpacity(cell.dangerLevel),
            }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top,
                over: cell.over,
                wickets: cell.wickets,
                dangerLevel: cell.dangerLevel,
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-navy font-semibold">
              {cell.wickets}
            </span>
          </div>
        ))}
      </div>

      {/* Over labels */}
      <div
        className="grid gap-1 mt-1"
        style={{ gridTemplateColumns: `repeat(${Math.min(overs.length, 20)}, 1fr)` }}
      >
        {overs.map((cell, idx) => (
          <span key={idx} className="text-center text-xs text-muted">
            {cell.over}
          </span>
        ))}
      </div>

      {/* Intensity legend */}
      <div className="flex items-center gap-2 mt-3 justify-center">
        <span className="text-xs text-muted">Safe</span>
        <div className="flex gap-0.5">
          {[0, 0.25, 0.5, 0.75, 1].map((level) => (
            <span
              key={level}
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: getDangerColor(level), opacity: getOpacity(level) }}
            />
          ))}
        </div>
        <span className="text-xs text-muted">Danger</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-surface border border-border rounded-lg px-3 py-2 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 60,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="text-xs text-muted">Over {tooltip.over}</p>
          <p className="text-mono text-sm text-text">{tooltip.wickets} wickets</p>
          <p className="text-xs text-muted">
            Danger: {(tooltip.dangerLevel * 100).toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
}
