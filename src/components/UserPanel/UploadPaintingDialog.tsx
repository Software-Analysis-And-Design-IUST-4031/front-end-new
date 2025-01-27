import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  styled,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(26, 26, 26, 0.98)"
        : "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)"
    }`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.4)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    maxWidth: 500,
    margin: theme.spacing(2),
  },
  "& .MuiBackdrop-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.8)"
        : "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(3),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, rgba(26,26,26,0.95) 0%, rgba(32,32,32,0.95) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.05)"
  }`,
  "& .MuiTypography-root": {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "rotate(90deg)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
  },
}));

const UploadArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  border: `2px dashed ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(0, 0, 0, 0.15)"
  }`,
  borderRadius: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(0, 0, 0, 0.02)",
  "&:hover": {
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.25)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(0, 0, 0, 0.03)",
    transform: "translateY(-2px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(0, 0, 0, 0.02)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    minHeight: 56,
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
    },
    "&.Mui-focused": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
      boxShadow: `0 0 0 2px ${
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.1)"
      }`,
    },
  },
  "& .MuiInputBase-input": {
    minHeight: 24,
  },
}));

const PreviewImage = styled("img")({
  width: "100%",
  height: 300,
  objectFit: "contain",
  borderRadius: 16,
  marginBottom: 24,
  backgroundColor: "rgba(0, 0, 0, 0.03)",
  padding: 16,
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 24px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.925rem",
  letterSpacing: "0.2px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&.MuiButton-contained": {
    backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#F8F8F8" : "#111111",
      transform: "translateY(-2px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 4px 24px rgba(0, 0, 0, 0.2)"
          : "0 4px 24px rgba(0, 0, 0, 0.15)",
    },
  },
  "&.MuiButton-outlined": {
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(0, 0, 0, 0.15)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
      transform: "translateY(-2px)",
    },
  },
}));

const paintingStyles = [
  "Abstract",
  "Realism",
  "Impressionism",
  "Expressionism",
  "Minimalism",
  "Surrealism",
  "Pop Art",
  "Contemporary",
];

const paintingMaterials = [
  "Oil",
  "Acrylic",
  "Watercolor",
  "Charcoal",
  "Pencil",
  "Pastel",
  "Mixed Media",
  "Digital",
];

const StyledSelect = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(0, 0, 0, 0.02)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
    },
    "&.Mui-focused": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
      boxShadow: `0 0 0 2px ${
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.1)"
      }`,
    },
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

interface UploadPaintingDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: FormData) => Promise<void>;
}

const UploadPaintingDialog: React.FC<UploadPaintingDialogProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [style, setStyle] = useState("");
  const [material, setMaterial] = useState("");
  const [horizontalDepth, setHorizontalDepth] = useState("");
  const [verticalDepth, setVerticalDepth] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!selectedFile) {
      enqueueSnackbar("Please select an image to upload", { variant: "error" });
      return;
    }
    if (!title.trim()) {
      enqueueSnackbar("Title is required", { variant: "error" });
      return;
    }
    if (!description.trim()) {
      enqueueSnackbar("Description is required", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price ? parseFloat(price).toFixed(2) : "0.00");
    formData.append("year", year || "");
    formData.append("style", style || "");
    formData.append("material", material || "");
    formData.append(
      "horizontal_depth",
      horizontalDepth ? parseFloat(horizontalDepth).toFixed(2) : "0.00"
    );
    formData.append(
      "vertical_depth",
      verticalDepth ? parseFloat(verticalDepth).toFixed(2) : "0.00"
    );
    formData.append("image", selectedFile);

    // Log FormData contents for debugging
    console.log("Uploading painting with data:", {
      title: title.trim(),
      description: description.trim(),
      price: price ? parseFloat(price).toFixed(2) : "0.00",
      year: year || "",
      style: style || "",
      material: material || "",
      horizontal_depth: horizontalDepth
        ? parseFloat(horizontalDepth).toFixed(2)
        : "0.00",
      vertical_depth: verticalDepth
        ? parseFloat(verticalDepth).toFixed(2)
        : "0.00",
      image: selectedFile.name,
    });

    try {
      await onUpload(formData);
      handleClose();
    } catch (error: any) {
      console.error("Error uploading painting:", error);
      // Keep the dialog open on error
      // The error will be shown by the ProfilePage component
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setYear("");
    setStyle("");
    setMaterial("");
    setHorizontalDepth("");
    setVerticalDepth("");
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogHeader>
        <Box component="div">
          <Typography component="div" variant="h5" sx={{ fontWeight: 700 }}>
            Upload Your Painting
          </Typography>
        </Box>
        <CloseButton onClick={handleClose} size="small">
          <CloseIcon />
        </CloseButton>
      </DialogHeader>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          {previewUrl ? (
            <Box
              sx={{
                position: "relative",
                "&:hover .remove-preview": {
                  opacity: 1,
                },
              }}
            >
              <PreviewImage src={previewUrl} alt="Preview" />
              <IconButton
                className="remove-preview"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                  },
                }}
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <UploadArea
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 64, opacity: 0.5 }} />
              <Typography variant="h6" fontWeight={600}>
                Drag and drop your image here
              </Typography>
              <Typography variant="body1" color="text.secondary">
                or click to browse from your computer
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Supports: JPG, PNG, WEBP (Max 10MB)
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </UploadArea>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <StyledTextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ minHeight: 56 }}
          />
          <StyledTextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { minHeight: 120 } }}
          />

          <Box sx={{ display: "flex", gap: 3 }}>
            <StyledTextField
              label="Price"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: (
                  <StyledCoinIcon sx={{ mr: 1, color: "#FFFFFF" }} />
                ),
              }}
            />
            <StyledTextField
              label="Year"
              fullWidth
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <StyledSelect
              select
              label="Style"
              fullWidth
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {paintingStyles.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </StyledSelect>
            <StyledSelect
              select
              label="Material"
              fullWidth
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {paintingMaterials.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </StyledSelect>
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <StyledTextField
              label="Width (cm)"
              fullWidth
              type="number"
              value={horizontalDepth}
              onChange={(e) => setHorizontalDepth(e.target.value)}
            />
            <StyledTextField
              label="Height (cm)"
              fullWidth
              type="number"
              value={verticalDepth}
              onChange={(e) => setVerticalDepth(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <ActionButton variant="outlined" onClick={handleClose}>
          Cancel
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedFile || !title}
        >
          Upload Painting
        </ActionButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default UploadPaintingDialog;
