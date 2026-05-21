import React, { useState, useCallback } from 'react';
import { askCricIQ } from '../../services/gemini';

const SECTIONS = [
  { key: 'verdict',    icon: '⚖️', label: 'MATCH VERDICT' },
  { key: 'battleground', icon: '⚔️', label: 'KEY BATTLEGROUND' },
  { key: 'matchup',   icon: '🎯', label: 'THE MATCHUP TO WATCH' },
  { key: 'tactical',  icon: '🧠', label: 'TACTICAL EDGE' },
  { key: 'argument',  icon: '🔥', label: 'FAN ARGUMENT STARTER' },
];

/**
 * Parse Gemini response into 5 structured sections.
 * Falls back to showing the full response in the verdict section if parsing fails.
 */
function parseSections(text) {
  const result = {};
  const sectionPatterns = [
    { key: 'verdict',     patterns: ['match verdict', 'verdict', 'prediction'] },
    { key: 'battleground', patterns: ['key battleground', 'battleground', 'key battle'] },
    { key: 'matchup',     patterns: ['matchup to watch', 'matchup', 'player matchup'] },
    { key: 'tactical',    patterns: ['tactical edge', 'tactical', 'strategy'] },
    { key: 'argument',    patterns: ['fan argument', 'argument starter', 'debate'] },
  ];

  const lines = text.split('\n');
  let currentKey = 'verdict';
  let buffer = [];

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/[*#_\-:]/g, '').trim();
    let matched = false;
    for (const sp of sectionPatterns) {
      if (sp.patterns.some((p) => lower.includes(p) && lower.length < 50)) {
        if (buffer.length > 0) {
          result[currentKey] = buffer.join('\n').trim();
        }
        currentKey = sp.key;
        buffer = [];
        matched = true;
        break;
      }
    }
    if (!matched) {
      buffer.push(line);
    }
  }
  if (buffer.length > 0) {
    result[currentKey] = buffer.join('\n').trim();
  }

  // If we only got one section, split the text roughly into 5 parts
  if (Object.keys(result).length <= 1 && text.length > 100) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const perSection = Math.max(1, Math.ceil(sentences.length / 5));
    SECTIONS.forEach((s, i) => {
      const chunk = sentences.slice(i * perSection, (i + 1) * perSection);
      if (chunk.length > 0) result[s.key] = chunk.join(' ');
    });
  }

  return result;
}

export default function LockerRoomReport({ team1Info, team2Info, headToHeadData }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const team1 = team1Info?.name || team1Info?.shortName || 'Team A';
  const team2 = team2Info?.name || team2Info?.shortName || 'Team B';

  const generateReport = useCallback(async () => {
    setLoading(true);
    setReport(null);
    setCopied(false);

    const h2h = headToHeadData
      ? `Head-to-head: ${headToHeadData.matches} matches, ${team1} won ${headToHeadData.team1Wins}, ${team2} won ${headToHeadData.team2Wins}.`
      : '';

    const prompt = `As a head coach preparing for ${team1} vs ${team2} in the IPL, generate a classified pre-match tactical briefing. ${h2h}

Format your response with EXACTLY these 5 sections (use these exact headers):

**MATCH VERDICT**: Your prediction and confidence level.
**KEY BATTLEGROUND**: The phase/matchup that will decide the game.
**THE MATCHUP TO WATCH**: One specific batter vs bowler duel.
**TACTICAL EDGE**: One strategic play that could change the result.
**FAN ARGUMENT STARTER**: A hot take to debate with rival fans.

Keep each section to 2-3 sentences.`;

    try {
      const response = await askCricIQ(prompt);
      const sections = parseSections(response);
      setReport({ sections, raw: response });
    } catch {
      setReport({ sections: { verdict: '⚠ Failed to generate report. Please try again.' }, raw: '' });
    } finally {
      setLoading(false);
    }
  }, [team1, team2, headToHeadData]);

  const copyReport = useCallback(async () => {
    if (!report?.raw) return;
    try {
      await navigator.clipboard.writeText(report.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }, [report]);

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        background: '#0D1F0D',
        borderColor: '#1A3A1A',
      }}
    >
      {/* Top banner */}
      <div
        className="px-4 py-2.5 flex items-center gap-2 border-b"
        style={{ borderColor: '#1A3A1A', background: 'rgba(16,185,129,0.08)' }}
      >
        <span className="text-sm">🔒</span>
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: '#10B981' }}
        >
          Locker Room — Classified
        </span>
        <span className="ml-auto text-[10px] text-muted font-mono">
          {team1} vs {team2}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-text mb-1">Pre-Match Scout Report</h3>
        <p className="text-xs text-muted mb-4">
          AI-generated tactical intelligence brief — 5 classified sections
        </p>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 mb-4">
            {SECTIONS.map((s) => (
              <div key={s.key} className="space-y-1.5">
                <div className="skeleton h-3 w-36 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-4/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Report sections */}
        {report && !loading && (
          <div className="space-y-3 mb-4">
            {SECTIONS.map((s) => {
              const content = report.sections[s.key];
              if (!content) return null;
              return (
                <div
                  key={s.key}
                  className="tactical-card p-3 rounded-lg"
                  style={{
                    background: 'rgba(16,185,129,0.04)',
                    border: '1px solid #1A3A1A',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs">{s.icon}</span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: '#10B981' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-text whitespace-pre-wrap">
                    {content}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={generateReport}
            disabled={loading}
            className="
              px-4 py-1.5 rounded-lg text-xs font-medium
              border bg-navy text-text
              hover:text-cyan
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150 cursor-pointer
            "
            style={{ borderColor: '#1A3A1A' }}
          >
            {report ? '↻ Regenerate' : '⚡ Generate Report'}
          </button>

          {report && (
            <button
              onClick={copyReport}
              className="
                px-4 py-1.5 rounded-lg text-xs font-medium
                border bg-navy text-muted
                hover:text-cyan
                transition-colors duration-150 cursor-pointer
              "
              style={{ borderColor: '#1A3A1A' }}
            >
              {copied ? '✓ Copied' : '📋 Copy Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
