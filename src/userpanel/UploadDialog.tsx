import React, { useState, useRef } from 'react';
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
  CircularProgress,
  Fade,
  LinearProgress,
  InputAdornment,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string, caption: string, metadata: { title: string; price: string; createdAt: string }) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)'
      : 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
    color: 'inherit'
  },
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  color: 'inherit'
}));

const DropZone = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  position: 'relative',
  minHeight: '250px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '250px',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PreviewOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 1,
  },
}));

const UploadProgress = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
  color: '#fff',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)',
    },
  },
}));

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      setError('');
      setIsLoading(true);
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        setIsLoading(true);
        setUploadProgress(0);
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
        setUploadProgress(0);
      };

      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Ensure we have a valid base64 image string
        if (base64String && base64String.startsWith('data:image/')) {
          setPreviewUrl(base64String);
          setIsLoading(false);
          setUploadProgress(100);
        } else {
          setError('Invalid image format');
          setIsLoading(false);
          setUploadProgress(0);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUploadClick = () => {
    if (previewUrl && caption && title && price) {
      const createdAt = new Date().toISOString();
      onUpload(previewUrl, caption, { title, price, createdAt });
      handleReset();
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setTitle('');
    setPrice('');
    setCaption('');
    setError('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogHeader>
        <DialogTitle sx={{ p: 0, fontSize: '1.5rem', fontWeight: 600, color: 'inherit' }}>
          Create New Post
        </DialogTitle>
        <IconButton 
          onClick={onClose}
          sx={{ 
            '&:hover': { 
              transform: 'rotate(90deg)',
              backgroundColor: 'rgba(0,0,0,0.04)'
            },
            transition: 'all 0.3s ease',
            color: 'inherit'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>

      <DialogContent sx={{ p: 0 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
          ref={fileInputRef}
          id="upload-image"
        />

        {!previewUrl ? (
          <label htmlFor="upload-image" style={{ width: '100%', display: 'block' }}>
            <DropZone
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Fade in={true}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%'
                  }}>
                    <ImageIcon sx={{ fontSize: 64, color: 'inherit', opacity: 0.7, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'inherit', opacity: 0.8 }} gutterBottom>
                      Drop your image here
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 4,
                        py: 1,
                        minWidth: '200px',
                        color: 'inherit',
                        borderColor: 'currentColor'
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select from computer
                    </Button>
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'inherit', opacity: 0.7 }}>
                      Supports: JPG, PNG (max 5MB)
                    </Typography>
                  </Box>
                </Fade>
              )}
            </DropZone>
          </label>
        ) : (
          <Box sx={{ mb: 3 }}>
            <PreviewContainer>
              <PreviewImage src={previewUrl} alt="Preview" />
              <PreviewOverlay>
                <IconButton
                  onClick={handleReset}
                  sx={{ 
                    color: '#fff',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </PreviewOverlay>
              {uploadProgress < 100 && (
                <UploadProgress>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: '#fff',
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="white">
                    {uploadProgress}%
                  </Typography>
                </UploadProgress>
              )}
            </PreviewContainer>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                placeholder="Enter a title for your post"
                required
              />
              <StyledTextField
                fullWidth
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                variant="outlined"
                placeholder="Enter the price"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
              <StyledTextField
                fullWidth
                label="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                variant="outlined"
                placeholder="Write a caption..."
                multiline
                rows={3}
                required
              />
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUploadClick}
                disabled={!previewUrl || !caption || !title || !price}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Share Post
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default UploadDialog;