import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  styled,
  useTheme,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaletteIcon from "@mui/icons-material/Palette";
import BrushIcon from "@mui/icons-material/Brush";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CollectionsIcon from "@mui/icons-material/Collections";

interface FavoritesDialogProps {
  open: boolean;
  onClose: () => void;
  userProfile: {
    firstname: string;
    lastname: string;
    profile_picture?: string;
    favorite_painter?: string;
    favorite_painting?: string;
    favorite_painting_style?: string;
    favorite_painting_technique?: string;
    favorite_painting_to_own?: string;
  };
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
    maxWidth: 800,
    width: "95%",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(45deg, rgba(30,30,30,0.8) 0%, rgba(20,20,20,0.9) 100%)"
        : "linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.95) 100%)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)"
    }`,
  },
}));

const FavoriteSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  }`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 24px rgba(0,0,0,0.4)"
        : "0 8px 24px rgba(0,0,0,0.1)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
  }`,
  "& .MuiChip-label": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.08)",
  },
}));

const UserHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
}));

const FavoritesDialog: React.FC<FavoritesDialogProps> = ({
  open,
  onClose,
  userProfile,
}) => {
  const theme = useTheme();

  const renderFavorites = (
    items: string | undefined,
    icon: React.ReactNode,
    title: string
  ) => {
    if (!items) return null;
    const itemList = items.split(",").filter(Boolean);
    if (itemList.length === 0) return null;

    return (
      <FavoriteSection>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {itemList.map((item, index) => (
            <StyledChip key={index} label={item.trim()} variant="outlined" />
          ))}
        </Box>
      </FavoriteSection>
    );
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Artistic Preferences
          </Typography>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <UserHeader>
          <Avatar
            src={userProfile.profile_picture}
            sx={{ width: 64, height: 64 }}
          >
            {userProfile.firstname?.[0]}
            {userProfile.lastname?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {userProfile.firstname} {userProfile.lastname}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Art Enthusiast
            </Typography>
          </Box>
        </UserHeader>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderFavorites(
              userProfile.favorite_painter,
              <PaletteIcon color="primary" />,
              "Favorite Painters"
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderFavorites(
              userProfile.favorite_painting,
              <CollectionsIcon color="secondary" />,
              "Favorite Paintings"
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderFavorites(
              userProfile.favorite_painting_style,
              <BrushIcon sx={{ color: "#FF9800" }} />,
              "Favorite Styles"
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderFavorites(
              userProfile.favorite_painting_technique,
              <ColorLensIcon sx={{ color: "#4CAF50" }} />,
              "Favorite Techniques"
            )}
          </Grid>
          <Grid item xs={12}>
            {renderFavorites(
              userProfile.favorite_painting_to_own,
              <FavoriteIcon sx={{ color: "#F44336" }} />,
              "Dream Collection"
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
};

export default FavoritesDialog;
