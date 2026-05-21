import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconUsers,
  IconShield,
  IconSwords,
  IconMessageCircle,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: IconDashboard },
  { to: '/players', label: 'Players', icon: IconUsers },
  { to: '/teams', label: 'Teams', icon: IconShield },
  { to: '/head-to-head', label: 'Head to Head', icon: IconSwords },
  { to: '/ask', label: 'Ask AI', icon: IconMessageCircle },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 text-text bg-surface border border-border rounded-lg p-2"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <IconX size={20} stroke={1.5} /> : <IconMenu2 size={20} stroke={1.5} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-navy/60 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-60 bg-navy border-r border-border z-40
          flex flex-col transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-2">
          <span className="text-cyan text-2xl font-bold tracking-tight">CricIQ</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? 'text-cyan border-l-2 border-cyan bg-surface'
                      : 'text-muted hover:text-text hover:bg-surface-hover border-l-2 border-transparent'
                  }
                `}
              >
                <Icon size={18} stroke={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom badge */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-muted text-xs">Powered by Google Cloud</p>
        </div>
      </aside>
    </>
  );
}
