import React from 'react';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';

export default function StatTable({ columns, data, onSort, sortKey, sortDir }) {
  const renderSortIcon = (colKey) => {
    if (!onSort) return null;

    if (sortKey === colKey) {
      return sortDir === 'asc' ? (
        <IconChevronUp size={14} className="inline ml-1" stroke={1.5} />
      ) : (
        <IconChevronDown size={14} className="inline ml-1" stroke={1.5} />
      );
    }
    return <IconSelector size={14} className="inline ml-1 text-muted opacity-40" stroke={1.5} />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={onSort ? 'cursor-pointer select-none' : ''}
                style={{ textAlign: col.align || 'left' }}
                onClick={() => onSort && onSort(col.key)}
              >
                {col.label}
                {renderSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={row.id ?? rowIdx}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || 'left' }}
                    className={col.mono !== false ? 'text-mono' : ''}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-8">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
