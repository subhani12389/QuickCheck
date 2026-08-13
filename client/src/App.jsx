import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { UploadVerifyPage } from './pages/UploadVerifyPage';
import { VerifyResultPage } from './pages/VerifyResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { OrgDashboard } from './pages/OrgDashboard';
import { OrgUploadCertPage } from './pages/OrgUploadCertPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-400">Loading QuickCheck AI session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify/public/:idOrHash" element={<PublicVerifyPage />} />
                <Route path="/v/:idOrHash" element={<PublicVerifyPage />} />

                {/* User Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['end_user', 'admin']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/verify" element={
                  <ProtectedRoute allowedRoles={['end_user', 'organization', 'admin']}>
                    <UploadVerifyPage />
                  </ProtectedRoute>
                } />
                <Route path="/verify/result/:id" element={
                  <ProtectedRoute allowedRoles={['end_user', 'organization', 'admin']}>
                    <VerifyResultPage />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute allowedRoles={['end_user', 'admin']}>
                    <HistoryPage />
                  </ProtectedRoute>
                } />

                {/* Organization Protected Routes */}
                <Route path="/org/dashboard" element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <OrgDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/org/upload" element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <OrgUploadCertPage />
                  </ProtectedRoute>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
