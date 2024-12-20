import React, { useState, useMemo, createContext, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import UserpanelApp from './UserpanelApp';
import AppNavbar from './Navbar/Navbar';
import GalleriesContainer from './components_galleries/GalleriesContainer';
import Login from './LoginSignup/Login';
import SignUp from './LoginSignup/SignUp';
import LandingPage from './landingpage/landingpage';
import EmptyPage from './pages/EmptyPage';
import BlogPage from './Blog/BlogPage';
import BlogEditor from './Blog/BlogEditor';
import BlogPostDetail from './Blog/BlogPostDetail';
import Home from './mainpage/Home';

import { AuthProvider, useAuth } from './AuthContext';

// **1. Define and Export ColorModeContext**
export const ColorModeContext = createContext<{
  toggleColorMode: () => void;
  mode: PaletteMode;
}>({
  toggleColorMode: () => {},
  mode: 'light',
});

// **2. Export useColorMode Hook**
export const useColorMode = () => useContext(ColorModeContext);

// **3. Layout Component to Handle Navbar Visibility**
const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/signup', '/landing'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#FAFBFC] relative w-full">
      {!isLoading && isAuthenticated && !isPublicPage && <AppNavbar />}
      <main className={`w-full ${!isLoading && isAuthenticated && !isPublicPage ? 'pt-8' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

// **4. ProtectedRoute Component**
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// **5. AuthWrapper Component to Prevent Access to Login/Signup if Authenticated**
const AuthWrapper: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading, username } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (isAuthenticated && username) {
    return <Navigate to={`/${username}/home`} replace />;
  }

  return children;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#ff4081',
          },
          background: {
            default: isDarkMode(mode) ? '#121212' : '#f5f5f5',
            paper: isDarkMode(mode) ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
      }),
    [mode]
  );

  // Helper function to determine dark mode
  const isDarkMode = (mode: PaletteMode) => mode === 'dark';

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            
            {/* Login Route */}
            <Route path="/login" element={
              <AuthWrapper>
                <Login />
              </AuthWrapper>
            } />
            
            {/* Signup Route */}
            <Route path="/signup" element={
              <AuthWrapper>
                <SignUp />
              </AuthWrapper>
            } />

            {/* Protected Routes */}
            <Route path="/:username/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/:username/galleries" element={
              <ProtectedRoute>
                <GalleriesContainer />
              </ProtectedRoute>
            } />
            <Route path="/:username/blog" element={
              <ProtectedRoute>
                <BlogPage />
              </ProtectedRoute>
            } />
            <Route path="/:username/blog/:id" element={
              <ProtectedRoute>
                <BlogPostDetail />
              </ProtectedRoute>
            } />
            <Route path="/:username/blog/new" element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } />
            <Route path="/:username/profile" element={
              <ProtectedRoute>
                <UserpanelApp />
              </ProtectedRoute>
            } />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
};

export default App;