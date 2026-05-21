import React from 'react';
import useThemeStore from '../../store/useThemeStore';
import { IconMoon, IconSun } from '@tabler/icons-react';

export default function ThemeToggle() {
  const synthwave = useThemeStore((s) => s.synthwave);
  const toggleSynthwave = useThemeStore((s) => s.toggleSynthwave);

  return (
    <button
      onClick={toggleSynthwave}
      className="
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full
        bg-surface border text-muted
        transition-all duration-200 cursor-pointer
      "
      style={{
        borderColor: synthwave ? '#E040FB' : 'var(--color-border)',
        boxShadow: synthwave ? '0 0 8px #E040FB55, 0 0 2px #E040FB33' : 'none',
        animation: synthwave ? 'synthPulse 2s ease-in-out infinite' : 'none',
      }}
    >
      <style>{`
        @keyframes synthPulse {
          0%, 100% { box-shadow: 0 0 6px #E040FB44; }
          50%      { box-shadow: 0 0 14px #E040FB77, 0 0 4px #E040FB55; }
        }
      `}</style>

      {synthwave ? (
        <IconMoon size={14} stroke={1.8} style={{ color: '#E040FB' }} />
      ) : (
        <IconSun size={14} stroke={1.8} />
      )}

      <span
        className="text-[10px] font-medium uppercase tracking-widest"
        style={{ color: synthwave ? '#E040FB' : undefined }}
      >
        {synthwave ? 'SYNTHWAVE' : 'BROADCAST'}
      </span>
    </button>
  );
}
