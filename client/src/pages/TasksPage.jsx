import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Cloud, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Tag, 
  X,
  RefreshCw
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'edupulse_local_tasks_cache';

const motivationalQuotes = [
  '"Make it functional. Then make it beautiful. Then make it your own." — Phase 1 Brief',
  '"Small daily improvements over time lead to stunning academic results."',
  '"User Action → Event → React State → DOM Reconciliation." — Full Stack Paradigm',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Client-Side Cache (LocalStorage) ↔ Centralized Persistence (MongoDB Mongoose)."',
];

export default function TasksPage() {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Lab Experiment',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    subject: 'Full Stack Development',
    notes: '',
  });

  const [quoteIndex, setQuoteIndex] = useState(0);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      if (isAuthenticated) {
        const res = await api.getTasks({
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
          search: searchQuery,
          sortBy,
        });
        if (res.success && res.tasks) {
          setTasks(res.tasks);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.tasks));
        }
      } else {
        // Fallback to local storage for guests
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          setTasks(JSON.parse(local));
        }
      }
    } catch (err) {
      console.warn('Failed to load from API, loading from LocalStorage:', err.message);
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        setTasks(JSON.parse(local));
      }
      setError('Working in offline/cached mode. Cloud database will sync upon reconnection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      category: 'Lab Experiment',
      priority: 'Medium',
      status: 'Pending',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      subject: 'Full Stack Development',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      subject: task.subject || '',
      notes: task.notes || '',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!taskForm.title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    try {
      if (isAuthenticated) {
        if (editingTask) {
          await api.updateTask(editingTask._id, taskForm);
          setSuccessMessage('Task updated successfully.');
        } else {
          await api.createTask(taskForm);
          setSuccessMessage('Task created successfully in MongoDB.');
        }
        setModalOpen(false);
        fetchTasks();
      } else {
        // LocalStorage save
        let updated;
        if (editingTask) {
          updated = tasks.map((t) => (t._id === editingTask._id ? { ...t, ...taskForm } : t));
        } else {
          const newTask = {
            _id: `local-${Date.now()}`,
            ...taskForm,
            createdAt: new Date().toISOString(),
          };
          updated = [newTask, ...tasks];
        }
        setTasks(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setSuccessMessage('Saved to LocalStorage. Sign in to persist on cloud MongoDB.');
        setModalOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      if (isAuthenticated) {
        await api.toggleTaskStatus(task._id, nextStatus);
        fetchTasks();
      } else {
        const updated = tasks.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t));
        setTasks(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      setError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      if (isAuthenticated) {
        await api.deleteTask(id);
        fetchTasks();
      } else {
        const updated = tasks.filter((t) => t._id !== id);
        setTasks(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      setSuccessMessage('Task deleted successfully.');
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleSyncToCloud = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!local) {
      setError('No local tasks found to synchronize.');
      return;
    }
    try {
      const parsed = JSON.parse(local);
      const res = await api.bulkSyncTasks(parsed);
      setSuccessMessage(res.message || 'Tasks synchronized with MongoDB!');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Synchronization failed.');
    }
  };

  // Filter tasks client-side if offline
  const displayedTasks = tasks.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchSubject = t.subject?.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchNotes) return false;
    }
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = totalCount - completedCount;

  return (
    <div>
      {/* Motivational Quote Banner */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: '4px solid var(--accent-primary)',
          cursor: 'pointer'
        }}
        onClick={() => setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={20} color="#6366f1" />
          <span style={{ fontStyle: 'italic', fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            {motivationalQuotes[quoteIndex]}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to cycle quote</span>
      </div>

      {/* Action Header & Counters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Academic Task Manager</h1>
            {user?.role === 'admin' && (
              <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                Admin Milestone Review
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total: <strong>{totalCount}</strong></span>
            <span style={{ color: 'var(--status-warning)' }}>Pending: <strong>{pendingCount}</strong></span>
            <span style={{ color: 'var(--status-success)' }}>Completed: <strong>{completedCount}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleSyncToCloud} className="btn btn-secondary btn-sm" title="Synchronize LocalStorage tasks with MongoDB database">
            <Cloud size={16} /> Sync LocalStorage ↔ Cloud
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div style={{ background: 'var(--status-success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--status-success)', padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--status-danger)', padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* Search & Multi-Filter Controls */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '12px'
        }} className="task-filter-grid">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search tasks, subject or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Categories</option>
            <option value="Lab Experiment">Lab Experiment</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam Prep">Exam Prep</option>
            <option value="Project Work">Project Work</option>
            <option value="Personal">Personal</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List / Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin" style={{ marginBottom: '12px' }} />
          <div>Loading tasks from MongoDB...</div>
        </div>
      ) : displayedTasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayedTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isUrgent = task.priority === 'High' && !isCompleted;

            return (
              <div
                key={task._id}
                className="glass-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: `4px solid ${isCompleted ? '#10b981' : task.priority === 'High' ? '#ef4444' : '#6366f1'}`,
                  opacity: isCompleted ? 0.75 : 1
                }}
              >
                {/* Left: Checkbox & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <button
                    onClick={() => handleToggleStatus(task)}
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: isCompleted ? 'none' : '2px solid var(--border-color)',
                      background: isCompleted ? 'var(--status-success)' : 'transparent',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {isCompleted && <CheckCircle size={18} />}
                  </button>

                  <div>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {task.title}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>{task.subject}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.notes && (
                        <>
                          <span>•</span>
                          <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Badges & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${task.category === 'Lab Experiment' ? 'badge-info' : 'badge-warning'}`}>
                    {task.category}
                  </span>

                  <span className={`badge ${task.priority === 'High' ? 'badge-danger' : task.priority === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleOpenEditModal(task)}
                    title="Edit Task"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 8px' }}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    title="Delete Task"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 8px', color: 'var(--status-danger)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <CheckSquare size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>No Tasks Found</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
            Try adjusting your search query, status filters, or add a new academic task.
          </p>
          <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> Create New Task
          </button>
        </div>
      )}

      {/* Task Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '18px' }}>
              {editingTask ? 'Edit Academic Task' : 'Add New Academic Task'}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Express REST API with MongoDB"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    value={taskForm.subject}
                    onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Lab Experiment">Lab Experiment</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Project Work">Project Work</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="form-select"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Instructions</label>
                <textarea
                  rows="3"
                  placeholder="Add detailed assignment guidelines or syllabus checklist..."
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .task-filter-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .task-filter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
