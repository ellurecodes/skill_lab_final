import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Github, 
  Linkedin, 
  Save, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Code,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, setAuthModalOpen, updateProfile } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'coordinator';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
    branch: '',
    semester: 3,
    cgpa: '',
    phone: '',
    college: '',
    github: '',
    linkedin: '',
    bio: '',
    skills: '',
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        usn: user.usn || '',
        branch: user.branch || '',
        semester: user.semester || 3,
        cgpa: user.cgpa || '',
        phone: user.phone || '',
        college: user.college || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        bio: user.bio || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <User size={48} color="#6366f1" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>
            Profile Authentication Required
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Please sign in to view and update your account details.
          </p>
          <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary" style={{ width: '100%' }}>
            Sign In with Demo Account
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        branch: formData.branch,
        phone: formData.phone,
        bio: formData.bio,
      };

      if (!isAdmin) {
        payload.semester = Number(formData.semester);
        payload.cgpa = Number(formData.cgpa);
        payload.github = formData.github;
        payload.linkedin = formData.linkedin;
        payload.skills = skillsArray;
      }

      await updateProfile(payload);
      setMsg(`${isAdmin ? 'Placement Officer' : 'Student'} profile updated successfully in MongoDB database!`);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
          {isAdmin ? 'Admin & Placement Officer Profile' : 'Student Profile & Academic Portfolio'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          {isAdmin 
            ? 'Manage administrative officer credentials, campus hiring policies, and department configuration.' 
            : 'Manage your verified academic profile, technical skillsets, and placement readiness records.'}
        </p>
      </div>

      {/* Profile Header */}
      <div className="glass-card" style={{ marginBottom: '28px', padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: isAdmin ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' : 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2.4rem',
            fontWeight: '800',
            boxShadow: '0 8px 24px var(--accent-gradient-glow)'
          }}>
            {formData.name.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{formData.name}</h1>
              <span className={`badge ${isAdmin ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.8rem' }}>
                {isAdmin ? `Officer ID: ${formData.usn}` : `USN: ${formData.usn}`}
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.8rem' }}>
                Role: {user?.role?.toUpperCase()}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              {isAdmin ? formData.branch : `${formData.branch} • Semester ${formData.semester}`}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {formData.college}
            </p>
          </div>

          {/* Right Summary Card (Student CGPA vs Admin Authority) */}
          <div style={{
            background: 'var(--bg-elevated)',
            padding: '16px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            minWidth: '200px'
          }}>
            {isAdmin ? (
              <>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                  ADMINISTRATIVE PORTAL
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>
                  Coordinator
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Drive & Approval Authority
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CUMULATIVE CGPA</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>
                  {formData.cgpa}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', fontWeight: '600' }}>
                  ✓ Placement Eligible
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {msg && (
        <div style={{ background: 'var(--status-success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--status-success)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--status-danger)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Edit Form */}
      <div className={isAdmin ? 'grid-cols-2' : 'grid-cols-3'}>
        {/* Form Column */}
        <div style={{ gridColumn: isAdmin ? 'span 1' : 'span 2' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#6366f1" /> {isAdmin ? 'Officer & Departmental Details' : 'Academic & Personal Details'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{isAdmin ? 'Officer Name' : 'Full Name'}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email (Read Only)</label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="form-input"
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{isAdmin ? 'Department / Directorate' : 'Branch / Specialization'}</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Only show Semester and CGPA for Student */}
              {!isAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Current Semester</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cumulative CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{isAdmin ? 'Official Office Phone' : 'Phone Contact'}</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {!isAdmin && (
                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              {!isAdmin && (
                <>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Technical Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">{isAdmin ? 'Departmental Directive / Placement Notice' : 'Professional Bio / Academic Objective'}</label>
                <textarea
                  rows="3"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  <Save size={16} /> {saving ? 'Saving...' : 'Update MongoDB Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Info Column */}
        <div>
          {isAdmin ? (
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} color="#8b5cf6" /> Administrative Responsibilities
              </h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li>Post and schedule on-campus recruitment drives.</li>
                <li>Set and enforce minimum CGPA and branch eligibility thresholds.</li>
                <li>Review submitted student applications and portfolios.</li>
                <li>Update candidate selection progress (`Shortlisted`, `Interview Scheduled`, `Offered`).</li>
                <li>Monitor institutional placement hiring metrics.</li>
              </ul>
            </div>
          ) : (
            <>
              <div className="glass-card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code size={18} color="#06b6d4" /> Technical Skills
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {formData.skills.split(',').map((skill, idx) => {
                    const s = skill.trim();
                    if (!s) return null;
                    return (
                      <span
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px' }}>
                  External Links & Portfolio
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={formData.github || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', gap: '10px' }}
                  >
                    <Github size={16} /> GitHub Repository
                  </a>
                  <a
                    href={formData.linkedin || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', gap: '10px' }}
                  >
                    <Linkedin size={16} /> LinkedIn Profile
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
