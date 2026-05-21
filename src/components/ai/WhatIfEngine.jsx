import React, { useState, useCallback } from 'react';
import { askCricIQ } from '../../services/gemini';
import { getRecentMatches } from '../../services/iplData';

const RESULT_SECTIONS = [
  { key: 'impact',   icon: '📉', label: 'IMPACT ON MATCH FLOW' },
  { key: 'probability', icon: '🎲', label: 'PROBABILITY SHIFT' },
  { key: 'ripple',   icon: '🔄', label: 'RIPPLE EFFECTS' },
  { key: 'outcome',  icon: '📋', label: 'REVISED OUTCOME' },
];

function parseSections(text) {
  const result = {};
  const patterns = [
    { key: 'impact',      pats: ['impact on match', 'match flow', 'impact'] },
    { key: 'probability', pats: ['probability shift', 'probability', 'win probability'] },
    { key: 'ripple',      pats: ['ripple effect', 'ripple', 'chain reaction'] },
    { key: 'outcome',     pats: ['revised outcome', 'outcome', 'final result'] },
  ];

  const lines = text.split('\n');
  let currentKey = 'impact';
  let buffer = [];

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/[*#_\-:]/g, '').trim();
    let matched = false;
    for (const sp of patterns) {
      if (sp.pats.some((p) => lower.includes(p) && lower.length < 60)) {
        if (buffer.length > 0) result[currentKey] = buffer.join('\n').trim();
        currentKey = sp.key;
        buffer = [];
        matched = true;
        break;
      }
    }
    if (!matched) buffer.push(line);
  }
  if (buffer.length > 0) result[currentKey] = buffer.join('\n').trim();

  if (Object.keys(result).length <= 1 && text.length > 80) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const per = Math.max(1, Math.ceil(sentences.length / 4));
    RESULT_SECTIONS.forEach((s, i) => {
      const chunk = sentences.slice(i * per, (i + 1) * per);
      if (chunk.length > 0) result[s.key] = chunk.join(' ');
    });
  }
  return result;
}

/**
 * Custom renderer for alternate timeline responses to guarantee text contrast,
 * format headings dynamically, and avoid any manual truncation.
 */
function renderTimelineText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="text-slate-200 leading-relaxed space-y-3">
      {lines.map((line, idx) => {
        const cleanLine = line.replace(/[*#_\-:]/g, '').trim();
        const lower = cleanLine.toLowerCase();

        if (lower.includes('impact on match flow') || lower === 'impact on match') {
          return (
            <span key={idx} className="text-cyan-400 font-bold block mt-4 mb-1 text-xs">
              📉 IMPACT ON MATCH FLOW
            </span>
          );
        }
        if (lower.includes('probability shift') || lower === 'probability') {
          return (
            <span key={idx} className="text-cyan-400 font-bold block mt-4 mb-1 text-xs">
              🎲 PROBABILITY SHIFT
            </span>
          );
        }
        if (lower.includes('ripple effects') || lower === 'ripple effect' || lower === 'ripple') {
          return (
            <span key={idx} className="text-cyan-400 font-bold block mt-4 mb-1 text-xs">
              🔄 RIPPLE EFFECTS
            </span>
          );
        }
        if (lower.includes('revised outcome') || lower === 'outcome' || lower === 'final result') {
          return (
            <span key={idx} className="text-cyan-400 font-bold block mt-4 mb-1 text-xs">
              📋 REVISED OUTCOME
            </span>
          );
        }

        // Render bullet points or regular text
        if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
          return (
            <li key={idx} className="ml-4 list-disc text-xs text-slate-200 leading-relaxed">
              {line.replace(/^[*-\s]+/, '')}
            </li>
          );
        }

        if (!line.trim()) {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p key={idx} className="text-xs text-slate-200 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

/**
 * What-If Engine — two-panel AI scenario simulator.
 * Left: match selection + scenario input. Right: 4-section structured results.
 */
export default function WhatIfEngine() {
  const recentMatches = getRecentMatches(10);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [whatIfPrompt, setWhatIfPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedMatch = recentMatches.find((m) => String(m.id) === selectedMatchId);

  const buildMatchDescription = useCallback(() => {
    if (!selectedMatch) return '';
    const margin = selectedMatch.win_by_runs
      ? `${selectedMatch.win_by_runs} runs`
      : `${selectedMatch.win_by_wickets} wickets`;
    return `${selectedMatch.team1} vs ${selectedMatch.team2} (${selectedMatch.date}) at ${selectedMatch.venue}. ${selectedMatch.winner} won by ${margin}. Player of match: ${selectedMatch.player_of_match}.`;
  }, [selectedMatch]);

  const simulate = useCallback(async () => {
    if (!selectedMatch || !whatIfPrompt.trim()) return;
    setLoading(true);
    setResult(null);

    const matchDescription = buildMatchDescription();
    const prompt = `You are an alternate reality IPL cricket simulator. Given this match: ${matchDescription}. The user asks: ${whatIfPrompt}.

Format your response with EXACTLY these 4 sections (use these exact headers):

**IMPACT ON MATCH FLOW**: How does this change the game's momentum? 2-3 sentences.
**PROBABILITY SHIFT**: How do the win probabilities change? Give specific percentages.
**RIPPLE EFFECTS**: What downstream consequences does this create? 2-3 bullet points.
**REVISED OUTCOME**: What is the new final result? Include projected scores.`;

    try {
      const response = await askCricIQ(prompt);
      setResult({ sections: parseSections(response), raw: response });
    } catch {
      setResult({ sections: { impact: '⚠ Simulation failed. Please try again.' }, raw: '⚠ Simulation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [selectedMatch, whatIfPrompt, buildMatchDescription]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left panel — Input */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-text mb-3">What If…</h3>

        <label className="block text-[11px] text-muted uppercase tracking-wide mb-1">
          Select Match
        </label>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="w-full bg-navy border border-border rounded-lg px-3 py-2 text-xs text-text outline-none focus:border-cyan transition-colors duration-150"
        >
          <option value="">— pick a match —</option>
          {recentMatches.map((m) => (
            <option key={m.id} value={String(m.id)}>
              {m.team1} vs {m.team2} — {m.date}
            </option>
          ))}
        </select>

        <label className="block text-[11px] text-muted uppercase tracking-wide mt-3 mb-1">
          Your Scenario
        </label>
        <textarea
          value={whatIfPrompt}
          onChange={(e) => setWhatIfPrompt(e.target.value)}
          placeholder="What if Kohli had scored 100 instead of getting out early?"
          rows={4}
          className="w-full bg-navy border border-border rounded-lg px-3 py-2 text-xs text-text outline-none resize-none placeholder:text-muted/50 focus:border-cyan transition-colors duration-150"
        />

        <button
          onClick={simulate}
          disabled={loading || !selectedMatchId || !whatIfPrompt.trim()}
          className="mt-3 w-full py-2 rounded-lg text-xs font-medium uppercase tracking-wider bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          {loading ? 'Simulating…' : '⚡ Simulate Alternate Reality'}
        </button>

        {/* Quick scenario suggestions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['What if the toss result was different?', 'What if the star player was injured?', 'What if DRS overturned the key wicket?'].map((q, i) => (
            <button
              key={i}
              onClick={() => setWhatIfPrompt(q)}
              className="chip text-[10px] cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Right panel — Structured Results */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col h-[500px]">
        <h3 className="text-sm font-bold text-text mb-3 flex-shrink-0">Alternate Timeline</h3>

        <div className="flex-1 overflow-y-auto pr-1">
          {loading && (
            <div className="space-y-4">
              {RESULT_SECTIONS.map((s) => (
                <div key={s.key} className="space-y-1.5">
                  <div className="skeleton h-3 w-32 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && !result && (
            <p className="text-xs text-muted italic">
              Pick a match and describe your "what if" scenario to generate an alternate timeline.
            </p>
          )}

          {!loading && result && (
            <div className="p-4 rounded-lg bg-[#0D121F] border border-border text-slate-200 leading-relaxed space-y-4">
              {renderTimelineText(result.raw)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
