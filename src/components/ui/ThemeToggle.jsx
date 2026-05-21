import React from 'react';
import useThemeStore from '../../store/useThemeStore';
import { IconAntenna, IconSparkles } from '@tabler/icons-react';

/**
 * Theme toggle pill: [📡 Broadcast] / [🌈 Synthwave]
 * Switches between the default dark theme and synthwave neon mode.
 */
export default function ThemeToggle() {
  const synthwave = useThemeStore((s) => s.synthwave);
  const toggleSynthwave = useThemeStore((s) => s.toggleSynthwave);

  return (
    <div
      className="inline-flex items-center rounded-full border overflow-hidden"
      style={{
        borderColor: synthwave ? '#E040FB' : 'var(--color-border)',
        boxShadow: synthwave ? '0 0 8px #E040FB55' : 'none',
      }}
    >
      <style>{`
        @keyframes synthPulse {
          0%, 100% { box-shadow: 0 0 6px #E040FB44; }
          50%      { box-shadow: 0 0 14px #E040FB77, 0 0 4px #E040FB55; }
        }
      `}</style>

      {/* Broadcast side */}
      <button
        onClick={() => synthwave && toggleSynthwave()}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-medium uppercase tracking-widest transition-all cursor-pointer"
        style={{
          background: !synthwave ? 'rgba(0,212,255,0.1)' : 'transparent',
          color: !synthwave ? '#00D4FF' : '#6B7A99',
        }}
      >
        <IconAntenna size={12} stroke={1.8} />
        Broadcast
      </button>

      {/* Divider */}
      <div
        className="w-px h-5"
        style={{ background: synthwave ? '#E040FB44' : 'var(--color-border)' }}
      />

      {/* Synthwave side */}
      <button
        onClick={() => !synthwave && toggleSynthwave()}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-medium uppercase tracking-widest transition-all cursor-pointer"
        style={{
          background: synthwave ? 'rgba(224,64,251,0.1)' : 'transparent',
          color: synthwave ? '#E040FB' : '#6B7A99',
          animation: synthwave ? 'synthPulse 2s ease-in-out infinite' : 'none',
        }}
      >
        <IconSparkles size={12} stroke={1.8} />
        Synthwave
      </button>
    </div>
  );
}
