import React, { useContext } from 'react';
import { Bell, Plus, LayoutDashboard, CheckSquare, BarChart2, Activity, Users, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <header style={{ 
      height: '64px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0, // Full width now
      zIndex: 40,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Logo & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', fontWeight: 'bold', fontSize: '18px'
          }}>
            IQ
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Process<span style={{ color: '#2563EB' }}>IQ</span>
          </span>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <NavLink 
                key={link.name}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: isActive ? '#2563EB' : '#64748B',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {link.name}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Right Side Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Create Button */}
        <button 
          onClick={() => navigate('/tasks/create')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.4rem 0.875rem', 
            backgroundColor: '#2563EB', 
            color: '#FFFFFF', 
            border: 'none', 
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Task
        </button>

        {/* Bell Icon */}
        <button style={{ 
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Bell size={20} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#E2E8F0' }}></div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '4px', 
            backgroundColor: '#F1F5F9', color: '#1A1F36',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '600', fontSize: '0.875rem'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', lineHeight: '1' }}>
              {user?.name || 'Sri Sarvesh B'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1' }}>
              {user?.email || 'officialsolo93@gmail.com'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#E2E8F0' }}></div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '6px', borderRadius: '6px', transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Logout"
        >
          <LogOut size={18} strokeWidth={2.5} />
        </button>

      </div>
    </header>
  );
};

export default TopNavbar;
