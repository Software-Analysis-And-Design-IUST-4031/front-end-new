import React, { useState, useMemo, createContext, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserpanelApp from './UserpanelApp';
import AppNavbar from './Navbar/Navbar';
import Galleries from './components_galleries/galleries';
import SignUp from './SignUp';
import Login from './Login';
import Features from './features/Features';
import Footer from './footer/footer';

export interface CustomTheme {
  bg: string;
  text: string;
}

export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode 
});

export const useColorMode = () => useContext(ColorModeContext);

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
          background: {
            default: mode === 'light' ? '#FFFFFF' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#FFFFFF',
            secondary: mode === 'light' ? '#44546F' : '#E4E6EB',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#121212',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              },
              indicator: {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: mode === 'light' ? '#000000' : '#FFFFFF',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                minHeight: 48,
                color: mode === 'light' ? '#44546F' : '#E4E6EB',
                '&.Mui-selected': {
                  color: mode === 'light' ? '#000000' : '#FFFFFF',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: mode === 'light' ? '#000000' : '#FFFFFF',
                  opacity: 1,
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
                backgroundImage: 'none',
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
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}>
            <AppNavbar />
            <main style={{ 
              flex: 1,
              backgroundColor: theme.palette.background.default,
            }}>
              <Routes>
                <Route path="/home" element={<Features />} />
                <Route path="/blog" element={<Features />} />
                <Route path="/galleries" element={<Galleries />} />
                <Route path="/profile" element={<UserpanelApp />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/galleries" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;