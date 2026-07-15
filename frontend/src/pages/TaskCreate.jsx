import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TaskCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [operation, setOperation] = useState('');
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let parsedData = {};
    
    try {
      if (inputData) {
        parsedData = JSON.parse(inputData);
      }
    } catch (error) {
      toast.error('Invalid JSON in Input Payload');
      setLoading(false);
      return;
    }

    // Pass title and description inside inputData if they exist (or backend might ignore them)
    // The strict requirement is just to keep backend APIs unchanged
    try {
      await axios.post((import.meta.env.VITE_API_URL || '') + '/api/tasks', { title, description, operation, inputData: parsedData }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Task created successfully');
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to create task');
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Create Task</h1>
        <p className="text-muted">Define and schedule a new background processing operation.</p>
      </div>

      <div className="card shadow-md" style={{ borderRadius: '16px', padding: '2rem' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="form-group">
            <label className="form-label" htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Data Sync"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of this task's purpose"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="operation">Operation</label>
            <select
              id="operation"
              className="form-input cursor-pointer"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              required
            >
              <option value="" disabled>Select an operation...</option>
              <option value="Text Summary">Text Summary</option>
              <option value="Sentiment Analysis">Sentiment Analysis</option>
              <option value="Keyword Extraction">Keyword Extraction</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="inputData">Input Payload (JSON)</label>
            <textarea
              id="inputData"
              className="form-input font-mono text-sm"
              rows="8"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={'{\n  "key": "value"\n}'}
              style={{ backgroundColor: 'var(--bg-hover)' }}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <button type="button" className="btn btn-secondary px-6" onClick={() => navigate('/tasks')}>Cancel</button>
            <button type="submit" className="btn btn-primary px-6" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Task'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TaskCreate;
