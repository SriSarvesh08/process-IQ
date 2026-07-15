import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, Clock, PlayCircle, Plus, 
  MoreHorizontal, Eye, Edit3, Trash2, ArrowUpDown, Server
} from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchTasks(true);
    const intervalId = setInterval(() => {
      fetchTasks(false);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchTasks = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(res.data);
    } catch (error) {
      if (showLoading) toast.error('Failed to load tasks');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Are you sure you want to delete this task?</span>
        <div className="flex gap-2">
          <button 
            className="btn btn-danger text-xs py-1"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${id}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Task deleted successfully');
                fetchTasks();
              } catch (error) {
                toast.error('Failed to delete task');
              }
            }}
          >
            Confirm
          </button>
          <button className="btn btn-secondary text-xs py-1" onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.operation?.toLowerCase().includes(search.toLowerCase()) || task._id.includes(search);
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    switch (normalizedStatus) {
      case 'completed': return <span className="badge badge-completed">Completed</span>;
      case 'processing': return <span className="badge badge-processing">Processing</span>;
      case 'failed': return <span className="badge badge-failed">Failed</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  const getDuration = (task) => {
    if (task.status === 'Completed' || task.status === 'Failed') {
      if (!task.updatedAt || !task.createdAt) return '-';
      const start = new Date(task.createdAt);
      const end = new Date(task.updatedAt);
      return `${((end - start) / 1000).toFixed(1)}s`;
    }
    if (task.status === 'Processing') {
      const start = new Date(task.createdAt);
      const now = new Date();
      return `${((now - start) / 1000).toFixed(1)}s`;
    }
    return '-';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Tasks</h1>
          <p className="text-muted">Manage and monitor all background processing tasks.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary shadow-sm"><Filter size={16} /> Advanced Filters</button>
          <Link to="/create-task" className="btn btn-primary shadow-sm"><Plus size={16} /> Create Task</Link>
        </div>
      </div>

      <div className="card p-0 overflow-hidden flex flex-col shadow-sm">
        
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-main)' }}>
          <div className="flex flex-1 gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by ID or Operation..." 
                className="form-input shadow-sm"
                style={{ paddingLeft: '2.5rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="form-input w-40 shadow-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted">Bulk Actions:</span>
            <button className="btn-secondary p-2 rounded-md shadow-sm opacity-50 cursor-not-allowed" disabled title="Select rows first"><PlayCircle size={16}/></button>
            <button className="btn-secondary p-2 rounded-md shadow-sm opacity-50 cursor-not-allowed" disabled title="Select rows first"><Trash2 size={16}/></button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '1.5rem' }}><input type="checkbox" className="rounded border-gray-300" /></th>
                <th><div className="flex items-center gap-1 cursor-pointer">Task ID <ArrowUpDown size={12}/></div></th>
                <th>Operation</th>
                <th>Status</th>
                <th><div className="flex items-center gap-1 cursor-pointer">Created <ArrowUpDown size={12}/></div></th>
                <th>Duration</th>
                <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, idx) => (
                  <tr key={idx}>
                    <td style={{ paddingLeft: '1.5rem' }}><Skeleton width={20} /></td>
                    <td><Skeleton width={100} /></td>
                    <td><Skeleton width={120} /></td>
                    <td><Skeleton width={80} /></td>
                    <td><Skeleton width={150} /></td>
                    <td><Skeleton width={60} /></td>
                    <td style={{ paddingRight: '1.5rem' }}><Skeleton width={80} /></td>
                  </tr>
                ))
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-hover)' }}><Server size={32} className="text-muted" /></div>
                      <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
                      <p className="text-muted text-sm mb-4 max-w-sm">We couldn't find any tasks matching your criteria. Try adjusting your filters.</p>
                      <button className="btn btn-secondary text-sm" onClick={() => { setSearch(''); setStatusFilter('All'); }}>Clear Filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task._id} className="group">
                    <td style={{ paddingLeft: '1.5rem' }}><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="font-mono text-sm">
                      <Link to={`/tasks/${task._id}`} className="text-primary hover:underline">{task._id.substring(0, 8)}...</Link>
                    </td>
                    <td className="font-medium">{task.operation}</td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td className="text-sm text-muted">{new Date(task.createdAt).toLocaleString()}</td>
                    <td className="text-sm text-muted flex items-center gap-1 mt-1"><Clock size={12}/> {getDuration(task)}</td>
                    <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/tasks/${task._id}`} className="btn-ghost p-2 rounded-md" title="View Details"><Eye size={16} /></Link>
                        <Link to={`/edit-task/${task._id}`} className="btn-ghost p-2 rounded-md" title="Edit"><Edit3 size={16} /></Link>
                        <button onClick={() => handleDelete(task._id)} className="btn-ghost p-2 rounded-md text-danger hover:bg-red-50" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-main)' }}>
          <div className="text-sm text-muted">
            Showing <span className="font-medium text-main">1</span> to <span className="font-medium text-main">{Math.min(filteredTasks.length, 10)}</span> of <span className="font-medium text-main">{filteredTasks.length}</span> results
          </div>
          <div className="flex gap-1">
            <button className="btn btn-secondary text-xs px-2 py-1 shadow-sm" disabled>Previous</button>
            <button className="btn btn-primary text-xs px-3 py-1 shadow-sm">1</button>
            <button className="btn btn-secondary text-xs px-3 py-1 shadow-sm">2</button>
            <button className="btn btn-secondary text-xs px-3 py-1 shadow-sm">3</button>
            <button className="btn btn-secondary text-xs px-2 py-1 shadow-sm">Next</button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default TaskList;
