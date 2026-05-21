// src/utils/formatters.js
// Formatting utilities for CricIQ dashboard

const TEAM_COLORS = {
  MI: '#004BA0',
  CSK: '#F9CD05',
  RCB: '#EC1C24',
  KKR: '#3A225D',
  DC: '#004C93',
  PBKS: '#ED1B24',
  RR: '#EA1A85',
  SRH: '#FF822A',
  GT: '#1C1C1C',
  LSG: '#A72056',
};

const ROLE_COLORS = {
  Batsman: '#00D4FF',
  Bowler: '#EF4444',
  'All-rounder': '#F59E0B',
};

/**
 * Format a number with comma separators.
 * @param {number} num
 * @returns {string} e.g. 1000 → '1,000'
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-IN');
}

/**
 * Format a number to fixed decimal places.
 * @param {number} num
 * @param {number} places
 * @returns {string}
 */
export function formatDecimal(num, places = 2) {
  if (num == null || isNaN(num)) return '0.00';
  return Number(num).toFixed(places);
}

/**
 * Compute a delta object between current and previous values.
 * @param {number} current
 * @param {number} previous
 * @returns {{ value: string, direction: 'up'|'down', color: string }}
 */
export function formatDelta(current, previous) {
  if (previous == null || previous === 0) {
    return { value: '+0.0', direction: 'up', color: '#10B981' };
  }
  const diff = current - previous;
  const pct = ((diff / Math.abs(previous)) * 100).toFixed(1);
  const direction = diff >= 0 ? 'up' : 'down';
  const color = direction === 'up' ? '#10B981' : '#EF4444';
  const sign = diff >= 0 ? '+' : '';
  return { value: `${sign}${pct}`, direction, color };
}

/**
 * Format overs (e.g. 19.2 remains '19.2', 20 → '20.0').
 * @param {number} overs
 * @returns {string}
 */
export function formatOvers(overs) {
  if (overs == null || isNaN(overs)) return '0.0';
  const full = Math.floor(overs);
  const balls = Math.round((overs - full) * 10);
  // Overs balls are 0-5, so clamp
  if (balls >= 6) {
    return `${full + 1}.0`;
  }
  return `${full}.${balls}`;
}

/**
 * Get the brand colour hex for a team.
 * @param {string} teamShortName  e.g. 'MI', 'CSK'
 * @returns {string} hex colour
 */
export function getTeamColor(teamShortName) {
  return TEAM_COLORS[teamShortName] || '#6B7A99';
}

/**
 * Get badge colour for a player role.
 * @param {string} role  'Batsman' | 'Bowler' | 'All-rounder'
 * @returns {string} hex colour
 */
export function getRoleBadgeColor(role) {
  return ROLE_COLORS[role] || '#6B7A99';
}

/**
 * Truncate a name to maxLen characters, adding '…' if needed.
 * @param {string} name
 * @param {number} maxLen
 * @returns {string}
 */
export function truncateName(name, maxLen = 15) {
  if (!name) return '';
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 1).trimEnd() + '…';
}

/**
 * Format a date string to 'Mar 24, 2024' style.
 * @param {string} dateStr  ISO or parseable date string
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
