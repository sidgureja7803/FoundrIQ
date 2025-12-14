import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';
import MyIdeasPage from './pages/MyIdeasPage';
import GalleryPage from './pages/GalleryPage';
import IdeaSubmissionPage from './pages/IdeaSubmissionPage';
import IdeaDetailsPage from './pages/IdeaDetailsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import EnvChecker from './components/EnvChecker';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="overflow-x-hidden">
        <EnvChecker />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* Protected routes */}
          <Route path="/my-ideas" element={<ProtectedRoute><MyIdeasPage /></ProtectedRoute>} />
          <Route path="/validate-idea" element={<ProtectedRoute><IdeaSubmissionPage /></ProtectedRoute>} />
          <Route path="/idea/:ideaId" element={<ProtectedRoute><IdeaDetailsPage /></ProtectedRoute>} />
          
          {/* 404 Not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;