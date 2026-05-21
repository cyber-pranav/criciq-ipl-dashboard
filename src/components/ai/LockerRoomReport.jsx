import React, { useState, useCallback } from 'react';
import { askCricIQ } from '../../services/gemini';

export default function LockerRoomReport({ team1Info, team2Info, headToHeadData }) {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const team1 = team1Info?.name || team1Info?.shortName || 'Team A';
  const team2 = team2Info?.name || team2Info?.shortName || 'Team B';

  const generateReport = useCallback(async () => {
    setLoading(true);
    setReport('');
    setCopied(false);

    const h2h = headToHeadData
      ? `Head-to-head: ${headToHeadData.matches} matches, ${team1} won ${headToHeadData.team1Wins}, ${team2} won ${headToHeadData.team2Wins}.`
      : '';

    const prompt = `As a head coach preparing for ${team1} vs ${team2}, generate a pre-match tactical briefing. ${h2h} Include: 1) Key matchup to exploit, 2) Danger player to neutralize, 3) Suggested bowling strategy, 4) Powerplay approach. Format as a military-style brief with sections.`;

    try {
      const response = await askCricIQ(prompt);
      setReport(response);
    } catch {
      setReport('⚠ Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [team1, team2, headToHeadData]);

  const copyReport = useCallback(async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }, [report]);

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Top banner */}
      <div
        className="px-4 py-2 flex items-center gap-2 border-b"
        style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)' }}
      >
        <span className="text-sm">🔒</span>
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: '#10B981' }}
        >
          Locker Room — Classified
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-text mb-1">Pre-Match Scout Report</h3>
        <p className="text-xs text-muted mb-4">
          {team1} vs {team2} — tactical intelligence brief
        </p>

        {/* Report body */}
        {loading && (
          <div className="space-y-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-3 rounded"
                style={{ width: `${85 - i * 10}%` }}
              />
            ))}
          </div>
        )}

        {report && !loading && (
          <div
            className="mb-4 p-4 rounded-lg font-mono text-xs leading-relaxed text-text whitespace-pre-wrap"
            style={{
              background: 'rgba(16,185,129,0.04)',
              border: '1px solid rgba(16,185,129,0.3)',
            }}
          >
            {report}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={generateReport}
            disabled={loading}
            className="
              px-4 py-1.5 rounded-lg text-xs font-medium
              border border-border bg-navy text-text
              hover:border-cyan hover:text-cyan
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150 cursor-pointer
            "
          >
            {report ? 'Regenerate' : 'Generate Report'}
          </button>

          {report && (
            <button
              onClick={copyReport}
              className="
                px-4 py-1.5 rounded-lg text-xs font-medium
                border border-border bg-navy text-muted
                hover:border-cyan hover:text-cyan
                transition-colors duration-150 cursor-pointer
              "
            >
              {copied ? '✓ Copied' : 'Copy Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
