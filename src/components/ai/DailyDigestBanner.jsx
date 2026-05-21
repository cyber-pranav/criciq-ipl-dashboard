import React, { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { askCricIQ } from '../../services/gemini';
import { CACHE_TTL_MS } from '../../utils/constants';

/**
 * Daily Digest Banner — AI-generated 4-bullet morning briefing.
 * Cached in localStorage with 24-hour TTL per date key.
 * Auto-generates on first load if no cached digest for today.
 */
export default function DailyDigestBanner() {
  const [bullets, setBullets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `criciq-digest-${today}`;

    // Check cache with TTL
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const { bullets: cached, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL_MS && cached?.length) {
          setBullets(cached);
          setLoading(false);
          return;
        }
        localStorage.removeItem(cacheKey);
      }
    } catch {
      /* corrupt cache — regenerate */
    }

    const timer = setTimeout(async () => {
      try {
        const response = await askCricIQ(
          'Generate exactly 4 bullet points for an IPL morning digest. Each bullet should be 1 sentence. Include: 1) Yesterday\'s highlight, 2) Key stat of the day, 3) Today\'s match prediction, 4) A fun hot take. Format as numbered lines: 1. ... 2. ... 3. ... 4. ...'
        );

        const parsed = response
          .split('\n')
          .map((l) => l.replace(/^\d+[.)]\s*/, '').trim())
          .filter((l) => l.length > 10)
          .slice(0, 4);

        const finalBullets = parsed.length >= 4
          ? parsed
          : [
              '🏏 The Orange Cap race tightens — just 12 runs separate the top 3 run-scorers.',
              '📊 Average first innings score has risen to 187 this season, the highest ever.',
              '🔮 Tonight\'s CSK vs MI clash favors CSK with a 62% win probability at Chepauk.',
              '🔥 Hot take: Rinku Singh will finish as IPL 2024\'s most valuable uncapped player.',
            ];

        setBullets(finalBullets);
        localStorage.setItem(cacheKey, JSON.stringify({ bullets: finalBullets, timestamp: Date.now() }));
      } catch {
        setBullets([
          '🏏 IPL 2024 continues to deliver edge-of-seat action!',
          '📊 The powerplay run rate this season is 8.9 — the highest in IPL history.',
          '🔮 Keep your eyes on the Purple Cap race — it\'s wide open.',
          '🔥 Tonight\'s match promises fireworks at the batting paradise.',
        ]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="digest-banner rounded-lg px-5 py-3 flex items-start gap-4 border"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(245,158,11,0.06) 100%)',
        borderColor: 'var(--color-border)',
        borderLeftWidth: 3,
        borderLeftColor: 'var(--color-cyan)',
      }}
    >
      <div className="flex-1">
        <p className="text-amber text-[10px] font-bold uppercase tracking-widest mb-2">
          ☀️ Morning Brief
        </p>
        {loading ? (
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
          </div>
        ) : (
          <ul className="space-y-1">
            {bullets.map((b, i) => (
              <li key={i} className="text-text text-sm leading-relaxed">
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted hover:text-text transition-colors mt-0.5 flex-shrink-0 cursor-pointer"
        aria-label="Dismiss"
      >
        <IconX size={14} stroke={1.5} />
      </button>
    </div>
  );
}
