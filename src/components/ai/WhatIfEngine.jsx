import React, { useState, useCallback } from 'react';
import { askCricIQ } from '../../services/gemini';
import { getRecentMatches } from '../../services/iplData';

export default function WhatIfEngine() {
  const recentMatches = getRecentMatches(10);

  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [whatIfPrompt, setWhatIfPrompt] = useState('');
  const [timeline, setTimeline] = useState('');
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
    setTimeline('');

    const matchDescription = buildMatchDescription();
    const prompt = `You are an alternate reality cricket simulator. Given this IPL match: ${matchDescription}. The user asks: ${whatIfPrompt}. Generate a detailed alternate timeline in 4-5 bullet points showing how the match would have unfolded differently. Include specific scores and key moments.`;

    try {
      const response = await askCricIQ(prompt);
      setTimeline(response);
    } catch {
      setTimeline('⚠ Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedMatch, whatIfPrompt, buildMatchDescription]);

  const timelineBullets = timeline
    ? timeline
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left panel — Input */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-text mb-3">What If…</h3>

        {/* Match selector */}
        <label className="block text-[11px] text-muted uppercase tracking-wide mb-1">
          Select Match
        </label>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="
            w-full bg-navy border border-border rounded-lg px-3 py-2
            text-xs text-text outline-none
            focus:border-cyan transition-colors duration-150
          "
        >
          <option value="">— pick a match —</option>
          {recentMatches.map((m) => (
            <option key={m.id} value={String(m.id)}>
              {m.team1} vs {m.team2} — {m.date}
            </option>
          ))}
        </select>

        {/* What-if prompt */}
        <label className="block text-[11px] text-muted uppercase tracking-wide mt-3 mb-1">
          Your Scenario
        </label>
        <textarea
          value={whatIfPrompt}
          onChange={(e) => setWhatIfPrompt(e.target.value)}
          placeholder='What if Kohli had scored 100 instead of getting out early?'
          rows={4}
          className="
            w-full bg-navy border border-border rounded-lg px-3 py-2
            text-xs text-text outline-none resize-none
            placeholder:text-muted/50
            focus:border-cyan transition-colors duration-150
          "
        />

        <button
          onClick={simulate}
          disabled={loading || !selectedMatchId || !whatIfPrompt.trim()}
          className="
            mt-3 w-full py-2 rounded-lg text-xs font-medium uppercase tracking-wider
            bg-cyan/10 text-cyan border border-cyan/30
            hover:bg-cyan/20
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors duration-150 cursor-pointer
          "
        >
          {loading ? 'Simulating…' : 'Simulate'}
        </button>
      </div>

      {/* Right panel — Timeline */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-text mb-3">Alternate Timeline</h3>

        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3 rounded" style={{ width: '90%' }} />
                  <div className="skeleton h-3 rounded" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && timelineBullets.length === 0 && (
          <p className="text-xs text-muted italic">
            Pick a match and describe your "what if" scenario to generate an alternate timeline.
          </p>
        )}

        {!loading && timelineBullets.length > 0 && (
          <div className="space-y-0">
            {timelineBullets.map((bullet, idx) => (
              <div key={idx} className="flex gap-3 group">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: 'rgba(0,212,255,0.12)',
                      color: 'var(--color-cyan)',
                      border: '1px solid rgba(0,212,255,0.3)',
                    }}
                  >
                    {idx + 1}
                  </div>
                  {idx < timelineBullets.length - 1 && (
                    <div
                      className="w-px flex-1 min-h-4"
                      style={{ background: 'var(--color-border)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  className="pb-4 text-xs text-text leading-relaxed"
                  style={{ borderLeft: '2px solid var(--color-cyan)', paddingLeft: 10 }}
                >
                  {bullet.replace(/^[-•*\d.)\s]+/, '')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
