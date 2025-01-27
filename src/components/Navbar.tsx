import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  styled,
  useTheme,
  IconButton,
  Typography,
  Container,
  AppBar,
  Tooltip,
} from "@mui/material";
import { useColorMode } from "../context/ColorModeContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import whiteLogo from "../assets/white_on_trans.png";
import blackLogo from "../assets/black_on_trans.png";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DepositDialog from "./DepositDialog";
import { Add as AddIcon } from "@mui/icons-material";
import { userService } from "../services/userService";

const NavbarWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 20px rgba(0,0,0,0.3)"
      : "0 4px 20px rgba(0,0,0,0.08)",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: 3,
    backgroundColor: theme.palette.mode === "dark" ? "#2196F3" : "#1976D2",
    borderRadius: "3px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "& .MuiTabs-flexContainer": {
    justifyContent: "center",
  },
  position: "relative",
  minHeight: 48,
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "1rem",
  padding: "12px 24px",
  minHeight: 48,
  color: theme.palette.mode === "dark" ? "#E4E6EB" : "#44546F",
  "&:hover": {
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.04)",
    transform: "translateY(-1px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? "#2196F3" : "#1976D2",
    fontWeight: 600,
  },
  "&.MuiTab-root": {
    minWidth: 120,
    borderRadius: theme.shape.borderRadius,
  },
}));

const NavbarContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  padding: 0,
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(0),
  marginBottom: theme.spacing(0),
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.03)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.05)",
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255,255,255,0.1)"
        : "0 4px 12px rgba(0,0,0,0.05)",
  },
}));

const CoinDisplay = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 215, 0, 0.15)"
      : "rgba(184, 134, 11, 0.12)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 215, 0, 0.3)"
      : "rgba(184, 134, 11, 0.25)"
  }`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(255, 215, 0, 0.1)"
      : "0 2px 8px rgba(184, 134, 11, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255, 215, 0, 0.2)"
        : "0 4px 12px rgba(184, 134, 11, 0.2)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 215, 0, 0.2)"
        : "rgba(184, 134, 11, 0.15)",
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#E4E6EB" : "#44546F",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.03)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.08)",
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255,255,255,0.1)"
        : "0 4px 12px rgba(0,0,0,0.05)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

interface NavbarProps {
  onSidebarToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const { username, userProfile, userId, updateProfile, logout } = useAuth();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  const currentPath = location.pathname.split("/")[1] || "home";

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDepositSuccess = async () => {
    if (userId) {
      try {
        const updatedProfile = await userService.getUserProfile(userId);
        updateProfile(updatedProfile);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  const navItems = [
    { label: "Home", value: "home" },
    { label: "Blog", value: "blog" },
    { label: "Galleries", value: "galleries" },
    { label: "Profile", value: "profile" },
  ];

  return (
    <>
      <NavbarWrapper>
        <AppBar position="static" color="transparent" elevation={0}>
          <NavbarContainer maxWidth="lg">
            <LogoContainer>
              <Box
                component="img"
                src={theme.palette.mode === "dark" ? whiteLogo : blackLogo}
                alt="Logo"
                sx={{
                  height: "280px",
                  width: "auto",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  marginBottom: "-60px",
                  marginTop: "-30px",
                }}
                onClick={() => navigate("/")}
              />
            </LogoContainer>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: theme.spacing(1, 3),
                }}
              >
                {username && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Tooltip title="Toggle Sidebar" placement="right">
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onSidebarToggle?.();
                        }}
                      >
                        <MenuIcon />
                      </ActionButton>
                    </Tooltip>
                  </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {username && (
                    <>
                      <Tooltip title="Your Profile" placement="bottom">
                        <UserInfo onClick={() => navigate("/profile")}>
                          <Typography
                            variant="body1"
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#E4E6EB"
                                  : "#44546F",
                              fontWeight: 600,
                            }}
                          >
                            {username}
                          </Typography>
                        </UserInfo>
                      </Tooltip>
                      <Tooltip title="Your Coins" placement="bottom">
                        <CoinDisplay>
                          <MonetizationOnIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#FFD700"
                                  : "#B8860B",
                              fontSize: "1.2rem",
                              filter:
                                "drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#FFD700"
                                  : "#B8860B",
                              fontWeight: 700,
                              fontSize: "0.95rem",
                              textShadow:
                                theme.palette.mode === "dark"
                                  ? "0 2px 4px rgba(255, 215, 0, 0.3)"
                                  : "0 2px 4px rgba(184, 134, 11, 0.3)",
                            }}
                          >
                            {userProfile?.coins || 0}
                          </Typography>
                        </CoinDisplay>
                      </Tooltip>
                      <Tooltip title="Add Coins" placement="bottom">
                        <IconButton
                          size="small"
                          onClick={() => setDepositDialogOpen(true)}
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "inherit",
                            "&:hover": {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip title="Logout" placement="bottom">
                    <ActionButton onClick={handleLogout} size="small">
                      <LogoutIcon />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      theme.palette.mode === "dark" ? "Light mode" : "Dark mode"
                    }
                    placement="bottom"
                  >
                    <ActionButton onClick={toggleColorMode} size="small">
                      {theme.palette.mode === "dark" ? (
                        <Brightness7Icon />
                      ) : (
                        <Brightness4Icon />
                      )}
                    </ActionButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  borderRadius: theme.shape.borderRadius,
                  padding: theme.spacing(0.5),
                  margin: theme.spacing(0, 3, 2),
                }}
              >
                <StyledTabs
                  value={currentPath}
                  onChange={handleChange}
                  aria-label="navigation tabs"
                  centered
                  sx={{
                    "& .MuiTabs-flexContainer": {
                      gap: theme.spacing(2),
                    },
                  }}
                >
                  {navItems.map((item) => (
                    <StyledTab
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </StyledTabs>
              </Box>
            </Box>
          </NavbarContainer>
        </AppBar>
      </NavbarWrapper>

      <DepositDialog
        open={depositDialogOpen}
        onClose={() => setDepositDialogOpen(false)}
        onSuccess={handleDepositSuccess}
      />
    </>
  );
};

export default Navbar;
