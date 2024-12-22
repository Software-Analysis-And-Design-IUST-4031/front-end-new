import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import BlogPage from './components/Blog/BlogPage';
import BlogPost from './components/Blog/BlogPost';
import BlogEditor from './components/Blog/BlogEditor';
import GalleriesPage from './pages/GalleriesPage';
import ProfilePage from './components/UserPanel/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider, useColorMode } from './context/ColorModeContext';

export { useColorMode };

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <ColorModeProvider>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog" 
              element={
                <ProtectedRoute>
                  <BlogPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog/:id" 
              element={
                <ProtectedRoute>
                  <BlogPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog/create" 
              element={
                <ProtectedRoute>
                  <BlogEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog/edit/:id" 
              element={
                <ProtectedRoute>
                  <BlogEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/galleries" 
              element={
                <ProtectedRoute>
                  <GalleriesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </ColorModeProvider>
    </Router>
  );
}

export default App;
