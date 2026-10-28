import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  FileCode, 
  Layers, 
  Server, 
  Database, 
  GitBranch, 
  Award,
  Terminal,
  ExternalLink
} from 'lucide-react';

export default function SyllabusMappingPage({ setActivePage }) {
  const syllabusMatrix = [
    {
      unit: 'Unit 1',
      title: 'FSD Overview, CSS & Responsive Web Design, Git Fundamentals',
      hours: '10 Hours (CIE: 20 Marks)',
      topics: [
        'Full-Stack Concepts, Client-Server Architecture, Request-Response Cycle, Modern Web Architecture',
        'HTML5 Semantic Structure (header, nav, main, section, footer, form, table)',
        'CSS3 Selectors, Box Model, Flexbox, Grid, Custom CSS Variables & Themes',
        'Responsive Design with Media Queries, Viewport Meta Tag, Mobile First Breakpoints',
        'Git Version Control, Commits, Branches, GitHub Repository Integration'
      ],
      evidence: [
        { item: 'Semantic HTML5 Template & Metadata', file: 'client/index.html' },
        { item: 'Glassmorphism & Dual Theme CSS Design System', file: 'client/src/index.css' },
        { item: 'Responsive Navigation Header & Mobile Drawer', file: 'client/src/components/Navbar.jsx' },
        { item: 'Git Repository with 7+ Commits and Branches', file: 'docs/GIT_WORKFLOW.md' }
      ],
      status: 'Fully Implemented & Verified'
    },
    {
      unit: 'Unit 2',
      title: 'JavaScript & Interactive Front End, JSON, DOM, Local Storage',
      hours: '10 Hours (CIE: 20 Marks)',
      topics: [
        'Variables (const, let, var), Data Types, Template Literals, Operators, Conditionals, Loops',
        'Array Methods (map, filter, find, reduce, splice, push, pop), Object Destructuring',
        'DOM Manipulation, Event Listeners, Regex Form Validation, Dynamic Table / Card Generation',
        'JSON Parsing & Serialization (JSON.stringify, JSON.parse), Browser LocalStorage',
        'Fetch API, Asynchronous JavaScript, Async/Await Promise Handling'
      ],
      evidence: [
        { item: 'Dynamic Task Filtering, Searching & Status Toggles', file: 'client/src/pages/TasksPage.jsx' },
        { item: 'LocalStorage Cache & Cloud MongoDB Synchronization', file: 'client/src/pages/TasksPage.jsx' },
        { item: 'Form Validation with Boundary Checks & Regex', file: 'client/src/components/AuthModal.jsx' },
        { item: 'Async Fetch API Wrapper with JWT Interceptors', file: 'client/src/services/api.js' }
      ],
      status: 'Fully Implemented & Verified'
    },
    {
      unit: 'Unit 3',
      title: 'Backend Node.js & Express.js, MongoDB Integration, REST APIs',
      hours: '10 Hours (CIE: 20 Marks)',
      topics: [
        'Node.js Server-Side Runtime, npm Packages, HTTP Protocol & Status Codes',
        'Express.js Application, Modular Routing, Request/Response Pipeline, Middleware',
        'REST API Endpoints: GET, POST, PUT, PATCH, DELETE with JSON payloads',
        'Database Fundamentals, MongoDB Mongoose Schemas, Validation, Indexing, Timestamps',
        'API Testing via Automated Test Runner & Postman Collection Export'
      ],
      evidence: [
        { item: 'Express Server & Route Mounting', file: 'server/server.js' },
        { item: 'Mongoose Schemas (User, Task, PlacementDrive, Application)', file: 'server/models/' },
        { item: 'Controllers & Centralized Error Handler Middleware', file: 'server/controllers/' },
        { item: 'Automated 34-Test Suite Execution', file: 'server/tests/run-tests.js' },
        { item: 'Postman Collection JSON Deliverable', file: 'postman/EduPulse_API.postman_collection.json' }
      ],
      status: 'Fully Implemented & Verified'
    },
    {
      unit: 'Capstone',
      title: 'Full Stack Integration, Deployment & SEE Project Demonstration',
      hours: 'Semester End Examination (SEE: 50 Marks)',
      topics: [
        'End-to-End Real World Problem: Student Academic Productivity & Placement Preparation Hub',
        'JWT Token Authentication & Role-Based Access Control (Student vs Placement Coordinator)',
        'Live Aggregation Dashboard with Completion Rates & Dynamic CTC Analytics',
        'Automated Test Suite (34/34 Passing Integration Tests)',
        'Production Deployment Configuration (Docker, Health Checks, Environment Variables)'
      ],
      evidence: [
        { item: 'System Health Check & Uptime Diagnostics', file: 'server/routes/healthRoutes.js' },
        { item: 'Interactive Analytics & Metrics Dashboard', file: 'client/src/pages/DashboardPage.jsx' },
        { item: 'Placement Application Workflow & CGPA Verification', file: 'client/src/pages/PlacementsPage.jsx' },
        { item: 'Comprehensive Project Report & Viva Preparation Guide', file: 'docs/PROJECT_REPORT.md' }
      ],
      status: 'Fully Implemented & Verified'
    }
  ];

  const evaluationScheme = [
    { component: 'CIE Mini Project 1 (Web Fundamentals & Portfolio)', max: 20, obtained: 'Verified' },
    { component: 'CIE Mini Project 2 (Interactive Task Manager & LocalStorage)', max: 20, obtained: 'Verified' },
    { component: 'CIE Mini Project 3 (Student REST API & Postman)', max: 20, obtained: 'Verified' },
    { component: 'CIE Database Integration (Full-Stack MongoDB App)', max: 20, obtained: 'Verified' },
    { component: 'CIE Version Control (GitHub Adoption & Branching)', max: 20, obtained: 'Verified' },
    { component: 'SEE: Report, Poster & Documentation', max: 10, obtained: 'Included in /docs' },
    { component: 'SEE: Skill Demonstration (Live React, Express & MongoDB)', max: 20, obtained: 'Ready' },
    { component: 'SEE: Capstone Project (Full Real-World Application)', max: 30, obtained: 'Complete' },
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge badge-info" style={{ marginBottom: '8px' }}>
          Academic Audit & Compliance
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>
          Syllabus-to-Feature Verification Matrix
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '8px auto 0 auto' }}>
          Every syllabus unit, practical lab activity, and CIE/SEE evaluation criterion mapped directly to concrete source code and executable evidence.
        </p>
      </div>

      {/* Evaluation Scheme Overview */}
      <div className="glass-card" style={{ marginBottom: '32px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#f59e0b" /> VTU / RVCE Scheme of Conduct & Evaluation
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 14px' }}>Evaluation Component</th>
              <th style={{ padding: '10px 14px' }}>Max Marks</th>
              <th style={{ padding: '10px 14px' }}>Implementation Status in EduPulse</th>
            </tr>
          </thead>
          <tbody>
            {evaluationScheme.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>{item.component}</td>
                <td style={{ padding: '12px 14px', color: 'var(--accent-primary)', fontWeight: '700' }}>{item.max}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span className="badge badge-success">
                    <CheckCircle size={12} /> {item.obtained}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Units Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {syllabusMatrix.map((item, idx) => (
          <div key={idx} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>{item.unit}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{item.title}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.hours}</span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                <CheckCircle size={14} /> {item.status}
              </span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Syllabus Topics Covered:
              </h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {item.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Source Code Evidence & Verification Deliverables:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} className="evidence-grid">
                {item.evidence.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-elevated)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ev.item}</span>
                    <code style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', background: 'var(--bg-code)', padding: '3px 8px', borderRadius: '4px' }}>
                      {ev.file}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .evidence-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
