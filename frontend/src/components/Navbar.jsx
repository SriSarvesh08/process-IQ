import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { IconSearch, IconBell, IconMoon } from './Icons';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="app-navbar">
      <div className="navbar-search">
        <IconSearch size={16} />
        <input type="text" placeholder="Search tasks, operations..." />
      </div>
      
      <div className="navbar-actions">
        <span className="badge badge-pro">PRO PLAN</span>
        
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <IconMoon size={20} />
        </button>
        
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', position: 'relative' }}>
          <IconBell size={20} />
          <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium">{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
