import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    operation: '',
    inputData: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const operations = [
    '',
    'Text Summary',
    'Sentiment Analysis',
    'Keyword Extraction'
  ];

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5001/api/tasks/${id}`, config);
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          operation: res.data.operation || '',
          inputData: res.data.inputData || ''
        });
      } catch (err) {
        toast.error('Failed to fetch task details');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5001/api/tasks/${id}`, formData, config);
      toast.success('Task updated successfully');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton circle height={36} width={36} />
          <div>
            <Skeleton height={24} width={150} className="mb-1" />
            <Skeleton height={16} width={200} />
          </div>
        </div>
        <div className="card" style={{ maxWidth: '800px', padding: '2rem' }}>
          <div className="grid-cols-2 mb-4">
            <div><Skeleton height={20} width={100} className="mb-2" /><Skeleton height={40} /></div>
            <div><Skeleton height={20} width={100} className="mb-2" /><Skeleton height={40} /></div>
          </div>
          <div className="mb-6"><Skeleton height={20} width={100} className="mb-2" /><Skeleton height={40} /></div>
          <div className="mb-8"><Skeleton height={20} width={150} className="mb-2" /><Skeleton height={180} /></div>
          <Skeleton height={1} className="mb-6" />
          <div className="flex justify-end gap-3"><Skeleton height={40} width={80} /><Skeleton height={40} width={120} /></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tasks" className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.1rem' }}>Edit Task</h1>
          <p className="text-muted text-sm">Update the configuration of your AI task.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2 mb-4">
            <div className="form-group">
              <label className="form-label" htmlFor="title">Task Title <span className="text-danger">*</span></label>
              <input
                className="form-input"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Q3 Customer Feedback"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="operation">Operation Type <span className="text-danger">*</span></label>
              <select
                className="form-input"
                id="operation"
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                required
              >
                {operations.map(op => (
                  <option key={op} value={op} disabled={op === ''}>{op === '' ? 'Select an operation' : op}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label" htmlFor="description">Description <span className="text-muted font-normal text-xs">(Optional)</span></label>
            <input
              className="form-input"
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief overview of what this task will accomplish..."
            />
          </div>

          <div className="form-group mb-8">
            <label className="form-label" htmlFor="inputData">Input Payload Data <span className="text-danger">*</span> <span className="text-muted font-normal text-xs">(Raw Text or JSON)</span></label>
            <textarea
              className="form-input"
              id="inputData"
              name="inputData"
              value={formData.inputData}
              onChange={handleChange}
              required
              placeholder="Enter the dataset or string you want the AI to process..."
              style={{ minHeight: '180px', resize: 'vertical', fontFamily: 'monospace' }}
            ></textarea>
          </div>
          
          <div className="divider"></div>

          <div className="flex justify-end items-center gap-3 mt-6">
            <Link to="/tasks" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <><Loader2 size={16} className="spinner" /> Saving...</>
              ) : (
                <><Save size={16} /> Update Task</>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TaskEdit;
