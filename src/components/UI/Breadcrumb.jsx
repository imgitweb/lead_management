import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { theme } from '../../theme/constants';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {isLast ? (
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{item.label}</span>
            ) : (
              <Link
                to={item.path || '#'}
                style={{
                  fontSize: 13, fontWeight: 500, color: theme.textMuted,
                  textDecoration: 'none', transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; }}
              >
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight style={{ width: 14, height: 14, color: theme.textLight }} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
