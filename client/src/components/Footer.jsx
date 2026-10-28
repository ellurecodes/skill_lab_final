import React from 'react';
import { GraduationCap, Github, ExternalLink, Heart, ShieldCheck, Code2 } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 20px 24px 20px',
      marginTop: 'auto',
      color: 'var(--text-secondary)',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '32px'
      }} className="footer-grid">
        {/* Brand & Project Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <GraduationCap size={18} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Edu<span className="gradient-text">Pulse</span>
            </span>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '16px' }}>
            A complete Full Stack Development Capstone Platform demonstrating Semester 3 syllabus topics: 
            Semantic HTML5, CSS3 Glassmorphism, JavaScript ES6+, React Hooks, Node.js, Express REST API, 
            MongoDB Mongoose persistence, and Git collaboration workflows.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="https://github.com/ellurecodes"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <Github size={15} /> GitHub Profile
            </a>
            <button
              onClick={() => setActivePage('syllabus')}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
            >
              <Code2 size={15} /> Syllabus Matrix
            </button>
          </div>
        </div>

        {/* Core Modules */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '14px' }}>
            Modules
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button 
                onClick={() => setActivePage('dashboard')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                Analytics Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('tasks')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                Academic Task Manager
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('placements')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                Placement Drive Tracker
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActivePage('profile')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                Student Profile & Portfolio
              </button>
            </li>
          </ul>
        </div>

        {/* Syllabus Units */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '14px' }}>
            Syllabus Units
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
            <li>Unit 1: HTML5, CSS3 & Responsive UI</li>
            <li>Unit 2: JS, DOM, JSON & LocalStorage</li>
            <li>Unit 3: Node.js, Express & MongoDB</li>
            <li>Capstone: Full Stack Integration</li>
            <li>Evaluation: CIE & SEE Scheme</li>
          </ul>
        </div>

        {/* Academic Details */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '14px' }}>
            Academic Credit
          </h4>
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <div><strong>Student:</strong> Vishal Ellure</div>
            <div><strong>USN:</strong> 1RV23CS001</div>
            <div><strong>Department:</strong> CSE</div>
            <div><strong>Institution:</strong> RV College of Engineering, Bengaluru</div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-success)' }}>
              <ShieldCheck size={16} /> Verified Academic Project
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '32px auto 0 auto',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}>
        <div>
          &copy; 2026 EduPulse — Designed & Built for Semester 3 Full Stack Development Evaluation.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Crafted with <Heart size={14} color="#ef4444" fill="#ef4444" /> using React 18, Express.js & MongoDB
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
