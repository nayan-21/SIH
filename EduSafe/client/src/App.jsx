import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ReportIssuePage from './pages/ReportIssuePage';
import ReportsDashboard from './pages/ReportsDashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import StoriesPage from './pages/StoriesPage';
import AIChatbot from './pages/AIChatbot';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/module/:id" element={<ModuleDetailPage />} />
          <Route path="/report-issue" element={<ReportIssuePage />} />
          <Route path="/reports-dashboard" element={<ReportsDashboard />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/chatbot" element={<AIChatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
