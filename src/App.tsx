import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
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
import CommentBox from './CommentBox';

export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode 
});

export const useColorMode = () => useContext(ColorModeContext);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Layout component to handle navbar visibility
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#FAFBFC] relative w-full">
      {!isPublicPage && <AppNavbar />}
      <main className={`w-full ${!isPublicPage ? 'pt-8' : ''}`}>
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
            main: '#ff4081'
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
                <Route path="/" element={<CommentBox />} />
                <Route path="/commentbox" element={<CommentBox />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* User-specific routes */}
               
                <Route path="/:username/home" element={<Home />} />
                <Route path="/:username/galleries" element={<GalleriesContainer />} />
                <Route path="/:username/blog" element={<BlogPage />} />
                <Route path="/:username/blog/:id" element={<BlogPostDetail />} />
                <Route path="/:username/blog/new" element={<BlogEditor />} />
                <Route path="/profile" element={<UserpanelApp />} />
                

                {/* Redirects */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
};

export default App;