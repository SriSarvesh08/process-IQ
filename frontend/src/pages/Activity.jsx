import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity as ActivityIcon, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const tasks = res.data;
        
        const mappedActivities = tasks.map(task => {
          let type = 'info';
          let title = 'Task Started';
          let icon = Clock;
          let description = `${task.operation} (ID: ${task._id.substring(0, 8)}) is running.`;
          
          if (task.status === 'Completed') {
            type = 'success';
            title = 'Task Completed';
            icon = CheckCircle2;
            description = `${task.operation} (ID: ${task._id.substring(0, 8)}) finished successfully.`;
          } else if (task.status === 'Failed') {
            type = 'error';
            title = 'Task Failed';
            icon = XCircle;
            description = `${task.operation} (ID: ${task._id.substring(0, 8)}) failed to process.`;
          }

          return {
            id: task._id,
            type,
            title,
            description,
            time: new Date(task.updatedAt || task.createdAt).toLocaleString(),
            icon,
            timestamp: new Date(task.updatedAt || task.createdAt).getTime()
          };
        });

        // Sort descending by timestamp
        mappedActivities.sort((a, b) => b.timestamp - a.timestamp);
        
        setActivities(mappedActivities);
      } catch (error) {
        console.error('Failed to fetch activity', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">System Activity</h1>
        <p className="text-muted">A comprehensive timeline of background events and task states.</p>
      </div>

      <div className="card">
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="text-center text-muted p-4">Loading activity...</div>
          ) : activities.length === 0 ? (
            <div className="text-center text-muted p-4">No recent activity.</div>
          ) : (
            activities.map((item, index) => (
              <div key={item.id} className="flex gap-4 relative">
                {/* Timeline Line */}
                {index !== activities.length - 1 && (
                  <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-24px', width: '2px', backgroundColor: 'var(--border)' }}></div>
                )}
              
              {/* Icon */}
              <div 
                className="flex-shrink-0"
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  backgroundColor: item.type === 'success' ? 'var(--success-bg)' : item.type === 'error' ? 'var(--danger-bg)' : item.type === 'warning' ? 'var(--warning-bg)' : 'var(--bg-hover)',
                  color: item.type === 'success' ? 'var(--success)' : item.type === 'error' ? 'var(--danger)' : item.type === 'warning' ? 'var(--warning)' : 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <item.icon size={20} />
              </div>

                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <span className="text-xs text-muted font-medium">{item.time}</span>
                  </div>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Activity;
