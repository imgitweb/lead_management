import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { createPortal } from 'react-dom';
import { theme } from '../../theme/constants';

const DropdownMenu = ({ items = [], trigger, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
 const menuRef = useRef(null);
useEffect(() => {
  const handleClick = (e) => {
    if (
      ref.current &&
      !ref.current.contains(e.target) &&
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClick);
  return () => document.removeEventListener('mousedown', handleClick);
}, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
        {trigger || (
          <button style={{
            padding: 6, borderRadius: 6, border: 'none',
            background: open ? '#f0f0f0' : 'transparent',
            color: theme.textMuted, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <MoreVertical style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      {open && (
          createPortal(
        <div 
          ref={menuRef}
     style={{
        position: 'absolute',
        top: ref.current?.getBoundingClientRect().bottom + window.scrollY + 6,
        left:
          align === 'right'
            ? ref.current?.getBoundingClientRect().right - 180 + window.scrollX
            : ref.current?.getBoundingClientRect().left + window.scrollX,
        minWidth: 180,
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 10,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        padding: '6px 0',
        zIndex: 99999,
        animation: 'dropIn 0.15s ease',
      }}>
          {items.map((item, i) => {
            if (item.divider) return <div key={i} style={{ height: 1, background: theme.cardBorder, margin: '4px 0' }} />;

            return (
              <button
                key={i}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                disabled={item.disabled}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 14px', border: 'none',
                  background: 'transparent', cursor: item.disabled ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 500, textAlign: 'left',
                  color: item.danger ? '#ef4444' : item.disabled ? theme.textLight : theme.textSecondary,
                  opacity: item.disabled ? 0.5 : 1,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { if (!item.disabled) e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {item.icon && <item.icon style={{ width: 15, height: 15, flexShrink: 0 }} />}
                {item.label}
              </button>
            );
          })}
        </div>,
        document.body
          )
      )}

      <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default DropdownMenu;
