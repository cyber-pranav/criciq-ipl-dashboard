import React from 'react';
import useIPLStore from '../../store/useIPLStore';

const fallbackMatches = [
  'MI vs CSK • MI 186/4 (19.2) • CSK need 47 off 4.4 overs',
  'RCB vs KKR • RCB 201/3 (20) • KKR 145/6 (16.2)',
  'DC vs RR • DC 175/8 (20) • RR 112/4 (13.1)',
  'SRH vs PBKS • SRH 220/2 (20) • PBKS need 91 off 36 balls',
  'GT vs LSG • GT 168/5 (20) • LSG 170/3 (18.4) • LSG win by 7 wkts',
];

export default function LiveTicker() {
  const liveMatches = useIPLStore((s) => s.liveMatches);

  const items =
    liveMatches && liveMatches.length > 0
      ? liveMatches.map(
          (m) =>
            `${m.team1} vs ${m.team2} • ${m.team1} ${m.score1} • ${m.summary || ''}`
        )
      : fallbackMatches;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-b border-border bg-surface py-2">
      <div className="ticker-track">
        {doubled.map((item, idx) => (
          <span key={idx} className="flex items-center gap-4 shrink-0">
            <span className="text-text text-xs whitespace-nowrap">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
