import React from 'react';
import useThemeStore, { FRANCHISE_THEMES } from '../../store/useThemeStore';
import useIPLStore from '../../store/useIPLStore';
import { getTeams } from '../../services/iplData';

const TEAM_IDS = Object.keys(FRANCHISE_THEMES).filter((k) => k !== 'default');

export default function FranchisePicker() {
  const showPicker = useThemeStore((s) => s.showPicker);
  const setFranchise = useThemeStore((s) => s.setFranchise);
  const setFanTeam = useIPLStore((s) => s.setFanTeam);

  if (!showPicker) return null;

  const teamsList = getTeams();

  const handleSelect = (id) => {
    // 1. Apply theme visuals
    setFranchise(id);
    // 2. Persist fan team preference (localStorage now, Firestore upgrade later)
    setFanTeam(id === 'default' ? null : id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      style={{ animation: 'franchiseFadeIn 0.3s ease-out' }}
    >
      <style>{`
        @keyframes franchiseFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        className="bg-surface border border-border rounded-xl p-6 w-full mx-4"
        style={{ maxWidth: 520 }}
      >
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-text">Choose Your Franchise</h2>
          <p className="text-muted text-xs mt-1">
            Your dashboard will adapt to your team's identity — stats, colors, and player highlights
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {TEAM_IDS.map((id) => {
            const theme = FRANCHISE_THEMES[id];
            const info = teamsList.find((t) => t.id === id) || {
              shortName: id.toUpperCase(),
              name: theme.name,
            };
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className="
                  text-left bg-navy border border-border rounded-lg px-3 py-3
                  transition-colors duration-150 cursor-pointer
                  hover:border-transparent
                "
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: theme.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.borderLeftColor = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.borderLeftColor = theme.primary;
                }}
              >
                <span
                  className="block text-sm font-bold leading-tight text-text"
                >
                  {info.shortName}
                </span>
                <span className="block text-[10px] text-muted leading-tight mt-0.5 truncate">
                  {info.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stay Neutral */}
        <button
          onClick={() => handleSelect('default')}
          className="
            mt-4 w-full py-2 rounded-lg text-xs font-medium uppercase tracking-widest
            text-muted bg-navy border border-border
            hover:border-cyan hover:text-cyan transition-colors duration-150
            cursor-pointer
          "
        >
          Stay Neutral
        </button>
      </div>
    </div>
  );
}
