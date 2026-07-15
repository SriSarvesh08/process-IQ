import React, { useState, useEffect, useContext } from 'react';
import { 
  CheckCircle2, Clock, XCircle, Activity, 
  ArrowUpRight, ArrowDownRight, Plus, 
  Cpu, Database, Network, Zap, List, FileText, ChevronRight, Settings, ExternalLink, HardDrive, Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('Good Morning');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else if (hour >= 17) setGreeting('Good Evening');

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  // Compute KPIs
  const totalTasks = tasks.length;
  const processingTasks = tasks.filter(t => t.status === 'Processing').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const failedTasks = tasks.filter(t => t.status === 'Failed').length;

  const successRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
  const failureRate = totalTasks > 0 ? ((failedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Compute Trend Data (Last 7 Days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  const usageData = last7Days.map(day => {
    const dayTasks = tasks.filter(t => new Date(t.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) === day);
    return {
      name: day,
      tasks: dayTasks.length,
      failed: dayTasks.filter(t => t.status === 'Failed').length,
    };
  });

  // Compute Pie Data
  const opCounts = {};
  tasks.forEach(t => {
    opCounts[t.operation] = (opCounts[t.operation] || 0) + 1;
  });
  const pieData = Object.keys(opCounts).map(op => ({ name: op, value: opCounts[op] }));

  // Activities map
  const mappedActivities = tasks.slice(0, 4).map(task => {
    let color = '#2563EB'; // Primary Blue
    let icon = Clock;
    if (task.status === 'Completed') {
      color = '#10B981'; // Green
      icon = CheckCircle2;
    } else if (task.status === 'Failed') {
      color = '#EF4444'; // Red
      icon = XCircle;
    } else if (task.status === 'Processing') {
      color = '#3B82F6'; // Light Blue
      icon = Activity;
    } else {
      color = '#F59E0B'; // Orange for Queued/Pending
      icon = Clock;
    }
    return { 
      id: task._id, 
      color, 
      icon,
      operation: task.operation,
      status: task.status,
      time: new Date(task.updatedAt || task.createdAt).toLocaleString() 
    };
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>Completed</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span> Processing</span>;
      case 'Failed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>Queued</span>;
    }
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #F1F5F9',
    padding: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto space-y-8"
        style={{ padding: '2.5rem 2rem' }}
      >
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{greeting}, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            <p className="text-slate-500 font-medium">Welcome back. Here's today's processing overview.</p>
          </div>
        </div>

        {/* 1st Row: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} style={cardStyle} className="flex flex-col justify-between group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <List size={22} strokeWidth={2.5} />
              </div>
              <Activity size={24} className="text-blue-200" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">{totalTasks.toLocaleString()}</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} style={cardStyle} className="flex flex-col justify-between group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <Zap size={22} strokeWidth={2.5} />
              </div>
              <span className="relative flex h-3 w-3 mt-1 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Processing</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">{processingTasks.toLocaleString()}</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} style={cardStyle} className="flex flex-col justify-between group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <CheckCircle2 size={22} strokeWidth={2.5} />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full text-xs border border-emerald-100">
                <ArrowUpRight size={14}/> {successRate}%
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">{completedTasks.toLocaleString()}</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} style={cardStyle} className="flex flex-col justify-between group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                <XCircle size={22} strokeWidth={2.5} />
              </div>
              <span className="flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-1 rounded-full text-xs border border-rose-100">
                <ArrowDownRight size={14}/> {failureRate}%
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Failed</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">{failedTasks.toLocaleString()}</div>
            </div>
          </motion.div>
        </div>

        {/* 2nd Row: Analytics & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div style={cardStyle} className="lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Task Activity</h3>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 font-medium outline-none cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#FFFFFF', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}
                  />
                  <Area type="monotone" dataKey="tasks" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div style={{...cardStyle, background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', border: 'none'}} className="flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Cpu size={120} />
            </div>
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-white">Usage Overview</h3>
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">PRO PLAN</span>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-400 font-medium text-sm">Monthly Tasks</span>
                  <span className="text-white font-bold">{totalTasks.toLocaleString()} <span className="text-slate-500 font-normal">/ 100k</span></span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min((totalTasks / 100000) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-auto">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <HardDrive size={18} className="text-slate-400 mb-2" />
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-1 tracking-wider">Storage</p>
                  <p className="text-white font-bold text-lg">1.2 GB</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <Network size={18} className="text-slate-400 mb-2" />
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-1 tracking-wider">API Calls</p>
                  <p className="text-white font-bold text-lg">{(totalTasks * 1.5).toFixed(0)}</p>
                </div>
              </div>

              <Link to="/settings" className="w-full mt-6">
                <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-sm cursor-pointer">
                  Manage Billing
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3rd Row: Tables & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={cardStyle}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Recent Processing</h3>
              <Link to="/tasks" className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">View All <ChevronRight size={16}/></Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Task ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Operation</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {tasks.slice(0, 5).map(task => (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/tasks')}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-slate-600 font-medium">
                        {task._id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={12} strokeWidth={3}/></div>
                        {task.operation}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 text-right font-medium">
                        {new Date(task.updatedAt || task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr><td colSpan="4" className="text-center text-slate-500 p-6 font-medium">No tasks found. Start by creating one.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={cardStyle} className="flex flex-col">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Operation Distribution</h3>
            <div className="flex-1 flex flex-col justify-center">
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={75} 
                      outerRadius={105} 
                      paddingAngle={5} 
                      dataKey="value" 
                      stroke="none"
                      cornerRadius={8}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#FFFFFF', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-slate-700 text-sm font-semibold">{item.name}</span>
                    <span className="text-slate-900 text-sm font-bold ml-1">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4th Row: Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={cardStyle}>
            <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Activity Timeline</h3>
            <div className="relative pl-6 border-l-2 border-slate-200 ml-4 space-y-8 mt-4">
              {mappedActivities.length === 0 ? (
                <div className="text-slate-500 font-medium">No activity to display.</div>
              ) : (
                mappedActivities.map((act, index) => (
                  <div key={`${act.id}-${index}`} className="relative">
                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: act.color, left: '-42px', top: '-4px' }}>
                      <act.icon size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm m-0 mb-1">{act.status} • {act.operation}</h4>
                    <p className="text-sm font-medium text-slate-500 m-0">Task ID: <span className="font-mono text-xs text-slate-400">{act.id.substring(0, 8)}</span></p>
                    <span className="text-xs font-semibold text-slate-400 mt-2 block">{act.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 className="font-bold text-lg text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              
              <Link to="/tasks/create">
                <motion.div whileHover={{ y: -4, borderColor: '#3B82F6', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)' }} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer h-full transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plus size={22} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Create Task</h4>
                  <p className="text-xs text-slate-500 font-medium">Initialize a new AI process.</p>
                </motion.div>
              </Link>

              <Link to="/tasks">
                <motion.div whileHover={{ y: -4, borderColor: '#10B981', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)' }} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer h-full transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <List size={22} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">View Tasks</h4>
                  <p className="text-xs text-slate-500 font-medium">Browse processing history.</p>
                </motion.div>
              </Link>

              <Link to="/settings">
                <motion.div whileHover={{ y: -4, borderColor: '#6366F1', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.1)' }} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer h-full transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Settings size={22} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Settings</h4>
                  <p className="text-xs text-slate-500 font-medium">Manage billing & profile.</p>
                </motion.div>
              </Link>

              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ y: -4, borderColor: '#F59E0B', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.1)' }} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer h-full transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <ExternalLink size={22} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">API Docs</h4>
                  <p className="text-xs text-slate-500 font-medium">Read integration guides.</p>
                </motion.div>
              </a>

            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;
