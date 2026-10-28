import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Sparkles, AlertCircle, Shield, User } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: 'Vishal Ellure',
    email: 'vishal797577@gmail.com',
    password: 'student123',
    usn: '1RV23CS001',
    branch: 'Computer Science & Engineering',
    semester: 3,
    cgpa: 9.28,
  });

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      setAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(role);
      setAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <button
          onClick={() => setAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '10px'
          }}>
            {isRegister ? <UserPlus size={24} /> : <LogIn size={24} />}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            {isRegister ? 'Create Student Account' : 'Welcome to EduPulse'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {isRegister ? 'Enter student credentials to get started' : 'Sign in to access academic tasks and placement drives'}
          </p>
        </div>

        {/* Quick Demo Sign In Pills */}
        <div style={{
          background: 'var(--bg-elevated)',
          padding: '12px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ Fast Demo Access (Evaluation Mode):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoSignIn('student')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', fontSize: '0.8rem' }}
            >
              <User size={14} color="#06b6d4" /> Student Demo
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoSignIn('admin')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', fontSize: '0.8rem' }}
            >
              <Shield size={14} color="#8b5cf6" /> Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'var(--status-danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: 'var(--status-danger)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Vishal Ellure"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">USN</label>
                  <input
                    type="text"
                    name="usn"
                    required
                    value={formData.usn}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="1RV23CS001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    required
                    value={formData.cgpa}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="9.28"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="vishal797577@gmail.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                Register
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
