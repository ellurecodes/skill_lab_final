import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  CheckCircle, 
  Clock, 
  Briefcase, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  Users,
  ShieldCheck,
  Building,
  CheckCheck
} from 'lucide-react';

export default function DashboardPage({ setActivePage }) {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'coordinator';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDashboardStats();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Dashboard stats fetch error:', err.message);
      setError('Could not load live backend statistics. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <Sparkles size={48} color="#6366f1" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px' }}>
            Sign in to View Your Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Access academic tasks, placement eligibility status, and live campus hiring metrics.
          </p>
          <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary" style={{ width: '100%' }}>
            Sign In with Demo Account
          </button>
        </div>
      </div>
    );
  }

  const academic = stats?.academic || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    highPriorityTasks: 0,
  };

  const placement = stats?.placement || {
    totalDrives: 0,
    upcomingDrives: 0,
    avgCtc: 0,
    totalApplied: 0,
    shortlistedCount: 0,
    offersCount: 0,
  };

  const adminData = stats?.admin || {
    totalStudents: 1,
    totalAppsReceived: 0,
    totalOffersReleased: 0,
    totalInterviewsScheduled: 0,
    totalShortlisted: 0,
    recentApplications: [],
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        marginBottom: '28px',
        background: isAdmin ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)' : 'var(--accent-gradient)',
        color: '#ffffff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Welcome, {user?.name || 'User'}</span> • <span>{isAdmin ? `Officer ID: ${user?.usn}` : `USN: ${user?.usn}`}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '6px', marginBottom: '8px' }}>
            {isAdmin ? 'Placement & Training Directorate Portal' : 'Academic & Career Command Center'}
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '650px' }}>
            {isAdmin ? (
              `Overseeing ${placement.totalDrives} active recruitment drives with ${adminData.totalAppsReceived} applications received from registered undergraduates.`
            ) : (
              `You have ${academic.pendingTasks} pending tasks and ${placement.upcomingDrives} upcoming placement drives on campus.`
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin ? (
            <button
              onClick={() => setActivePage('placements')}
              className="btn"
              style={{ background: '#ffffff', color: '#4f46e5', fontWeight: '700' }}
            >
              <Plus size={16} /> Manage Drives
            </button>
          ) : (
            <button
              onClick={() => setActivePage('tasks')}
              className="btn"
              style={{ background: '#ffffff', color: '#4f46e5', fontWeight: '700' }}
            >
              <Plus size={16} /> Manage Tasks
            </button>
          )}

          <button
            onClick={fetchStats}
            title="Refresh statistics"
            className="btn"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        {isAdmin ? (
          /* ================= ADMIN 4 KPI CARDS ================= */
          <>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Active Campus Drives
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-info)' }}>
                  <Briefcase size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {placement.totalDrives}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Avg Package: <strong style={{ color: 'var(--accent-secondary)' }}>₹{placement.avgCtc} LPA</strong>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Total Applications Received
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                  <Users size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {adminData.totalAppsReceived}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--status-success)' }}>
                Across {adminData.totalStudents} registered students
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Interviews Scheduled
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-warning)' }}>
                  <Calendar size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {adminData.totalInterviewsScheduled}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {adminData.totalShortlisted} candidates shortlisted
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Offers Extended
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-success)' }}>
                  <Award size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {adminData.totalOffersReleased}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--status-success)' }}>
                Top Offer: ₹34.0 LPA (Google)
              </div>
            </div>
          </>
        ) : (
          /* ================= STUDENT 4 KPI CARDS ================= */
          <>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Task Completion Rate
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-success)' }}>
                  <CheckCircle size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {academic.completionRate}%
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${academic.completionRate}%`, height: '100%', background: 'var(--status-success)', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {academic.completedTasks} completed of {academic.totalTasks} total tasks
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Pending Tasks
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-warning)' }}>
                  <Clock size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {academic.pendingTasks}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--status-danger)' }}>
                <AlertTriangle size={14} /> {academic.highPriorityTasks} high priority
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Campus Placement Drives
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-info)' }}>
                  <Briefcase size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {placement.totalDrives}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Avg Package: <strong style={{ color: 'var(--accent-secondary)' }}>₹{placement.avgCtc} LPA</strong>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Submitted Applications
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                  <Award size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                {placement.totalApplied}
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                <span className="badge badge-success">{placement.shortlistedCount} Shortlisted</span>
                <span className="badge badge-info">{placement.offersCount} Offers</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid-cols-2">
        {isAdmin ? (
          /* ================= ADMIN 2-COLUMN VIEW ================= */
          <>
            {/* Recent Candidate Submissions Queue */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#8b5cf6" /> Candidate Review Queue
                </h3>
                <button
                  onClick={() => setActivePage('placements')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  Manage All <ArrowRight size={12} />
                </button>
              </div>

              {adminData?.recentApplications?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {adminData.recentApplications.map((app) => (
                    <div
                      key={app._id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                          {app.student?.name || 'Applicant'} ({app.student?.usn})
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Company: <strong>{app.drive?.companyName}</strong> • CGPA: {app.student?.cgpa}
                        </div>
                      </div>
                      <span className={`badge ${
                        app.status === 'Offered' ? 'badge-success' :
                        app.status === 'Interview Scheduled' ? 'badge-warning' : 'badge-info'
                      }`} style={{ fontSize: '0.75rem' }}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No student applications pending review.
                </div>
              )}
            </div>

            {/* Active Company Drives Overview */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="#06b6d4" /> Active Placement Drives
                </h3>
                <button
                  onClick={() => setActivePage('placements')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  Open Portal <ArrowRight size={12} />
                </button>
              </div>

              {stats?.featuredDrives?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stats.featuredDrives.map((d) => (
                    <div
                      key={d._id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{d.companyName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.role}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Drive Date: {new Date(d.driveDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: 'var(--accent-secondary)', fontSize: '1rem' }}>
                          ₹{d.ctc} LPA
                        </div>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          Min CGPA: {d.minCgpa}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No upcoming drives posted.
                </div>
              )}
            </div>
          </>
        ) : (
          /* ================= STUDENT 2-COLUMN VIEW ================= */
          <>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#f59e0b" /> Urgent Academic Deadlines
                </h3>
                <button
                  onClick={() => setActivePage('tasks')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              {stats?.urgentTasks?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stats.urgentTasks.map((t) => (
                    <div
                      key={t._id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <span>{t.subject}</span> • <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`badge ${t.priority === 'High' ? 'badge-danger' : t.priority === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No urgent tasks pending! Great job staying ahead.
                </div>
              )}
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} color="#06b6d4" /> Upcoming Hiring Drives
                </h3>
                <button
                  onClick={() => setActivePage('placements')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  Browse All <ArrowRight size={12} />
                </button>
              </div>

              {stats?.featuredDrives?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stats.featuredDrives.map((d) => (
                    <div
                      key={d._id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{d.companyName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.role}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Drive Date: {new Date(d.driveDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: 'var(--accent-secondary)', fontSize: '1rem' }}>
                          ₹{d.ctc} LPA
                        </div>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          Min CGPA: {d.minCgpa}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No upcoming drives available right now.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
