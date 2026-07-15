import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-split">
      <div className="auth-left">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8">
            <div style={{
              width: '40px', height: '40px', borderRadius: '8px', 
              backgroundColor: 'var(--primary)', color: 'var(--bg-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '1.25rem'
            }}>
              AP
            </div>
            <span style={{ fontWeight: '600', fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>AI Platform</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Enterprise AI Task Processing.</h1>
          <p className="text-muted text-lg" style={{ maxWidth: '420px', lineHeight: '1.6' }}>
            Automate, monitor, and scale your intelligent workflows with precision and reliability.
          </p>
        </motion.div>
      </div>
      <div className="auth-right">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
