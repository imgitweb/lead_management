import React from 'react';
import { Bell, Search, LogOut, User, Settings as SettingsIcon, Menu, Users } from 'lucide-react';
import { theme } from '../../theme/constants';
import { useAuth } from '../../context/AuthContext';
import DropdownMenu from '../UI/DropdownMenu';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onHamburger }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      minHeight: 60, padding: '12px clamp(12px, 2vw, 28px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, flexWrap: 'wrap',
      background: theme.topbarBg, borderBottom: `1px solid ${theme.topbarBorder}`,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isMobile && (
          <button onClick={onHamburger} style={{ background: 'none', border: 'none', padding: 0, marginRight: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
           <Menu style={{ width: 20, height: 20, color: theme.textPrimary }} />
          </button>
        )}
      </div>
      <div style={{ position: 'relative', flex: '1 1 260px', width: '100%', maxWidth: isMobile ? '100%' : 380, minWidth: 0, display: isMobile ? (window.innerWidth < 600 ? 'none' : 'block') : 'block' }}>
        <Search style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          width: 16, height: 16, color: theme.inputPlaceholder, pointerEvents: 'none',
        }} />
        <input
          type="text" placeholder="Search..."
          style={{
            width: '100%', padding: '9px 14px 9px 38px',
            fontSize: 14, color: theme.inputText, background: theme.pageBg,
            border: `1px solid ${theme.inputBorder}`, borderRadius: theme.radiusSm, outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = theme.primary; }}
          onBlur={(e) => { e.target.style.borderColor = theme.inputBorder; }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
        <div style={{
          display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
          border: `1px solid ${theme.inputBorder}`, background: theme.cardBg,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ color: theme.textMuted, marginRight: 6 }}>Running</span>
          <span style={{ color: theme.textPrimary }}>{now.toLocaleTimeString()}</span>
        </div>

        <button style={{
          position: 'relative', padding: 8, color: theme.textMuted,
          background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = theme.textPrimary; e.currentTarget.style.background = '#f0f0f0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = 'transparent'; }}
          onClick={() => navigate('/notifications')}
        >
          <Bell style={{ width: 20, height: 20 }} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: `2px solid ${theme.topbarBg}` }} />
        </button>

        {/* User Profile Dropdown */}
        <div style={{ height: 32, width: 1, background: theme.topbarBorder, margin: '0 4px' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right', display: window.innerWidth > 768 ? 'block' : 'none' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, lineHeight: 1.2 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>{user?.role || 'Member'}</div>
          </div>
          
          <DropdownMenu
            trigger={
              <button style={{
                width: 36, height: 36, borderRadius: 10, overflow: 'hidden',
                border: `2px solid ${theme.cardBorder}`, cursor: 'pointer',
                padding: 0, background: theme.cardBg
              }}>
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Guest'}`} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
            }
            items={[
              { icon: User, label: 'My Profile', onClick: () => navigate('/profile') },
              {icon: Users, label: 'User', onClick: () => navigate('/users')},
              // { icon: SettingsIcon, label: 'Settings', onClick: () => navigate('/settings') },
              { divider: true },
              { icon: LogOut, label: 'Sign Out', danger: true, onClick: logout },
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
