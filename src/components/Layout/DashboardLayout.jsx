import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { theme } from '../../theme/constants';

const EXPANDED_W = 256;
const COLLAPSED_W = 72;

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? COLLAPSED_W : EXPANDED_W),
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh', background: theme.pageBg,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        minWidth: 0,
      }}>
        <Topbar onHamburger={() => setMobileOpen(true)} />
        <main style={{ flex: 1, padding: '16px clamp(12px, 2vw, 20px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
