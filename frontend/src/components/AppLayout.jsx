import React from 'react';
import TopNavbar from './TopNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="app-shell">
      <main className="app-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNavbar />
        <div className="app-content" style={{ marginTop: '64px', flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
