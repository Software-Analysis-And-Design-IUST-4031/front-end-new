import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  ThemeProvider,
  createTheme,
  CircularProgress,
  Box,
} from "@mui/material";
import { userService } from "../services/userService";
import { useLocation } from "react-router-dom";

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isPublicPage = ["/", "/login", "/signup"].includes(location.pathname);
  const [isLoading, setIsLoading] = useState(!isPublicPage);
  const [mode, setMode] = useState<"light" | "dark">("light"); // Default to light

  // Load theme from backend on mount (only for non-public pages)
  useEffect(() => {
    const loadTheme = async () => {
      if (isPublicPage) {
        setIsLoading(false);
        return;
      }

      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const userProfile = await userService.getUserProfile(Number(userId));
          if (userProfile.Dark_light_theme) {
            setMode(userProfile.Dark_light_theme);
          }
        } catch (error) {
          console.error("Error loading theme:", error);
          // If there's an error, use light theme
          setMode("light");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, [isPublicPage]);

  // Effect to handle theme for landing page
  useEffect(() => {
    if (isLandingPage) {
      const savedTheme = localStorage.getItem("landingPageTheme");
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setMode(savedTheme);
      } else {
        setMode("light");
      }
    } else if (isPublicPage) {
      setMode("light"); // Always light for login/signup
    }
  }, [isLandingPage, isPublicPage]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        if (isLandingPage) {
          const newMode = mode === "light" ? "dark" : "light";
          setMode(newMode);
          localStorage.setItem("landingPageTheme", newMode);
        } else if (!isPublicPage) {
          const newMode = mode === "light" ? "dark" : "light";
          setMode(newMode);
          const userId = localStorage.getItem("userId");
          if (userId) {
            const formData = new FormData();
            formData.append("Dark_light_theme", newMode);
            userService
              .updateUserProfile(Number(userId), formData)
              .catch((error) => console.error("Error updating theme:", error));
          }
        }
      },
      mode,
    }),
    [mode, isLandingPage, isPublicPage]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#121212",
                  paper: "#1E1E1E",
                },
                text: {
                  primary: "#fff",
                  secondary: "rgba(255, 255, 255, 0.7)",
                },
              }
            : {
                background: {
                  default: "#ffffff",
                  paper: "#fff",
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      }),
    [mode]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
