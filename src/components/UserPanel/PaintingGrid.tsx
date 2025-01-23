import React, { useState } from "react";
import {
  Grid,
  Box,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
  useTheme,
  Fade,
  CircularProgress,
  alpha,
  Snackbar,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import LikeButton from "./LikeCounter";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaletteIcon from "@mui/icons-material/Palette";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatIcon from "@mui/icons-material/Chat";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

interface Painting {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string | number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  style?: string;
  material?: string;
  horizontalDepth?: string;
  verticalDepth?: string;
  author?: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    email?: string;
  };
}

interface PaintingGridProps {
  paintings: Painting[];
  onAction: (actionType: string, paintingId: string) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "100%",
  paddingTop: "100%",
  borderRadius: theme.shape.borderRadius * 3,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  }`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 16px 40px rgba(0,0,0,0.5), 0 8px 24px rgba(255,255,255,0.1)"
        : "0 16px 40px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.05)",
    "& .overlay": {
      opacity: 1,
    },
    "& img": {
      transform: "scale(1.1)",
    },
  },
}));

const ImageContainer = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

const PaintingImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
});

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)"
      : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: theme.spacing(3),
  opacity: 0,
  transition: "opacity 0.4s ease",
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
  padding: theme.spacing(1.2),
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.25)",
    transform: "scale(1.15) rotate(8deg)",
  },
  "&.liked": {
    color: theme.palette.error.main,
    backgroundColor: "rgba(255,59,48,0.3)",
  },
  "&.saved": {
    color: "#FFD700",
    backgroundColor: "rgba(255,215,0,0.2)",
  },
}));

const PaintingTitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "1.25rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  transform: "translateY(10px)",
  ".overlay:hover &": {
    transform: "translateY(0)",
  },
}));

const PaintingDescription = styled(Typography)(({ theme }) => ({
  color: "rgba(255,255,255,0.95)",
  fontSize: "0.875rem",
  fontWeight: 500,
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  opacity: 0,
  transform: "translateY(10px)",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  transitionDelay: "0.1s",
  ".overlay:hover &": {
    opacity: 1,
    transform: "translateY(0)",
  },
}));

const PaintingPrice = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "1.1rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  "& .currency": {
    fontSize: "0.8em",
    opacity: 0.95,
  },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  transform: "translateY(20px)",
  opacity: 0,
  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
  ".overlay:hover &": {
    transform: "translateY(0)",
    opacity: 1,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(26,26,26,0.98)"
        : "rgba(255,255,255,0.98)",
    backdropFilter: "blur(20px)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)"
    }`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 24px 48px rgba(0,0,0,0.4)"
        : "0 24px 48px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  "& .MuiDialogTitle-root": {
    padding: theme.spacing(3),
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(145deg, rgba(26,26,26,0.95) 0%, rgba(32,32,32,0.95) 100%)"
        : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)",
    borderBottom: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)"
    }`,
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(4),
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  zIndex: 1,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
    transform: "rotate(90deg)",
  },
  transition: "all 0.3s ease",
}));

const DeleteDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)"
    }`,
    padding: theme.spacing(3),
    minWidth: "400px",
    backdropFilter: "blur(10px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.6)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.9)"
        : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(6px)",
  },
}));

const DeleteDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  fontSize: "1.75rem",
  fontWeight: 700,
  textAlign: "center",
  paddingBottom: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const DeleteDialogContent = styled(DialogContent)(({ theme }) => ({
  color:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
  textAlign: "center",
  padding: theme.spacing(4, 3),
  fontSize: "1.1rem",
  lineHeight: 1.6,
}));

const DeleteDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3, 3),
}));

const DialogButton = styled(Button)(({ theme }) => ({
  minWidth: "130px",
  height: "48px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: theme.shape.borderRadius * 3,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:active": {
    transform: "scale(0.96)",
  },
}));

const NoButton = styled(DialogButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  backgroundColor: "transparent",
  border: `2px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
    border: `2px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.3)"
        : "rgba(0,0,0,0.3)"
    }`,
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 5px 15px rgba(255,255,255,0.1)"
        : "0 5px 15px rgba(0,0,0,0.1)",
  },
}));

const YesButton = styled(DialogButton)(({ theme }) => ({
  color: "#FFFFFF",
  backgroundColor: theme.palette.error.main,
  border: `2px solid ${theme.palette.error.main}`,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
    border: `2px solid ${theme.palette.error.dark}`,
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(255,59,48,0.3)",
  },
}));

const WarningIcon = styled("div")(({ theme }) => ({
  width: "64px",
  height: "64px",
  margin: "0 auto",
  marginBottom: theme.spacing(3),
  borderRadius: "50%",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,59,48,0.15)"
      : "rgba(255,59,48,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${theme.palette.error.main}`,
  "& svg": {
    fontSize: "32px",
    color: theme.palette.error.main,
  },
}));

const DetailDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.mode === "dark" ? "#111111" : "#FFFFFF",
    maxWidth: "1000px",
    width: "90vw",
    maxHeight: "85vh",
    margin: theme.spacing(2),
    overflow: "hidden",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 25px 50px -12px rgba(0,0,0,0.9)"
        : "0 25px 50px -12px rgba(0,0,0,0.25)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)"
    }`,
    animation: "dialogFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(145deg, #111111 0%, #1A1A1A 100%)"
        : "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 100%)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.85)"
        : "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px) saturate(180%)",
  },
}));

const DetailDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  maxHeight: "90vh",
  overflow: "hidden",
  position: "relative",
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "60% 40%",
  gap: theme.spacing(2.5),
  padding: theme.spacing(2.5),
  height: "calc(100% - 70px)",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
    borderRadius: "20px",
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    height: "calc(100% - 90px)",
  },
}));

const ImageSection = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  minHeight: "350px",
  maxHeight: "65vh",
  backgroundColor: theme.palette.mode === "dark" ? "#000" : "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius * 2,
  cursor: "zoom-in",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const DetailImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  filter: "brightness(1.02) contrast(1.02)",
  "&:hover": {
    transform: "scale(1.03)",
    filter: "brightness(1.05) contrast(1.05)",
  },
});

const InfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  borderRadius: theme.shape.borderRadius * 2,
  height: "100%",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
    borderRadius: "10px",
  },
}));

const DetailTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -6,
    left: 0,
    width: "40px",
    height: "2px",
    background: theme.palette.mode === "dark" ? "#E0E0E0" : "#333333",
    borderRadius: "2px",
  },
}));

const DetailField = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.03)"
  }`,
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.03)",
    transform: "translateX(4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 15px rgba(0,0,0,0.3)"
        : "0 4px 15px rgba(0,0,0,0.06)",
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#999" : "#666",
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

const FieldValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.1rem",
  fontWeight: 500,
  lineHeight: 1.5,
}));

const AuthorSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 3),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0,0,0,0.8)"
      : "rgba(255,255,255,0.98)",
  borderTop: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)"
  }`,
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  width: "100%",
  maxWidth: "100%",
  backdropFilter: "blur(8px)",
  zIndex: 10,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 -4px 20px rgba(0,0,0,0.4)"
      : "0 -4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  margin: 0,
}));

const AuthorAvatar = styled(Avatar)(({ theme }) => ({
  width: 42,
  height: 42,
  border: `2px solid ${theme.palette.mode === "dark" ? "#2A2A2A" : "#E0E0E0"}`,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  backgroundColor: theme.palette.mode === "dark" ? "#2A2A2A" : "#F5F5F5",
  flexShrink: 0,
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.08)",
    boxShadow: `0 0 0 3px ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)"
    }`,
  },
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.3),
  minWidth: 0,
  flex: "0 1 auto",
  maxWidth: "200px",
  "& .MuiTypography-h6": {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiTypography-body1": {
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
    fontWeight: 500,
    lineHeight: 1.3,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.4),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "& svg": {
      fontSize: "0.8rem",
      opacity: 0.7,
      flexShrink: 0,
    },
  },
}));

const AuthorActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginLeft: "auto",
  flexShrink: 0,
  "& .MuiIconButton-root": {
    width: 34,
    height: 34,
    color: theme.palette.text.secondary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.04)",
    padding: theme.spacing(0.8),
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.08)",
      transform: "translateY(-2px)",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
}));

const StatsSection = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.02)"
      : "rgba(0,0,0,0.01)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.02)"
  }`,
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.02)"
  }`,
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.03)",
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 15px rgba(0,0,0,0.3)"
        : "0 4px 15px rgba(0,0,0,0.06)",
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "12px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.04)",
  color: theme.palette.mode === "dark" ? "#E0E0E0" : "#333333",
  "& svg": {
    fontSize: "1.1rem",
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: 1,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const Tag = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.75, 2),
  borderRadius: theme.shape.borderRadius * 4,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.03)",
  color: theme.palette.mode === "dark" ? "#E0E0E0" : "#666666",
  fontSize: "0.875rem",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  cursor: "pointer",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0,0,0,0.4)"
        : "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

const formatPrice = (price: string | number | undefined) => {
  if (!price) return "N/A";
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return !isNaN(numericPrice) ? `$${numericPrice.toLocaleString()}` : "N/A";
};

const FullScreenImageDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: 0,
    maxWidth: "100vw",
    maxHeight: "100vh",
    width: "100vw",
    height: "100vh",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.95)"
        : "rgba(255,255,255,0.98)",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "radial-gradient(circle at center, rgba(30,30,30,0.95) 0%, rgba(0,0,0,0.98) 100%)"
        : "radial-gradient(circle at center, rgba(255,255,255,0.98) 0%, rgba(245,245,245,0.95) 100%)",
  },
}));

const FullScreenImage = styled("img")(({ theme }) => ({
  maxWidth: "95vw",
  maxHeight: "90vh",
  objectFit: "contain",
  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  filter: "brightness(1.02) contrast(1.02)",
  cursor: "move",
  userSelect: "none",
}));

const ImageControls = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 10,
  "&:hover": {
    opacity: 1,
  },
}));

const ImageControlButton = styled(IconButton)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(4px)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.5)",
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease",
}));

const FullScreenControls = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(1),
  zIndex: 1300,
}));

const PaintingGrid: React.FC<PaintingGridProps> = ({ paintings, onAction }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [paintingToDelete, setPaintingToDelete] = useState<Painting | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const handleClose = () => {
    setSelectedPainting(null);
  };

  const handleAction = async (actionType: string, painting: Painting) => {
    if (actionType === "delete") {
      setPaintingToDelete(painting);
    } else {
      onAction(actionType, painting.id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!paintingToDelete) return;

    setLoading(true);
    try {
      await onAction("delete", paintingToDelete.id);
      setPaintingToDelete(null);
      enqueueSnackbar("Painting deleted successfully", { variant: "success" });
    } catch (error: any) {
      console.error("Error deleting painting:", error);
      enqueueSnackbar(error.message || "Failed to delete painting", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setPaintingToDelete(null);
  };

  const getImageUrl = (painting: Painting) => {
    if (imageErrors[painting.id]) {
      return "https://via.placeholder.com/400x400?text=Image+Not+Available";
    }
    return painting.imageUrl;
  };

  const handleImageError = (paintingId: string) => {
    setImageErrors((prev) => ({ ...prev, [paintingId]: true }));
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    setFullScreenImage(imageUrl);
    setImageScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageScale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging && imageScale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Calculate bounds based on zoom level
      const bounds = {
        x: Math.abs((window.innerWidth * imageScale - window.innerWidth) / 2),
        y: Math.abs((window.innerHeight * imageScale - window.innerHeight) / 2),
      };

      // Constrain movement within bounds
      const constrainedX = Math.min(Math.max(newX, -bounds.x), bounds.x);
      const constrainedY = Math.min(Math.max(newY, -bounds.y), bounds.y);

      setPosition({
        x: constrainedX,
        y: constrainedY,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleZoom = (e: React.MouseEvent, factor: number) => {
    e.stopPropagation();
    setImageScale((prev) => {
      const newScale = Math.min(Math.max(prev * factor, 1), 3);
      if (newScale === 1) {
        // Reset position when zooming out completely
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleFullScreenClose = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop
    if (e.target === e.currentTarget) {
      setFullScreenImage(null);
      setImageScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {paintings.map((painting) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={painting.id}>
            <StyledPaper
              elevation={0}
              onClick={() => handlePaintingClick(painting)}
            >
              <ImageContainer>
                <PaintingImage
                  src={getImageUrl(painting)}
                  alt={painting.title}
                  onError={() => handleImageError(painting.id)}
                />
                <Overlay className="overlay">
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Tooltip title={painting.isLiked ? "Unlike" : "Like"}>
                      <ActionButton
                        className={painting.isLiked ? "liked" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction("like", painting);
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LikeButton paintingId={parseInt(painting.id)} />
                          <Typography variant="caption" sx={{ color: "#fff" }}>
                            {painting.likes}
                          </Typography>
                        </Box>
                      </ActionButton>
                    </Tooltip>
                    <Tooltip title={painting.isSaved ? "Unsave" : "Save"}>
                      <ActionButton
                        className={painting.isSaved ? "saved" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction("save", painting);
                        }}
                      >
                        {painting.isSaved ? (
                          <BookmarkIcon />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </ActionButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <PaintingTitle variant="h6">{painting.title}</PaintingTitle>
                    <PaintingDescription>
                      {painting.description}
                    </PaintingDescription>
                    <PaintingPrice>
                      <span className="currency">€</span>
                      {painting.price}
                    </PaintingPrice>
                  </Box>
                </Overlay>
              </ImageContainer>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!paintingToDelete}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningIcon>
              <DeleteOutlineIcon />
            </WarningIcon>
            <Typography variant="h6">Delete Painting</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{paintingToDelete?.title}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <DialogButton
            variant="outlined"
            onClick={handleCancelDelete}
            disabled={loading}
          >
            Cancel
          </DialogButton>
          <DialogButton
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </DialogButton>
        </DialogActions>
      </Dialog>

      {/* Painting Detail Dialog */}
      <DetailDialog
        open={!!selectedPainting}
        onClose={() => setSelectedPainting(null)}
        maxWidth={false}
      >
        {selectedPainting && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedPainting.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Created on{" "}
                    {new Date(selectedPainting.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color:
                        theme.palette.mode === "dark" ? "#FFD700" : "#B8860B",
                    }}
                  >
                    ${selectedPainting.price}
                  </Typography>
                  <CloseButton onClick={() => setSelectedPainting(null)}>
                    <CloseIcon />
                  </CloseButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  width: "100%",
                  paddingTop: "75%",
                  position: "relative",
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 32px rgba(0,0,0,0.4)"
                      : "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  component="img"
                  src={getImageUrl(selectedPainting)}
                  alt={selectedPainting.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.5)"
                        : "rgba(0,0,0,0.02)",
                    padding: 2,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(0,0,0,0.8)",
                }}
              >
                {selectedPainting.description}
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                gap: 2,
                borderTop: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)"
                }`,
              }}
            >
              <Button
                onClick={() => setSelectedPainting(null)}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </DetailDialog>

      <FullScreenImageDialog
        open={!!fullScreenImage}
        onClose={(e: any) => handleFullScreenClose(e)}
        onClick={(e: any) => handleFullScreenClose(e)}
        BackdropProps={{
          onClick: (e) => handleFullScreenClose(e),
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => e.stopPropagation()}
        >
          <FullScreenControls onClick={(e) => e.stopPropagation()}>
            <ImageControlButton
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(e, 1.2);
              }}
              disabled={imageScale >= 3}
            >
              <ZoomInIcon />
            </ImageControlButton>
            <ImageControlButton
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(e, 0.8);
              }}
              disabled={imageScale <= 1}
            >
              <ZoomOutIcon />
            </ImageControlButton>
            <ImageControlButton
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenImage(null);
              }}
            >
              <CloseIcon />
            </ImageControlButton>
          </FullScreenControls>
          {fullScreenImage && (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FullScreenImage
                src={fullScreenImage}
                alt="Full screen view"
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
                style={{
                  transform: `scale(${imageScale}) translate(${position.x}px, ${position.y}px)`,
                  cursor:
                    imageScale > 1
                      ? isDragging
                        ? "grabbing"
                        : "grab"
                      : "default",
                }}
                draggable={false}
              />
            </Box>
          )}
          {imageScale > 1 && (
            <Typography
              sx={{
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                color: "rgba(255,255,255,0.7)",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "4px 12px",
                borderRadius: 2,
                fontSize: "0.875rem",
                pointerEvents: "none",
              }}
            >
              Click and drag to move
            </Typography>
          )}
        </Box>
      </FullScreenImageDialog>
    </>
  );
};

export default PaintingGrid;
