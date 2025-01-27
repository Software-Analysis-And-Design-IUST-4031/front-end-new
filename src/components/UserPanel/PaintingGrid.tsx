import React, { useState, useEffect } from "react";
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
  keyframes,
  Theme,
  SxProps,
  Dialog as ShareDialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import LikeButton from "../Painting/LikeButton";
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
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InstagramIcon from "@mui/icons-material/Instagram";
import { userService } from "../../services/userService";
import { css } from "@emotion/react";
import { useAuth } from "../../context/AuthContext";
import paintingService from "../../services/paintingService";

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
  color: "#FFFFFF",
  backgroundColor: "transparent",
  transition: "all 0.3s ease",
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  "&.saved": {
    color: "#FF3B30",
  },
  "& .MuiSvgIcon-root": {
    color: "#FFFFFF",
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

const StyledCoinIcon = styled(MonetizationOnIcon)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #FFD700 100%)"
      : "linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #FFD700 100%)",
  borderRadius: "50%",
  padding: 4,
  fontSize: "1.5rem",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 10px rgba(255, 215, 0, 0.3)"
      : "0 0 10px rgba(253, 185, 49, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: "coinShine 3s infinite",
  "@keyframes coinShine": {
    "0%": {
      filter: "brightness(100%)",
    },
    "50%": {
      filter: "brightness(120%)",
    },
    "100%": {
      filter: "brightness(100%)",
    },
  },
  "&:hover": {
    transform: "scale(1.1) rotate(15deg)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 0 15px rgba(255, 215, 0, 0.5)"
        : "0 0 15px rgba(253, 185, 49, 0.5)",
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
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 0,
  alignItems: "center",
  transform: "translateY(20px)",
  opacity: 0,
  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
  ".overlay:hover &": {
    transform: "translateY(0)",
    opacity: 1,
  },
  "& > *": {
    marginLeft: "-16px",
  },
  "& > :first-of-type": {
    marginLeft: 0,
  },
  "& .MuiIconButton-root": {
    marginLeft: "-12px",
  },
  "& .MuiIconButton-root:first-of-type": {
    marginLeft: 0,
  },
}));

const heartBeatAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.5); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
`;

const HeartAnimation = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  animation: `${heartBeatAnimation} 0.8s ease-in-out`,
  color: theme.palette.error.main,
  zIndex: 10,
  "& svg": {
    fontSize: "64px",
  },
}));

const heartBeat = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
`;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: `${theme.shape.borderRadius * 3}px`,
    backgroundColor: theme.palette.mode === "dark" ? "#111111" : "#FFFFFF",
    maxWidth: "1300px",
    width: "95vw",
    maxHeight: "92vh",
    margin: theme.spacing(2),
    overflow: "hidden",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 25px 50px -12px rgba(0,0,0,0.95), 0 0 100px rgba(0,0,0,0.5)"
        : "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 100px rgba(0,0,0,0.1)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)"
    }`,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(145deg, #111111 0%, #1A1A1A 100%)"
        : "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 100%)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.92)"
        : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px) saturate(180%)",
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
    maxWidth: "1300px",
    width: "95vw",
    maxHeight: "92vh",
    margin: theme.spacing(2),
    overflow: "hidden",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 25px 50px -12px rgba(0,0,0,0.95), 0 0 100px rgba(0,0,0,0.5)"
        : "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 100px rgba(0,0,0,0.1)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)"
    }`,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(145deg, #111111 0%, #1A1A1A 100%)"
        : "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 100%)",
    "& .MuiTypography-root": {
      color: theme.palette.mode === "dark" ? "#FFFFFF !important" : "inherit",
    },
    "& .MuiIconButton-root": {
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
    },
  },
  "& .MuiBackdrop-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.92)"
        : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px) saturate(180%)",
  },
}));

const DetailDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  maxHeight: "92vh",
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.mode === "dark" ? "#111111" : "#FFFFFF",
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "60% 40%",
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  height: "calc(100% - 70px)",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
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
  borderRadius: theme.shape.borderRadius * 3,
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 20px 40px rgba(0,0,0,0.6)"
      : "0 20px 40px rgba(0,0,0,0.15)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  }`,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover .zoom-controls": {
    opacity: 1,
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  height: "100%",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
    borderRadius: "20px",
  },
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.03)"
  }`,
  transition: "all 0.3s ease",
  "& .MuiTypography-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF !important" : "inherit",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.03)",
    transform: "translateX(4px)",
  },
}));

const DetailIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
}));

const AuthorSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.03)"
  }`,
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  "& .MuiTypography-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF !important" : "inherit",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.03)",
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 16px rgba(0,0,0,0.4)"
        : "0 8px 16px rgba(0,0,0,0.1)",
  },
  "& .MuiIconButton-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.05)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)",
      transform: "scale(1.1)",
    },
  },
}));

const ZoomControls = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  opacity: 1,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0,0,0,0.85)"
      : "rgba(255,255,255,0.95)",
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 3,
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  }`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0,0,0,0.5)"
      : "0 8px 32px rgba(0,0,0,0.1)",
  "& .MuiIconButton-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.2)"
          : "rgba(0,0,0,0.1)",
      transform: "scale(1.1)",
    },
    transition: "all 0.2s ease",
  },
}));

const LikeButtonStyled = styled(LikeButton)(({ theme }) => ({
  marginRight: "-12px",
  "& .MuiIconButton-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    transform: "scale(1.4)",
    padding: "20px",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)",
      transform: "scale(1.5)",
      zIndex: 1,
    },
    "&.liked": {
      color: "#FF3B30",
    },
  },
  "& .MuiTypography-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF !important" : "inherit",
    fontSize: "1.3rem",
    fontWeight: 600,
  },
  "& svg": {
    fontSize: "28px",
  },
}));

const PaintingGrid: React.FC<PaintingGridProps> = ({ paintings, onAction }) => {
  const { userId: currentUserId } = useAuth();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paintingToDelete, setPaintingToDelete] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHeart, setShowHeart] = useState(false);
  const [localPaintings, setLocalPaintings] = useState<Painting[]>(paintings);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [likedPaintingId, setLikedPaintingId] = useState<string | null>(null);

  // Update local paintings when props change
  useEffect(() => {
    setLocalPaintings(paintings);
  }, [paintings]);

  const handleDoubleClick = (e: React.MouseEvent, paintingId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const handleCloseDetail = () => {
    setSelectedPainting(null);
    setZoomLevel(1);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setZoomLevel(1);
  };

  const handleShare = (e: React.MouseEvent, painting: Painting) => {
    e.stopPropagation();
    setShareDialogOpen(true);
  };

  const handleShareOption = (platform: string, painting: Painting) => {
    const shareUrl = `${window.location.origin}/profile?paintingId=${painting.id}`;
    const shareText = `${painting.title}\n\n${painting.description}`;

    const shareLinks = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(
        `Check out this painting: ${painting.title}\n\n${painting.description}`
      )}`,
      instagram: `instagram://share?text=${encodeURIComponent(
        `Check out this painting: ${painting.title}\n\n${shareUrl}`
      )}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${shareUrl}`
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(painting.title)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
    } else if (platform === "instagram") {
      // Try to open Instagram app first
      window.location.href = shareLinks.instagram;

      // Fallback after a short delay if app didn't open
      setTimeout(() => {
        enqueueSnackbar(
          "Instagram app not found. You can copy the link and share it manually.",
          { variant: "info", autoHideDuration: 5000 }
        );
      }, 2000);
    } else {
      const width = 600;
      const height = 400;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      window.open(
        shareLinks[platform as keyof typeof shareLinks],
        "_blank",
        `width=${width},height=${height},left=${left},top=${top}`
      );
    }
    setShareDialogOpen(false);
  };

  const dialogContentSx: SxProps<Theme> = {
    backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
    "& *": {
      color: theme.palette.mode === "dark" ? "#FFFFFF !important" : "inherit",
    },
  };

  const dialogTitleSx: SxProps<Theme> = {
    backgroundColor: theme.palette.mode === "dark" ? "#242424" : "#F8F8F8",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
    "& *": {
      color: "inherit",
    },
  };

  const handleActionClick = async (
    e: React.MouseEvent,
    actionType: string,
    paintingId: string
  ) => {
    e.stopPropagation();
    if (!currentUserId) return;

    try {
      if (actionType === "save") {
        const painting = localPaintings.find((p) => p.id === paintingId);
        if (!painting) return;

        if (painting.isSaved) {
          await paintingService.unsavePainting(parseInt(paintingId));
        } else {
          await paintingService.savePainting(parseInt(paintingId));
        }
      }

      // Notify parent component
      onAction(actionType, paintingId);
    } catch (error) {
      console.error(`Error handling ${actionType} action:`, error);
    }
  };

  const handleLike = (paintingId: string) => {
    setLikedPaintingId(paintingId);
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
      setLikedPaintingId(null);
    }, 800);
  };

  return (
    <>
      <Grid container spacing={3}>
        {localPaintings.map((painting) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={painting.id}>
            <Box
              onClick={() => handlePaintingClick(painting)}
              onDoubleClick={(e) => handleDoubleClick(e, painting.id)}
              sx={{ position: "relative" }}
            >
              <StyledPaper>
                <ImageContainer>
                  <PaintingImage src={painting.imageUrl} alt={painting.title} />
                  <Overlay className="overlay">
                    <Box>
                      <PaintingTitle variant="h6">
                        {painting.title}
                      </PaintingTitle>
                      <PaintingDescription>
                        {painting.description}
                      </PaintingDescription>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <PaintingPrice>
                        <StyledCoinIcon />
                        {painting.price}
                      </PaintingPrice>
                      <ActionButtonsContainer>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LikeButton
                            paintingId={parseInt(painting.id)}
                            onLike={() => handleLike(painting.id)}
                          />
                          <IconButton
                            onClick={(e) =>
                              handleActionClick(e, "save", painting.id)
                            }
                            sx={{
                              color: "#FFFFFF",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              },
                            }}
                          >
                            {painting.isSaved ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                        </Box>
                        {currentUserId &&
                          painting.author?.id &&
                          currentUserId === parseInt(painting.author.id) && (
                            <ActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaintingToDelete(painting.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <DeleteOutlineIcon />
                            </ActionButton>
                          )}
                      </ActionButtonsContainer>
                    </Box>
                  </Overlay>
                </ImageContainer>
              </StyledPaper>
              {showHeart && likedPaintingId === painting.id && (
                <HeartAnimation>
                  <FavoriteIcon />
                </HeartAnimation>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedPainting && (
        <DetailDialog
          open={Boolean(selectedPainting)}
          onClose={handleCloseDetail}
          maxWidth={false}
        >
          <DetailDialogContent>
            <CloseButton onClick={handleCloseDetail}>
              <CloseIcon />
            </CloseButton>
            <MainContent>
              <ImageSection>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                  }}
                >
                  <img
                    src={selectedPainting.imageUrl}
                    alt={selectedPainting.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "top left",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  {showHeart && likedPaintingId === selectedPainting.id && (
                    <HeartAnimation>
                      <FavoriteIcon />
                    </HeartAnimation>
                  )}
                  <ZoomControls
                    className="zoom-controls"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Tooltip title="Zoom Out">
                      <IconButton
                        size="small"
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                      >
                        <ZoomOutIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset Zoom">
                      <IconButton size="small" onClick={handleResetZoom}>
                        <ZoomOutMapIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Zoom In">
                      <IconButton
                        size="small"
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 3}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </Tooltip>
                  </ZoomControls>
                </Box>
              </ImageSection>
              <InfoSection>
                {selectedPainting.author && (
                  <AuthorSection>
                    <Avatar
                      src={selectedPainting.author.avatarUrl}
                      alt={selectedPainting.author.name}
                      sx={{ width: 56, height: 56 }}
                    >
                      {selectedPainting.author.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPainting.author.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{selectedPainting.author.username}
                      </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto" }}>
                      <Tooltip title="Follow Artist">
                        <IconButton>
                          <PersonAddIcon />
                        </IconButton>
                      </Tooltip>
                      {String(selectedPainting.author.id) !==
                        String(currentUserId) && (
                        <Tooltip title="Message Artist">
                          <IconButton>
                            <ChatIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </AuthorSection>
                )}

                <Typography
                  variant="h4"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "#FFFFFF !important"
                        : "inherit",
                    textShadow:
                      theme.palette.mode === "dark"
                        ? "0 2px 4px rgba(0,0,0,0.5)"
                        : "none",
                  }}
                >
                  {selectedPainting.title}
                </Typography>

                <DetailItem>
                  <DetailIcon>
                    <PaletteIcon />
                  </DetailIcon>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Style & Material
                    </Typography>
                    <Typography variant="body1">
                      {selectedPainting.style} • {selectedPainting.material}
                    </Typography>
                  </Box>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <LocalOfferIcon />
                  </DetailIcon>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <StyledCoinIcon />
                      {selectedPainting.price}
                    </Typography>
                  </Box>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <VisibilityIcon />
                  </DetailIcon>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body1">
                      {selectedPainting.horizontalDepth} ×{" "}
                      {selectedPainting.verticalDepth}
                    </Typography>
                  </Box>
                </DetailItem>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                    padding: 3,
                    borderRadius: (theme) => theme.shape.borderRadius * 2,
                    marginTop: 2,
                    border: (theme) =>
                      `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)"
                      }`,
                    lineHeight: 1.7,
                  }}
                >
                  {selectedPainting.description}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    marginTop: "auto",
                    paddingTop: 3,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    "& .MuiButton-root": {
                      borderRadius: (theme: Theme) =>
                        theme.shape.borderRadius * 2,
                      padding: "12px 24px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: (theme: Theme) =>
                        theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <ZoomControls>
                      <Tooltip title="Zoom Out">
                        <IconButton
                          size="small"
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 0.5}
                        >
                          <ZoomOutIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset Zoom">
                        <IconButton size="small" onClick={handleResetZoom}>
                          <ZoomOutMapIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom In">
                        <IconButton
                          size="small"
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 3}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      </Tooltip>
                    </ZoomControls>
                    <LikeButtonStyled
                      paintingId={parseInt(selectedPainting.id)}
                      onLike={() => handleLike(selectedPainting.id)}
                      sx={{
                        "& .MuiIconButton-root": {
                          backgroundColor: (theme: Theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                          padding: "32px",
                          transform: "scale(2)",
                          "& svg": {
                            fontSize: "48px",
                          },
                        },
                        "& .MuiTypography-root": {
                          fontSize: "1.8rem",
                          fontWeight: 700,
                          marginLeft: "16px",
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon sx={{ fontSize: "24px" }} />}
                      onClick={(e) => handleShare(e, selectedPainting)}
                      sx={{
                        minWidth: "120px",
                        height: "48px",
                      }}
                    >
                      Share
                    </Button>
                  </Box>
                </Box>
              </InfoSection>
            </MainContent>
          </DetailDialogContent>
        </DetailDialog>
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DeleteDialogTitle>Delete Painting?</DeleteDialogTitle>
        <DeleteDialogContent>
          <WarningIcon>
            <DeleteOutlineIcon />
          </WarningIcon>
          Are you sure you want to delete this painting? This action cannot be
          undone.
        </DeleteDialogContent>
        <DeleteDialogActions>
          <NoButton onClick={() => setDeleteDialogOpen(false)}>Cancel</NoButton>
          <YesButton
            onClick={() => {
              if (paintingToDelete) {
                onAction("delete", paintingToDelete);
                setDeleteDialogOpen(false);
              }
            }}
          >
            Delete
          </YesButton>
        </DeleteDialogActions>
      </DeleteDialog>

      {selectedPainting && (
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: "100%",
              maxWidth: "400px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.8)"
                  : "0 8px 32px rgba(0,0,0,0.1)",
              "& .MuiList-root": {
                padding: 2,
              },
              "& .MuiListItemText-primary": {
                color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
                fontSize: "1rem",
                fontWeight: 500,
              },
              "& .MuiListItem-root": {
                transition: "all 0.2s ease",
                margin: "4px 0",
                padding: "12px 16px",
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              borderBottom: 1,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "divider",
              pb: 2,
              pt: 2.5,
              px: 3,
              fontWeight: 600,
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
              fontSize: "1.25rem",
              backgroundColor:
                theme.palette.mode === "dark" ? "#242424" : "#F8F8F8",
            }}
          >
            Share Painting
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            <List>
              <ListItem
                component="div"
                onClick={() => handleShareOption("telegram", selectedPainting)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0, 136, 204, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <TelegramIcon sx={{ color: "#0088cc", fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText primary="Share on Telegram" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => handleShareOption("instagram", selectedPainting)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(228, 64, 95, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <InstagramIcon sx={{ color: "#E4405F", fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText primary="Share on Instagram" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => handleShareOption("whatsapp", selectedPainting)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(37, 211, 102, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <WhatsAppIcon sx={{ color: "#25D366", fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText primary="Share on WhatsApp" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => handleShareOption("facebook", selectedPainting)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(24, 119, 242, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <FacebookIcon sx={{ color: "#1877F2", fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText primary="Share on Facebook" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => handleShareOption("twitter", selectedPainting)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(29, 161, 242, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <TwitterIcon sx={{ color: "#1DA1F2", fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText primary="Share on Twitter" />
              </ListItem>
              <ListItem
                component="div"
                onClick={() => handleShareOption("copy", selectedPainting)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.04)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  <ContentCopyIcon
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
                      fontSize: 24,
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Copy Link" />
              </ListItem>
            </List>
          </DialogContent>
        </ShareDialog>
      )}
    </>
  );
};

export default PaintingGrid;
