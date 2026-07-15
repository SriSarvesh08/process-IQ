import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity as ActivityIcon, TrendingUp, Clock, Zap } from 'lucide-react';

const COLORS = ['#2563EB', '#3B82F6', '#93C5FD', '#60A5FA', '#93C5FD'];

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, successRate: '0.0%', avgLatency: '0.0s', activeNodes: 0 });
  const [trendData, setTrendData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const tasks = res.data;

        // Calculate Top Stats
        const total = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed');
        const processingTasks = tasks.filter(t => t.status === 'Processing');
        const successRate = total > 0 ? ((completedTasks.length / total) * 100).toFixed(1) + '%' : '0.0%';
        
        // Calculate Avg Latency
        let totalLatency = 0;
        completedTasks.forEach(t => {
          if (t.updatedAt && t.createdAt) {
            totalLatency += (new Date(t.updatedAt) - new Date(t.createdAt)) / 1000;
          }
        });
        const avgLatency = completedTasks.length > 0 ? (totalLatency / completedTasks.length).toFixed(1) + 's' : '0.0s';
        
        // Active Nodes (approximate by processing tasks)
        const activeNodes = processingTasks.length > 0 ? processingTasks.length : 1; // Assuming at least 1 worker is alive

        setStats({ total, successRate, avgLatency, activeNodes });

        // Calculate Pie Data
        const operationCounts = {};
        tasks.forEach(t => {
          operationCounts[t.operation] = (operationCounts[t.operation] || 0) + 1;
        });
        const newPieData = Object.keys(operationCounts).map(op => ({
          name: op,
          value: operationCounts[op]
        }));
        setPieData(newPieData);

        // Calculate Trend Data (Group by Day)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        }).reverse();

        const newTrendData = last7Days.map(day => {
          // Find tasks that fall on this day
          const dayTasks = tasks.filter(t => new Date(t.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) === day);
          return {
            name: day,
            completed: dayTasks.filter(t => t.status === 'Completed').length,
            failed: dayTasks.filter(t => t.status === 'Failed').length,
          };
        });
        setTrendData(newTrendData);

      } catch (error) {
        console.error('Failed to fetch analytics', error);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
        <p className="text-muted">Gain insights into your task processing volume and system performance.</p>
      </div>

      {/* Top Stats */}
      <div className="grid-cols-4 mb-8">
        <div className="card flex items-center gap-4">
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-hover)', color: 'var(--primary)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Total Processed</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-hover)', color: 'var(--success)' }}>
            <ActivityIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Success Rate</p>
            <p className="text-2xl font-bold">{stats.successRate}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-hover)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Avg. Latency</p>
            <p className="text-2xl font-bold">{stats.avgLatency}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-hover)', color: 'var(--primary)' }}>
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Active Nodes</p>
            <p className="text-2xl font-bold">{stats.activeNodes}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Main Chart */}
        <div className="card flex-1">
          <h2 className="text-lg font-bold mb-6">Task Execution Trends</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="flex flex-col gap-8 w-full lg:w-[400px]">
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Task Types</h2>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center flex-wrap gap-4 text-xs font-medium mt-2">
              {pieData.map((entry, index) => (
                <span key={index} className="flex items-center gap-1">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span> 
                  {entry.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default Analytics;
