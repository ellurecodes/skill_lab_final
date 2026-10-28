import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, 
  CheckCircle, 
  Briefcase, 
  Award, 
  Database, 
  Cpu, 
  Layers, 
  GitBranch, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const { isAuthenticated, setAuthModalOpen } = useAuth();

  const handleStart = () => {
    if (isAuthenticated) {
      setActivePage('dashboard');
    } else {
      setAuthModalOpen(true);
    }
  };

  const featureCards = [
    {
      icon: CheckCircle,
      color: '#10b981',
      title: 'Academic Productivity Engine',
      subtitle: 'Syllabus Unit 2 & Task Manager',
      desc: 'Seamless task tracking across assignments, lab experiments, exams, and mini projects. Features LocalStorage offline cache with automated MongoDB cloud synchronization.',
      action: () => setActivePage('tasks'),
      actionText: 'Explore Tasks'
    },
    {
      icon: Briefcase,
      color: '#06b6d4',
      title: 'Placement Drive & Eligibility Hub',
      subtitle: 'Syllabus Unit 3 & Capstone',
      desc: 'Real-time campus placement drives with automated CGPA & branch eligibility validation, application status workflows (Applied, OA, Interview, Offer), and recruiter dashboards.',
      action: () => setActivePage('placements'),
      actionText: 'Browse Drives'
    },
    {
      icon: Database,
      color: '#6366f1',
      title: 'MERN REST API Architecture',
      subtitle: 'Express.js & MongoDB Integration',
      desc: 'Engineered with Node.js, Express, Mongoose schemas, JWT token authentication, centralized error handling middleware, and 34 passing automated integration tests.',
      action: () => setActivePage('syllabus'),
      actionText: 'View Syllabus Matrix'
    },
    {
      icon: GitBranch,
      color: '#f59e0b',
      title: 'Git Version Control & CI Workflow',
      subtitle: 'Collaboration & Pull Requests',
      desc: 'Adheres to professional Git standards: feature-branching strategy, pull requests, semantic commit messages, and Postman API test collection documentation.',
      action: () => setActivePage('syllabus'),
      actionText: 'View Workflow'
    }
  ];

  const syllabusHighlights = [
    { unit: 'Unit 1', title: 'Web Fundamentals & CSS Responsive UI', desc: 'HTML5 semantic tags, CSS3 Glassmorphism, CSS Grid, Flexbox, media queries.' },
    { unit: 'Unit 2', title: 'JavaScript ES6+, DOM & LocalStorage', desc: 'Dynamic table rendering, array methods (map, filter, reduce), regex validation, offline caching.' },
    { unit: 'Unit 3', title: 'Node.js, Express REST API & MongoDB', desc: 'Server-side CRUD, Mongoose models, JWT security, Postman collection testing.' },
    { unit: 'Capstone', title: 'Full Stack Integration & SEE Evaluation', desc: 'End-to-end user workflows, real-time metrics, automated testing, and deployment readiness.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '60px 0 40px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'var(--status-info-bg)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: 'var(--accent-secondary)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} /> Semester 3 Full Stack Development Capstone Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: '800',
          letterSpacing: '-1.5px',
          lineHeight: 1.15,
          marginBottom: '20px'
        }}>
          Empowering Engineering Students with <br />
          <span className="gradient-text">Academic Agility & Placement Success</span>
        </h1>

        <p style={{
          maxWidth: '740px',
          margin: '0 auto 32px auto',
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          EduPulse integrates student task management, academic productivity, and placement drive tracking into a single, cohesive, production-grade MERN stack application.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handleStart}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem' }}
          >
            <Rocket size={18} /> Launch Application
          </button>
          <button
            onClick={() => setActivePage('syllabus')}
            className="btn btn-secondary"
            style={{ padding: '12px 24px', fontSize: '1rem' }}
          >
            <BookOpen size={18} /> Syllabus & Evaluation Matrix
          </button>
        </div>

        {/* Live Metrics Counter */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          maxWidth: '900px',
          margin: '50px auto 0 auto',
          padding: '24px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)'
        }} className="hero-metrics">
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-primary)' }}>100%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Syllabus Coverage</div>
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#10b981' }}>34 / 34</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Automated Tests Passed</div>
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#06b6d4' }}>₹34.0 LPA</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Top Placement Drive CTC</div>
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#f59e0b' }}>MERN</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Modern Web Stack</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            Integrated Full Stack Architecture
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Built from scratch to demonstrate frontend aesthetics, database persistence, and clean backend APIs.
          </p>
        </div>

        <div className="grid-cols-2">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${card.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{card.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: '600' }}>
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, flex: 1, marginBottom: '20px' }}>
                  {card.desc}
                </p>

                <div>
                  <button onClick={card.action} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                    {card.actionText} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Syllabus Alignment Breakdown */}
      <section style={{
        padding: '50px 0',
        marginTop: '20px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            Academic Syllabus Mapping
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Direct alignment with Semester 3 Full Stack Development Scheme of Conduct and Evaluation.
          </p>
        </div>

        <div className="grid-cols-4">
          {syllabusHighlights.map((s, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px' }}>
              <span className="badge badge-info" style={{ marginBottom: '12px' }}>{s.unit}</span>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>{s.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-metrics {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
