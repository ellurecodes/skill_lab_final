import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import PlacementsPage from './pages/PlacementsPage';
import ProfilePage from './pages/ProfilePage';
import SyllabusMappingPage from './pages/SyllabusMappingPage';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'tasks':
        return <TasksPage setActivePage={setActivePage} />;
      case 'placements':
        return <PlacementsPage setActivePage={setActivePage} />;
      case 'profile':
        return <ProfilePage setActivePage={setActivePage} />;
      case 'syllabus':
        return <SyllabusMappingPage setActivePage={setActivePage} />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage} />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
