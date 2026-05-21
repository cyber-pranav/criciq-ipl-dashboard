import React from 'react';

export default function InsightPanel({ insight, followUps, onFollowUp }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      {/* Insight text */}
      <div className="text-text text-sm leading-relaxed whitespace-pre-wrap">
        {insight?.text || insight || 'No insight available.'}
      </div>

      {/* Stats block if present */}
      {insight?.stats && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {insight.stats.map((stat, idx) => (
            <div key={idx} className="bg-navy border border-border rounded-lg px-3 py-2">
              <p className="text-muted text-xs">{stat.label}</p>
              <p className="text-mono text-amber text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Follow-up chips */}
      {followUps && followUps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
          {followUps.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onFollowUp && onFollowUp(q)}
              className="chip"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
