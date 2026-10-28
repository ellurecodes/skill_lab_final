import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Send, 
  Award, 
  AlertCircle, 
  Building, 
  ShieldCheck, 
  X,
  FileText,
  Users,
  Trash2,
  Edit,
  UserPlus,
  GraduationCap
} from 'lucide-react';

export default function PlacementsPage() {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'coordinator';

  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'applications' | 'students'
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  // Student Application Modal
  const [applyModalDrive, setApplyModalDrive] = useState(null);
  const [applyNotes, setApplyNotes] = useState('');
  const [applying, setApplying] = useState(false);

  // Admin Review Drive Applicants Modal
  const [reviewDrive, setReviewDrive] = useState(null);
  const [driveApplicants, setDriveApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Admin Create Drive Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [driveForm, setDriveForm] = useState({
    companyName: '',
    role: '',
    ctc: '',
    minCgpa: 7.0,
    eligibleBranches: 'CSE, ISE, ECE, AI&ML',
    jobType: 'Full Time',
    location: 'Bengaluru',
    driveDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    description: '',
  });

  // Admin Create Student Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    usn: '',
    email: '',
    password: 'student123',
    branch: 'Computer Science & Engineering',
    semester: 3,
    cgpa: 8.5,
    phone: '+91 9380421476',
    skills: 'JavaScript, React, Node.js, MongoDB',
    bio: 'Undergraduate student at RV College of Engineering.',
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getDrives({
        search,
        jobType: jobTypeFilter,
        eligibleOnly: (!isAdmin && eligibleOnly) ? 'true' : 'false',
      });
      if (res.success && res.drives) {
        setDrives(res.drives);
      }

      if (isAuthenticated) {
        if (isAdmin) {
          const allApps = await api.getAllApplications();
          if (allApps.success && allApps.applications) {
            setApplications(allApps.applications);
          }

          const studentList = await api.adminGetStudents();
          if (studentList.success && studentList.students) {
            setStudents(studentList.students);
          }
        } else {
          const myApps = await api.getMyApplications();
          if (myApps.success && myApps.applications) {
            setApplications(myApps.applications);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch placement drives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, jobTypeFilter, eligibleOnly, isAdmin]);

  // Student apply handler
  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setApplying(true);
    setError('');
    try {
      const res = await api.applyForDrive(applyModalDrive._id, { notes: applyNotes });
      setSuccessMsg(res.message || 'Application submitted successfully!');
      setApplyModalDrive(null);
      setApplyNotes('');
      fetchData();
    } catch (err) {
      setError(err.message || 'Could not apply for drive.');
    } finally {
      setApplying(false);
    }
  };

  // Admin post drive handler
  const handleCreateDriveSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...driveForm,
        ctc: Number(driveForm.ctc),
        minCgpa: Number(driveForm.minCgpa),
        eligibleBranches: driveForm.eligibleBranches.split(',').map((b) => b.trim()),
      };
      await api.createDrive(payload);
      setSuccessMsg(`Placement drive for ${driveForm.companyName} posted successfully.`);
      setAdminModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to create placement drive.');
    }
  };

  // Admin create student handler
  const handleCreateStudentSubmit = async (e) => {
    e.preventDefault();
    setCreatingStudent(true);
    setError('');
    try {
      const payload = {
        ...studentForm,
        semester: Number(studentForm.semester),
        cgpa: Number(studentForm.cgpa),
      };
      const res = await api.adminCreateStudent(payload);
      setSuccessMsg(res.message || `Student ${studentForm.name} enrolled successfully!`);
      setStudentModalOpen(false);
      setStudentForm({
        name: '',
        usn: '',
        email: '',
        password: 'student123',
        branch: 'Computer Science & Engineering',
        semester: 3,
        cgpa: 8.5,
        phone: '+91 9380421476',
        skills: 'JavaScript, React, Node.js, MongoDB',
        bio: 'Undergraduate student at RV College of Engineering.',
      });
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to enroll student.');
    } finally {
      setCreatingStudent(false);
    }
  };

  // Admin delete drive handler
  const handleDeleteDrive = async (driveId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete the drive for ${companyName}?`)) return;
    try {
      await api.deleteDrive(driveId);
      setSuccessMsg(`Drive for ${companyName} deleted successfully.`);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete drive.');
    }
  };

  // Admin open review applicants for specific drive
  const handleOpenReview = async (drive) => {
    setReviewDrive(drive);
    setLoadingApplicants(true);
    try {
      const res = await api.getDriveApplications(drive._id);
      if (res.success && res.applications) {
        setDriveApplicants(res.applications);
      }
    } catch (err) {
      setError('Failed to fetch applicants for this drive.');
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Admin update applicant status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, { status: newStatus });
      setSuccessMsg(`Application status updated to ${newStatus}`);
      if (reviewDrive) {
        const res = await api.getDriveApplications(reviewDrive._id);
        if (res.success) setDriveApplicants(res.applications);
      }
      fetchData();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const isApplied = (driveId) => {
    if (isAdmin) return false;
    return applications.some((a) => a.drive && (a.drive._id === driveId || a.drive === driveId));
  };

  const getApplicationStatus = (driveId) => {
    const app = applications.find((a) => a.drive && (a.drive._id === driveId || a.drive === driveId));
    return app ? app.status : null;
  };

  const isEligible = (drive) => {
    if (!user || isAdmin) return true;
    return (user.cgpa || 0) >= (drive.minCgpa || 0);
  };

  // Filter students client-side by search
  const filteredStudents = students.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.usn?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Top Banner & Tab Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            {isAdmin ? 'Campus Placement Administration Hub' : 'Campus Placement Portal'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {isAdmin 
              ? 'Manage on-campus hiring drives, onboard students, and track candidate interview rounds.' 
              : 'Explore on-campus hiring drives, automated CGPA eligibility checks, and application progress.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {isAdmin && (
            <>
              <button onClick={() => setStudentModalOpen(true)} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                <UserPlus size={16} color="#06b6d4" /> Add Student
              </button>
              <button onClick={() => setAdminModalOpen(true)} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                <Plus size={16} /> Post New Drive
              </button>
            </>
          )}

          <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setActiveTab('drives')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'drives' ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === 'drives' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Active Drives ({drives.length})
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) setAuthModalOpen(true);
                else setActiveTab('applications');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'applications' ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === 'applications' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {isAdmin ? `Applications (${applications.length})` : `My Applications (${applications.length})`}
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('students')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'students' ? 'var(--accent-gradient)' : 'transparent',
                  color: activeTab === 'students' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Students Directory ({students.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div style={{ background: 'var(--status-success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--status-success)', padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--status-danger)', padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* ================= TAB 1: DRIVES TAB ================= */}
      {activeTab === 'drives' && (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isAdmin ? '2fr 1fr' : '2fr 1fr 1fr',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search company, job role, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="form-select"
              >
                <option value="All">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="FTE + Internship">FTE + Internship</option>
              </select>

              {!isAdmin && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={eligibleOnly}
                    onChange={(e) => setEligibleOnly(e.target.checked)}
                  />
                  <span>Eligible For My CGPA</span>
                </label>
              )}
            </div>
          </div>

          {/* Drives Cards Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              Loading placement opportunities...
            </div>
          ) : drives.length > 0 ? (
            <div className="grid-cols-2">
              {drives.map((drive) => {
                const applied = isApplied(drive._id);
                const currentStatus = getApplicationStatus(drive._id);
                const eligible = isEligible(drive);

                return (
                  <div key={drive._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '1.2rem',
                          color: 'var(--accent-primary)'
                        }}>
                          {drive.companyName.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{drive.companyName}</h3>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{drive.role}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--status-success)' }}>
                          ₹{drive.ctc} LPA
                        </div>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {drive.jobType}
                        </span>
                      </div>
                    </div>

                    {/* Criteria Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      background: 'var(--bg-elevated)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      marginBottom: '14px',
                      fontSize: '0.8rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Min Criteria</span>
                        <strong style={{ color: (user && !isAdmin && !eligible) ? 'var(--status-danger)' : 'var(--status-success)' }}>
                          {drive.minCgpa} CGPA {!isAdmin && user && `(You: ${user.cgpa})`}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Drive Date</span>
                        <strong>{new Date(drive.driveDate).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Deadline</span>
                        <strong>{new Date(drive.deadline).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      flex: 1
                    }}>
                      {drive.description}
                    </p>

                    {/* Eligible Branches & Rounds */}
                    <div style={{ marginBottom: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <div><strong>Eligible Branches:</strong> {drive.eligibleBranches?.join(', ')}</div>
                      <div style={{ marginTop: '4px' }}>
                        <strong>Rounds:</strong> {drive.selectionRounds?.join(' → ')}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '14px'
                    }}>
                      {isAdmin ? (
                        /* ADMIN ACTIONS */
                        <>
                          <button
                            onClick={() => handleOpenReview(drive)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '6px' }}
                          >
                            <Users size={14} color="#8b5cf6" /> Review Applicants
                          </button>
                          <button
                            onClick={() => handleDeleteDrive(drive._id, drive.companyName)}
                            title="Delete this placement drive"
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--status-danger)', padding: '6px 10px' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      ) : (
                        /* STUDENT ACTIONS */
                        <>
                          {user && (
                            <span className={`badge ${eligible ? 'badge-success' : 'badge-danger'}`}>
                              {eligible ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {eligible ? 'Eligible to Apply' : 'CGPA Criteria Unmet'}
                            </span>
                          )}

                          {applied ? (
                            <span className="badge badge-info" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                              Status: {currentStatus}
                            </span>
                          ) : (
                            <button
                              disabled={user && !eligible}
                              onClick={() => setApplyModalDrive(drive)}
                              className="btn btn-primary btn-sm"
                              style={{ opacity: user && !eligible ? 0.5 : 1 }}
                            >
                              <Send size={14} /> Apply Now
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <Briefcase size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Placement Drives Found</h3>
              <p style={{ fontSize: '0.9rem' }}>Try clearing filters or check back later.</p>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: APPLICATIONS TAB ================= */}
      {activeTab === 'applications' && (
        <div>
          {applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      color: 'var(--accent-primary)'
                    }}>
                      {app.drive?.companyName ? app.drive.companyName.charAt(0) : 'C'}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
                        {app.drive?.companyName || 'Company Drive'}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Role: {app.drive?.role} • ₹{app.drive?.ctc} LPA
                      </div>
                      
                      {isAdmin ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: '600', marginTop: '4px' }}>
                          Candidate: {app.student?.name} (USN: {app.student?.usn}) • CGPA: {app.student?.cgpa} • {app.student?.branch}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Applied on: {new Date(app.appliedAt).toLocaleDateString()} • Round: <strong>{app.currentRound}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {isAdmin ? (
                      /* Admin Status Selector */
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.8rem', minWidth: '150px' }}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="OA Cleared">OA Cleared</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    ) : (
                      /* Student Badge */
                      <div>
                        <span className={`badge ${
                          app.status === 'Offered' ? 'badge-success' :
                          app.status === 'Rejected' ? 'badge-danger' :
                          app.status === 'Interview Scheduled' ? 'badge-warning' : 'badge-info'
                        }`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                          {app.status}
                        </span>

                        {app.interviewDate && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--status-warning)', marginTop: '6px' }}>
                            Interview: {new Date(app.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                {isAdmin ? 'No Candidate Applications Received Yet' : 'No Applications Submitted Yet'}
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                {isAdmin ? 'When students apply for active drives, they will appear in this review queue.' : 'Browse available placement drives and submit your profile.'}
              </p>
              <button onClick={() => setActiveTab('drives')} className="btn btn-primary btn-sm">
                Browse Active Drives
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: ADMIN STUDENTS DIRECTORY TAB ================= */}
      {isAdmin && activeTab === 'students' && (
        <div>
          {/* Search bar & Add Student Button */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="Search students by Name, USN, Branch, or Email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <button
                onClick={() => setStudentModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <UserPlus size={16} /> Enroll New Student
              </button>
            </div>
          </div>

          {/* Student Cards Grid */}
          {filteredStudents.length > 0 ? (
            <div className="grid-cols-2">
              {filteredStudents.map((s) => (
                <div key={s._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}>
                        {s.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{s.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          USN: <strong style={{ color: 'var(--text-primary)' }}>{s.usn}</strong> • Sem {s.semester}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>
                        {s.cgpa}
                      </div>
                      <span className={`badge ${s.cgpa >= 7.0 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                        {s.cgpa >= 7.0 ? 'Eligible' : 'Needs Focus'}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <div><strong>Branch:</strong> {s.branch}</div>
                    <div><strong>Email:</strong> {s.email}</div>
                    <div><strong>Phone:</strong> {s.phone || 'N/A'}</div>
                  </div>

                  {s.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                      {s.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: '600' }}>
                          {skill}
                        </span>
                      ))}
                      {s.skills.length > 4 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                          +{s.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <Users size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Students Found</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Try a different search query or add a new student.</p>
              <button onClick={() => setStudentModalOpen(true)} className="btn btn-primary btn-sm">
                <UserPlus size={16} /> Add First Student
              </button>
            </div>
          )}
        </div>
      )}

      {/* Admin Add Student Modal */}
      {studentModalOpen && (
        <div className="modal-overlay" onClick={() => setStudentModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button
              onClick={() => setStudentModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={20} color="#06b6d4" /> Enroll New Student (Admin)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>
              Directly onboard a student undergraduate into the placement and academic database.
            </p>

            <form onSubmit={handleCreateStudentSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ananya Sharma"
                    className="form-input"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">USN (University Seat Number) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 1RV23CS045"
                    className="form-input"
                    value={studentForm.usn}
                    onChange={(e) => setStudentForm({ ...studentForm, usn: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@rvce.edu.in"
                    className="form-input"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Branch / Department</label>
                  <select
                    className="form-select"
                    value={studentForm.branch}
                    onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Science & Engineering">Information Science & Engineering</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                    <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="form-input"
                    value={studentForm.semester}
                    onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CGPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    className="form-input"
                    value={studentForm.cgpa}
                    onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Technical Skills (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.skills}
                    onChange={(e) => setStudentForm({ ...studentForm, skills: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setStudentModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creatingStudent} className="btn btn-primary">
                  {creatingStudent ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Review Specific Drive Applicants Modal */}
      {reviewDrive && (
        <div className="modal-overlay" onClick={() => setReviewDrive(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <button
              onClick={() => setReviewDrive(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>
              Applicants for {reviewDrive.companyName}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Role: <strong>{reviewDrive.role}</strong> (Package: ₹{reviewDrive.ctc} LPA • Min CGPA: {reviewDrive.minCgpa})
            </p>

            {loadingApplicants ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>Loading applicants...</div>
            ) : driveApplicants.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '50vh', overflowY: 'auto' }}>
                {driveApplicants.map((app) => (
                  <div
                    key={app._id}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg-elevated)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                        {app.student?.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({app.student?.usn})</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Branch: {app.student?.branch} • CGPA: <strong>{app.student?.cgpa}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="OA Cleared">OA Cleared</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No students have applied for this drive yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Apply Confirmation Modal */}
      {applyModalDrive && (
        <div className="modal-overlay" onClick={() => setApplyModalDrive(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setApplyModalDrive(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>
              Confirm Application: {applyModalDrive.companyName}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Role: <strong>{applyModalDrive.role}</strong> ({applyModalDrive.jobType}) • Package: <strong>₹{applyModalDrive.ctc} LPA</strong>
            </p>

            <div style={{
              background: 'var(--bg-elevated)',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}>
              <div><strong>Applicant USN:</strong> {user?.usn}</div>
              <div><strong>Applicant Name:</strong> {user?.name}</div>
              <div><strong>Current CGPA:</strong> {user?.cgpa} (Eligible requirement: {applyModalDrive.minCgpa})</div>
            </div>

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Cover Note / Key Highlights (Optional)</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Mention relevant projects, technical skills, or hackathon achievements..."
                  value={applyNotes}
                  onChange={(e) => setApplyNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setApplyModalDrive(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={applying} className="btn btn-primary">
                  {applying ? 'Submitting...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Post Drive Modal */}
      {adminModalOpen && (
        <div className="modal-overlay" onClick={() => setAdminModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setAdminModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>
              Post Campus Placement Drive
            </h2>

            <form onSubmit={handleCreateDriveSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={driveForm.companyName}
                    onChange={(e) => setDriveForm({ ...driveForm, companyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={driveForm.role}
                    onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">CTC (LPA) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={driveForm.ctc}
                    onChange={(e) => setDriveForm({ ...driveForm, ctc: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min CGPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    value={driveForm.minCgpa}
                    onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select
                    className="form-select"
                    value={driveForm.jobType}
                    onChange={(e) => setDriveForm({ ...driveForm, jobType: e.target.value })}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="FTE + Internship">FTE + Internship</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Drive Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={driveForm.driveDate}
                    onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={driveForm.deadline}
                    onChange={(e) => setDriveForm({ ...driveForm, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Eligible Branches (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={driveForm.eligibleBranches}
                  onChange={(e) => setDriveForm({ ...driveForm, eligibleBranches: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Description *</label>
                <textarea
                  rows="3"
                  required
                  className="form-textarea"
                  value={driveForm.description}
                  onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setAdminModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
