import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Backdrop,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { UserProfile } from "../../types";
import EditProfileButton from "./EditProfileButton";

interface SideBarProps {
  open: boolean;
  onClose: () => void;
  userData: UserProfile;
  onProfileUpdate: (data: UserProfile) => void;
}

interface StyledBoxProps {
  isOpen: boolean;
  isMinimized: boolean;
}

const SideBarContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !["isOpen", "isMinimized"].includes(prop as string),
})<StyledBoxProps>(({ theme, isOpen, isMinimized }) => ({
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  width: isMinimized ? 60 : isOpen ? 280 : 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(20,20,20,0.95)"
      : "rgba(255,255,255,0.95)",
  borderRight: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  transition: "all 0.3s ease-in-out",
  overflowX: "hidden",
  overflowY: "auto",
  zIndex: 1200,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  transform: isOpen ? "translateX(0)" : "translateX(-100%)",
  visibility: isOpen ? "visible" : "hidden",
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: "2rem",
  backgroundColor: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const UserEmail = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

const NavSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  width: "100%",
  justifyContent: "flex-start",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SideBar: React.FC<SideBarProps> = ({
  open,
  onClose,
  userData,
  onProfileUpdate,
}) => {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);
  const theme = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const getInitials = (firstname: string, lastname: string) => {
    const firstInitial = firstname ? firstname[0].toUpperCase() : "";
    const lastInitial = lastname ? lastname[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const renderUserAvatar = (userData: UserProfile) => {
    if (typeof userData.profile_picture === "string") {
      return (
        <UserAvatar src={userData.profile_picture} alt={userData.username} />
      );
    }

    // If no profile picture or it's a File object, show initials
    return (
      <UserAvatar>
        {getInitials(userData.firstname, userData.lastname)}
      </UserAvatar>
    );
  };

  return (
    <>
      <Backdrop
        open={open && !minimized}
        onClick={onClose}
        sx={{
          zIndex: 1100,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />
      <SideBarContainer
        isOpen={open}
        isMinimized={minimized}
        sx={{
          boxShadow: open ? theme.shadows[8] : "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton onClick={toggleMinimize}>
            {minimized ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {!minimized && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {!minimized && (
          <UserSection>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderUserAvatar(userData)}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {userData.firstname} {userData.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <EditProfileButton
                userData={userData}
                onProfileUpdate={onProfileUpdate}
              />
            </Box>
          </UserSection>
        )}

        <NavSection>
          <Tooltip title="Home" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/")}>
              <HomeIcon />
              {!minimized && <Typography>Home</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Profile" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/profile")}>
              <PersonIcon />
              {!minimized && <Typography>Profile</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Favorites" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/favorites")}>
              <FavoriteIcon />
              {!minimized && <Typography>Favorites</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Settings" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/settings")}>
              <SettingsIcon />
              {!minimized && <Typography>Settings</Typography>}
            </NavButton>
          </Tooltip>
        </NavSection>
      </SideBarContainer>
    </>
  );
};

export default SideBar;
