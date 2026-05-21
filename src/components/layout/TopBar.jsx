import React from 'react';
import { IconSearch, IconCommand } from '@tabler/icons-react';
import useIPLStore from '../../store/useIPLStore';
import ThemeToggle from '../ui/ThemeToggle';

const seasons = Array.from({ length: 17 }, (_, i) => 2008 + i);

export default function TopBar() {
  const season = useIPLStore((s) => s.selectedSeason);
  const setSeason = useIPLStore((s) => s.setSeason);
  const searchQuery = useIPLStore((s) => s.searchQuery);
  const setSearchQuery = useIPLStore((s) => s.setSearchQuery);

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border bg-navy">
      {/* Season selector */}
      <div className="shrink-0">
        <select
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          className="bg-surface text-text text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-cyan transition-colors cursor-pointer"
        >
          {seasons.map((yr) => (
            <option key={yr} value={yr}>
              IPL {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Search with Cmd+K hint */}
      <div className="flex-1 max-w-md relative">
        <IconSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          stroke={1.5}
        />
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players, teams, matches..."
          className="w-full bg-surface text-text text-sm border border-border rounded-lg pl-9 pr-16 py-2 outline-none focus:border-cyan transition-colors placeholder:text-muted"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[10px] bg-navy border border-border rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Live indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="live-dot" />
        <span className="text-text text-sm font-medium">IPL 2024 Live</span>
      </div>
    </div>
  );
}
