import React from 'react';

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5 gap-0.5',
  md: 'text-sm px-2 py-1 gap-1',
};

export default function DeltaBadge({ value, direction = 'neutral', size = 'sm' }) {
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '–';

  const colorClass =
    direction === 'up'
      ? 'text-success'
      : direction === 'down'
        ? 'text-danger'
        : 'text-muted';

  return (
    <span
      className={`inline-flex items-center font-mono rounded ${sizeClasses[size]} ${colorClass}`}
    >
      <span>{arrow}</span>
      {value !== undefined && value !== null && <span>{value}</span>}
    </span>
  );
}
