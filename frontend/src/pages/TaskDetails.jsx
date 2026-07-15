import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Clock, Zap, Cpu, Database, 
  CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTask(res.data);
    } catch (error) {
      toast.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="badge badge-completed">Completed</span>;
      case 'processing': return <span className="badge badge-processing">Processing</span>;
      case 'failed': return <span className="badge badge-failed">Failed</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-success"/>;
      case 'processing': return <RefreshCw size={16} className="text-warning animate-spin"/>;
      case 'failed': return <XCircle size={16} className="text-danger"/>;
      default: return <Clock size={16} className="text-muted"/>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Skeleton height={40} width={200} className="mb-6" />
        <div className="flex gap-6">
          <div className="flex-1"><Skeleton height={400} /></div>
          <div className="w-80"><Skeleton height={400} /></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return <div className="text-center py-12"><AlertCircle size={48} className="mx-auto text-muted mb-4"/><h2>Task not found</h2></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto">
      
      <div className="mb-6">
        <Link to="/tasks" className="text-muted hover:text-main text-sm flex items-center gap-1 mb-4 w-fit">
          <ArrowLeft size={14} /> Back to Tasks
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold m-0 tracking-tight">{task.operation}</h1>
            {getStatusBadge(task.status)}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary shadow-sm"><RefreshCw size={14}/> Rerun</button>
          </div>
        </div>
        <p className="text-sm text-muted font-mono mt-2">ID: {task._id}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Details */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="card">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><FileText size={18} className="text-muted"/> Execution Details</h3>
            
            <div className="grid-cols-3 mb-6 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Created At</span>
                <span className="text-sm font-medium">{new Date(task.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Worker Node</span>
                <span className="text-sm font-medium font-mono">worker-prod-az1-42</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Duration</span>
                <span className="text-sm font-medium flex items-center gap-1"><Clock size={12}/> {task.status === 'completed' ? '2.4s' : '-'}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2">Input Payload</h4>
              <div className="code-block font-mono">
                <pre>{JSON.stringify(task.inputData, null, 2)}</pre>
              </div>
            </div>

            {task.result && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  Output Result 
                  <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>200 OK</span>
                </h4>
                <div className="code-block font-mono" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <pre>{JSON.stringify(task.result, null, 2)}</pre>
                </div>
              </div>
            )}
            
            {task.error && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-danger">Error Logs</h4>
                <div className="code-block font-mono" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <pre>{task.error}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="card">
             <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Database size={18} className="text-muted"/> Advanced Configuration</h3>
             <p className="text-sm text-muted mb-4">Worker overrides and execution configurations applied to this specific task run.</p>
             <div className="flex gap-4">
                <span className="badge badge-pending font-mono">Timeout: 300s</span>
                <span className="badge badge-pending font-mono">Retries: 3</span>
                <span className="badge badge-pending font-mono">Priority: High</span>
             </div>
          </div>

        </div>

        {/* Right Column: Timeline */}
        <div className="w-full lg:w-80">
          <div className="card sticky top-24">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><Cpu size={18} className="text-muted"/> Processing History</h3>
            
            <div className="relative ml-2 flex flex-col gap-6 pl-5 border-l-2" style={{ borderColor: 'var(--border)' }}>
              
              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-card border-2 flex items-center justify-center" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--bg-card)', left: '-29px', top: '0px' }}>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <h4 className="font-medium text-sm m-0 mb-1">Task Created</h4>
                <p className="text-xs text-muted m-0">Added to primary queue.</p>
                <span className="text-xs font-mono text-muted mt-1 block">{new Date(task.createdAt).toLocaleTimeString()}</span>
              </div>

              {(task.status === 'processing' || task.status === 'completed' || task.status === 'failed') && (
                <div className="relative">
                  <div className="absolute w-4 h-4 rounded-full bg-card border-2 flex items-center justify-center" style={{ borderColor: 'var(--warning)', backgroundColor: 'var(--bg-card)', left: '-29px', top: '0px' }}>
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                  </div>
                  <h4 className="font-medium text-sm m-0 mb-1">Processing Started</h4>
                  <p className="text-xs text-muted m-0">Picked up by worker-prod-az1-42.</p>
                  <span className="text-xs font-mono text-muted mt-1 block">{new Date(new Date(task.createdAt).getTime() + 1000).toLocaleTimeString()}</span>
                </div>
              )}
              
              {task.status === 'completed' && (
                <div className="relative">
                  <div className="absolute w-4 h-4 rounded-full bg-card border-2 flex items-center justify-center" style={{ borderColor: 'var(--success)', backgroundColor: 'var(--bg-card)', left: '-29px', top: '0px' }}>
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                  </div>
                  <h4 className="font-medium text-sm m-0 mb-1">Completed Successfully</h4>
                  <p className="text-xs text-muted m-0">Result payload generated.</p>
                  <span className="text-xs font-mono text-muted mt-1 block">{new Date(task.updatedAt).toLocaleTimeString()}</span>
                </div>
              )}

              {task.status === 'failed' && (
                <div className="relative">
                  <div className="absolute w-4 h-4 rounded-full bg-card border-2 flex items-center justify-center" style={{ borderColor: 'var(--danger)', backgroundColor: 'var(--bg-card)', left: '-29px', top: '0px' }}>
                    <div className="w-2 h-2 rounded-full bg-danger"></div>
                  </div>
                  <h4 className="font-medium text-sm m-0 mb-1 text-danger">Task Failed</h4>
                  <p className="text-xs text-muted m-0">Exception during execution.</p>
                  <span className="text-xs font-mono text-muted mt-1 block">{new Date(task.updatedAt).toLocaleTimeString()}</span>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default TaskDetails;
