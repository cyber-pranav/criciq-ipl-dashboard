import React, { useState, useEffect, useRef } from 'react';
import DeltaBadge from './DeltaBadge';

export default function StatCard({ label, value, delta, prefix = '', suffix = '', icon: Icon }) {
  const [displayed, setDisplayed] = useState(0);
  const [animate, setAnimate] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numericValue)) {
      setDisplayed(value);
      setAnimate(true);
      return;
    }

    const duration = 800;
    const startTime = performance.now();
    const startVal = 0;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (numericValue - startVal) * eased;

      if (Number.isInteger(numericValue)) {
        setDisplayed(Math.round(current));
      } else {
        setDisplayed(parseFloat(current.toFixed(2)));
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setAnimate(true);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const deltaDirection =
    delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';

  const deltaDisplay =
    delta !== undefined && delta !== null
      ? `${Math.abs(delta)}%`
      : null;

  return (
    <div className="stat-card relative">
      {delta !== undefined && delta !== null && (
        <div className="absolute top-4 right-4">
          <DeltaBadge value={deltaDisplay} direction={deltaDirection} size="sm" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <Icon size={20} className="text-muted" stroke={1.5} />
        )}
        <span className="text-muted text-sm">{label}</span>
      </div>

      <div className={`text-mono text-3xl font-semibold text-text ${animate ? 'count-up-enter' : ''}`}>
        {prefix}
        {typeof displayed === 'number' ? displayed.toLocaleString() : displayed}
        {suffix}
      </div>
    </div>
  );
}
