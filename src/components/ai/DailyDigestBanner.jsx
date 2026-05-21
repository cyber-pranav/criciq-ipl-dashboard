import React, { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { askCricIQ } from '../../services/gemini';

export default function DailyDigestBanner() {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `criciq-digest-${today}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setDigest(cached);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await askCricIQ(
          'Generate a brief 2-sentence IPL morning digest for today. Include one interesting stat and one prediction. Keep it punchy and fan-friendly.'
        );
        setDigest(response);
        localStorage.setItem(cacheKey, response);
      } catch {
        setDigest('IPL 2024 continues to deliver edge-of-seat action! Keep your eyes on the orange cap race — it\'s tighter than ever.');
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="digest-banner bg-surface border border-border border-l-[3px] border-l-cyan rounded-lg px-5 py-3 flex items-start gap-4">
      <div className="flex-1">
        <p className="text-amber text-[10px] font-bold uppercase tracking-widest mb-1">
          ☀️ Morning Brief
        </p>
        {loading ? (
          <div className="skeleton h-4 w-3/4 rounded" />
        ) : (
          <p className="text-text text-sm leading-relaxed">{digest}</p>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted hover:text-text transition-colors mt-0.5 flex-shrink-0"
        aria-label="Dismiss"
      >
        <IconX size={14} stroke={1.5} />
      </button>
    </div>
  );
}
