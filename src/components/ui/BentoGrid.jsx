import React from 'react';

/**
 * Reusable Bento Grid container — 12-column CSS Grid layout.
 * Children specify span via `colSpan` / `rowSpan` inline styles or className.
 * Collapses to 1 column below 768px.
 */
export default function BentoGrid({ children, className = '' }) {
  return (
    <div
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1rem',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-grid > * {
            grid-column: span 1 !important;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * Bento Grid cell with configurable column/row span.
 * @param {Object} props
 * @param {number} [props.colSpan=6] - Number of columns to span (out of 12)
 * @param {number} [props.rowSpan=1] - Number of rows to span
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} props.children
 */
export function BentoCell({ colSpan = 6, rowSpan = 1, className = '', children }) {
  return (
    <div
      className={className}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </div>
  );
}
