import React, { useState, useMemo, createContext, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserpanelApp from './UserpanelApp';
import AppNavbar from './Navbar/Navbar';
import GalleriesContainer from './components_galleries/GalleriesContainer';

// import GeminiChat from './components/GeminiChat';

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
    <NextUIProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div className="min-h-screen bg-[#FAFBFC] relative">
              <AppNavbar />
              <main className="container mx-auto px-4 pt-8">
                <Routes>
                  <Route path="/profile" element={<UserpanelApp />} />
                  <Route path="/" element={<UserpanelApp />} />
                  <Route path="/home" element={<div>Home Page</div>} />
                  <Route path="/blog" element={<div>Blog Page</div>} />
                  <Route path="/galleries" element={<GalleriesContainer />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </NextUIProvider>
  );
};

export default App;