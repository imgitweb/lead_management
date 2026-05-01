import React from 'react';
import { theme } from '../../theme/constants';

const Table = ({
  columns,
  data,
  rowKey = 'id',
  emptyMessage = 'No data available',
  compact = false,
}) => {
  const cellPadding = compact ? '10px 14px' : '13px 20px';
  const minWidth = compact ? 520 : 600;
  const headerFontSize = compact ? 11 : 12;

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth, tableLayout: 'auto' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{
                padding: cellPadding, fontSize: headerFontSize, fontWeight: 600,
                color: theme.tableHeaderText, textTransform: 'uppercase',
                letterSpacing: '0.04em', background: theme.tableHeaderBg, whiteSpace: 'nowrap',
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row[rowKey] || rowIndex} style={{
                borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = theme.tableRowHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = theme.tableBg; }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: cellPadding, color: theme.textSecondary, whiteSpace: 'nowrap' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{
                padding: '32px 20px', textAlign: 'center',
                color: theme.textLight, fontStyle: 'italic',
              }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
