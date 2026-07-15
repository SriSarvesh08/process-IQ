import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CheckSquare, Settings, 
  BarChart2, Activity, LogOut, PieChart, Box
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
    { name: 'Activity', icon: Activity, path: '/activity' },
    { name: 'Users', icon: BarChart2, path: '/users' },
  ];

  return (
    <aside style={{ 
      width: '260px', 
      backgroundColor: '#0F172A', 
      color: '#94A3B8', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: 'none',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '28px', height: '28px', borderRadius: '6px', 
          backgroundColor: '#E2E8F0', color: '#0F172A',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Box size={18} strokeWidth={2.5} />
        </div>
        <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '1.125rem', letterSpacing: '-0.025em' }}>
          ProcessIQ
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '0.6rem 1rem', borderRadius: '8px',
              color: isActive ? '#FFFFFF' : '#94A3B8',
              backgroundColor: isActive ? 'transparent' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            })}
            onMouseOver={(e) => {
              if (e.currentTarget.style.color !== 'rgb(255, 255, 255)') { // If not active
                e.currentTarget.style.color = '#F1F5F9';
              }
            }}
            onMouseOut={(e) => {
              if (e.currentTarget.getAttribute('aria-current') !== 'page') {
                e.currentTarget.style.color = '#94A3B8';
              }
            }}
          >
            <item.icon size={18} strokeWidth={2} style={{ color: 'inherit' }} />
            <span>{item.name}</span>
          </NavLink>
        ))}
        
        {/* Separator for Settings */}
        <div style={{ margin: '0.5rem 0' }}></div>
        
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '0.6rem 1rem', borderRadius: '8px',
            color: isActive ? '#FFFFFF' : '#94A3B8',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent', // The subtle grey rounded box in the image
            textDecoration: 'none',
            fontWeight: isActive ? '600' : '500',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          })}
          onMouseOver={(e) => {
            if (e.currentTarget.getAttribute('aria-current') !== 'page') {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#F1F5F9';
            }
          }}
          onMouseOut={(e) => {
            if (e.currentTarget.getAttribute('aria-current') !== 'page') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }
          }}
        >
          <Settings size={18} strokeWidth={2} style={{ color: 'inherit' }} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: '0.6rem 1rem', borderRadius: '8px',
            color: '#94A3B8', backgroundColor: 'transparent',
            border: 'none', cursor: 'pointer',
            fontWeight: '500', fontSize: '0.875rem',
            transition: 'all 0.2s', textAlign: 'left'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#F1F5F9'}
          onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
