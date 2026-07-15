import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Shield, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  const { user } = useContext(AuthContext);

  const realUser = user ? {
    id: user._id || 1,
    name: user.name || 'Current User',
    email: user.email || 'user@example.com',
    role: 'Admin', // Default to Admin for now since there are no roles
    status: 'Active',
    initials: (user.name || 'U').substring(0, 2).toUpperCase()
  } : null;

  const usersList = realUser ? [realUser] : [];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">User Management</h1>
          <p className="text-muted">Manage your team members and their access roles.</p>
        </div>
        <button className="btn btn-primary">Invite User</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Added</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted p-4">Loading user data...</td>
                </tr>
              ) : usersList.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-hover)', color: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '600', fontSize: '0.875rem'
                      }}>
                        {u.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{u.name}</div>
                        <div className="text-xs text-muted flex items-center gap-1"><Mail size={12}/> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Shield size={14} className={u.role === 'Admin' ? 'text-primary' : 'text-muted'}/>
                      {u.role}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-completed' : 'badge-pending'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-muted text-sm">Today</td>
                  <td>
                    <button className="btn-ghost p-2 rounded-md"><MoreHorizontal size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Users;
