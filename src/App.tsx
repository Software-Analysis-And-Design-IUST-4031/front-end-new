import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UserpanelApp from './UserpanelApp';
import AppNavbar from './Navbar/Navbar';
import GalleriesContainer from './components_galleries/GalleriesContainer';
import Login from './LoginSignup/Login';
import SignUp from './LoginSignup/SignUp';
import LandingPage from './landingpage/landingpage';
import EmptyPage from './pages/EmptyPage';
import BlogPage from './Blog/BlogPage';
import BlogEditor from './Blog/BlogEditor';
import Home from './mainpage/Home';

export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode 
});

export const useColorMode = () => useContext(ColorModeContext);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout component to handle navbar visibility
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/signup' , '/Galleries' ].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#FAFBFC] relative w-full">
      {!isPublicPage && <AppNavbar />}
      <main className={`w-full min-h-screen ${!isPublicPage ? 'pt-8' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  // Remove the authentication clearing
  // useEffect(() => {
  //   localStorage.removeItem('isAuthenticated');
  //   localStorage.removeItem('access_token');
  // }, []);

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
            default: mode === 'light' ? '#ffffff' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          button: {
            textTransform: 'none',
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#fff' : '#1e1e1e',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/LandingPage" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/HomePage" element={<Home />} />
                <Route path="/Login" element={<Navigate to="/login" replace />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/SignUp" element={<Navigate to="/signup" replace />} />
                <Route path="/home" element={
                    <EmptyPage />
                } />
                <Route path="/Home" element={<Navigate to="/home" replace />} />
                <Route path="/galleries" element={
                    <GalleriesContainer />
                } />
                <Route path="/Galleries" element={<Navigate to="/galleries" replace />} />
                <Route path="/blog" element={
                    <BlogPage />
                } />
                <Route path="/Blog" element={<Navigate to="/blog" replace />} />
                <Route path="/blog/new" element={
                    <BlogEditor />
                } />
                <Route path="/profile" element={
                    <UserpanelApp />
                } />
                <Route path="/Profile" element={<Navigate to="/profile" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
};

export default App;