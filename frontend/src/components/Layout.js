import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import logo from '../logo.png';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEmployee = user.role === 'employee';
  const [unreadCount, setUnreadCount] = useState(0);

  // Responsive state variables
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Monitor screen width dynamically to handle breakpoints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); // Auto-close sidebar on window enlarge
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnread = () => {
      api.get('/messages/unread-count')
        .then(res => setUnreadCount(res.data.count || 0))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // Sidebar navigation links by user role
  const adminNav = [
    { path: '/', label: 'لوحة التحكم', icon: '⊞' },
    { path: '/employees', label: 'الموظفون', icon: '👥' },
    { path: '/users', label: 'المستخدمون', icon: '🔐' },
    { path: '/tasks', label: 'المهام', icon: '✓' },
    { path: '/evaluation', label: 'التقييمات', icon: '★' },
    { path: '/attendance', label: 'الحضور', icon: '🗓' },
    { path: '/reports', label: 'التقارير', icon: '📊' },
    { path: '/messages', label: 'الرسائل', icon: '✉', dynamic: true },
    { path: '/settings', label: 'الإعدادات', icon: '⚙' },
  ];

  const employeeNav = [
    { path: '/', label: 'لوحتي', icon: '⊞' },
    { path: '/messages', label: 'رسائلي', icon: '✉', dynamic: true },
    { path: '/settings', label: 'الإعدادات', icon: '⚙' },
  ];

  const navItems = isEmployee ? employeeNav : adminNav;

  // Active page name headers
  const pageNames = {
    '/': isEmployee ? 'لوحتي' : 'لوحة التحكم',
    '/employees': 'الموظفون',
    '/tasks': 'المهام',
    '/evaluation': 'التقييمات',
    '/attendance': 'الحضور',
    '/reports': 'التقارير',
    '/messages': 'الرسائل',
    '/settings': 'الإعدادات',
  };

  const currentPage = pageNames[location.pathname] || 'النظام';

  const roleLabel = {
    admin: 'مدير النظام',
    manager: 'مدير',
    employee: 'موظف',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: 'Segoe UI, Tahoma, sans-serif', direction: 'rtl',
      background: '#f7f8fa'
    }}>

      {/* ── BACKDROP OVERLAY FOR MOBILE SIDEBAR ── */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 110, 86, 0.25)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '220px', background: '#fff',
        borderLeft: '1px solid #ebebeb',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        // Mobile responsive absolute positioning with transitions
        position: isMobile ? 'fixed' : 'relative',
        right: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        zIndex: 1000,
        boxShadow: isMobile ? '-5px 0 25px rgba(0,0,0,0.1)' : 'none',
        transform: isMobile ? (isSidebarOpen ? 'translateX(0)' : 'translateX(100%)') : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>

        {/* Logo and App Title */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #ebebeb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={logo}
              alt="شعار النظام"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F6E56', lineHeight: 1.3 }}>إدارة الأداء</div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>واستمرارية العمل</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => isMobile && setIsSidebarOpen(false)} // Auto-close sidebar on link click
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 16px', fontSize: '13px', textDecoration: 'none',
                color: isActive ? '#0F6E56' : '#666',
                borderRight: isActive ? '3px solid #1D9E75' : '3px solid transparent',
                background: isActive ? '#E8F7F2' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.dynamic && unreadCount > 0 && (
                <span style={{ background: '#E24B4A', color: 'white', fontSize: '10px', borderRadius: '999px', padding: '1px 6px', fontWeight: '700' }}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Profile Summary */}
        <div style={{ borderTop: '1px solid #ebebeb', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: isEmployee ? '#FAEEDA' : '#E1F5EE',
              color: isEmployee ? '#633806' : '#0F6E56',
              fontSize: '12px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {user.name?.slice(0, 2) || 'مس'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '10px', color: '#999' }}>
                {roleLabel[user.role] || user.role}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '16px', padding: '4px', borderRadius: '6px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E24B4A'}
              onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
            >
              ↩
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Header Bar */}
        <header style={{
          height: '52px', background: '#fff',
          borderBottom: '1px solid #ebebeb',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburger Toggle Button for Mobile Screens */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                style={{
                  background: '#E8F7F2',
                  border: 'none',
                  color: '#0F6E56',
                  fontSize: '20px',
                  cursor: 'pointer',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(29,158,117,0.15)',
                  transition: 'background 0.2s',
                  outline: 'none'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#d8f2e8'}
                onMouseLeave={e => e.currentTarget.style.background = '#E8F7F2'}
              >
                ☰
              </button>
            )}
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#222' }}>
              {currentPage}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Show date details only on larger screens */}
            {!isMobile && (
              <div style={{ fontSize: '12px', color: '#888' }}>
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            )}
            <div style={{
              background: isEmployee ? '#FAEEDA' : '#E1F5EE',
              color: isEmployee ? '#633806' : '#0F6E56',
              fontSize: '11px', padding: '3px 10px',
              borderRadius: '999px', fontWeight: '600'
            }}>
              {roleLabel[user.role]}
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '20px 24px', background: '#f7f8fa' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}