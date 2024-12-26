import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  styled,
  useTheme,
  CircularProgress,
  Grid,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StraightenIcon from '@mui/icons-material/Straighten';
import StyleIcon from '@mui/icons-material/Style';
import BrushIcon from '@mui/icons-material/Brush';
import EventIcon from '@mui/icons-material/Event';

interface UploadPaintingDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: FormData) => Promise<void>;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#F5F5F5',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  padding: theme.spacing(3),
}));

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  borderRadius: 16,
  padding: theme.spacing(6),
  minHeight: 300,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
}));

const PreviewBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '75%',
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
}));

const PreviewImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: '10px 24px',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.2s ease-in-out',
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'}`,
    outlineOffset: 2,
  },
}));

const CancelButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
}));

const SubmitButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#FFFFFF',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#3A3A3A' : '#F5F5F5',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  },
}));

const paintingStyles = [
  'Abstract', 'Realism', 'Impressionism', 'Expressionism', 
  'Minimalism', 'Surrealism', 'Pop Art', 'Contemporary'
];

const paintingMaterials = [
  'Oil', 'Acrylic', 'Watercolor', 'Charcoal', 
  'Pencil', 'Pastel', 'Mixed Media', 'Digital'
];

const UploadPaintingDialog: React.FC<UploadPaintingDialogProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [style, setStyle] = useState('');
  const [material, setMaterial] = useState('');
  const [horizontalDepth, setHorizontalDepth] = useState('');
  const [verticalDepth, setVerticalDepth] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(''); // Clear any previous errors
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type. Please upload a JPEG, PNG, or GIF file.`);
        return;
      }


      if (file.size > 5242880) {
        setError('File is too large. Maximum size is 5MB.');
        return;
      }
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, [preview]);

  // Clean up preview URL when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: false,
    maxSize: 5242880, // 5MB
    noClick: false, // Enable click to open file dialog
    noKeyboard: false, // Enable keyboard navigation
  });

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview('');
  };

  const handleSubmit = async () => {
    if (!file || !title) {
      setError('Please provide both an image and a title');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      if (description) formData.append('description', description);
      if (price) formData.append('price', price.toString());
      if (year) formData.append('year', year.toString());
      if (style) formData.append('style', style);
      if (material) formData.append('material', material);
      if (horizontalDepth) formData.append('horizontal_depth', horizontalDepth.toString());
      if (verticalDepth) formData.append('vertical_depth', verticalDepth.toString());

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(name=${value.name}, type=${value.type}, size=${value.size})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      await onUpload(formData);
      handleClose();
    } catch (error: any) {
      console.error('Upload failed:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.message || 'Failed to upload painting. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview('');
    setTitle('');
    setDescription('');
    setPrice('');
    setYear('');
    setStyle('');
    setMaterial('');
    setHorizontalDepth('');
    setVerticalDepth('');
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogHeader>
        <Typography component="div" variant="h5" fontWeight="600" color="text.primary">
          Upload New Painting
        </Typography>
      </DialogHeader>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form id="painting-upload-form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {!preview ? (
                <DropzoneBox {...getRootProps()}>
                  <input {...getInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to select a file
                  </Typography>
                </DropzoneBox>
              ) : (
                <PreviewBox>
                  <PreviewImage src={preview} alt="Painting preview" />
                  <DeleteButton
                    onClick={handleRemoveImage}
                    aria-label="Remove uploaded image"
                  >
                    <DeleteOutlineIcon />
                  </DeleteButton>
                </PreviewBox>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="painting-title">Title</InputLabel>
                    <OutlinedInput
                      id="painting-title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      label="Title"
                      aria-required="true"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="painting-description">Description</InputLabel>
                    <OutlinedInput
                      id="painting-description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      label="Description"
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="painting-price">Price</InputLabel>
                    <OutlinedInput
                      id="painting-price"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      label="Price"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="painting-year">Year</InputLabel>
                    <OutlinedInput
                      id="painting-year"
                      name="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">
                          <EventIcon />
                        </InputAdornment>
                      }
                      label="Year"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="painting-style-label">Style</InputLabel>
                    <Select
                      labelId="painting-style-label"
                      id="painting-style"
                      name="style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      input={
                        <OutlinedInput
                          id="painting-style-input"
                          name="style-input"
                          label="Style"
                        />
                      }
                      startAdornment={
                        <InputAdornment position="start">
                          <StyleIcon />
                        </InputAdornment>
                      }
                    >
                      {paintingStyles.map((style) => (
                        <MenuItem key={style} value={style}>{style}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="painting-material-label">Material</InputLabel>
                    <Select
                      labelId="painting-material-label"
                      id="painting-material"
                      name="material"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      input={
                        <OutlinedInput
                          id="painting-material-input"
                          name="material-input"
                          label="Material"
                        />
                      }
                      startAdornment={
                        <InputAdornment position="start">
                          <BrushIcon />
                        </InputAdornment>
                      }
                    >
                      {paintingMaterials.map((material) => (
                        <MenuItem key={material} value={material}>{material}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="painting-horizontal-length">
                      Horizontal Length (cm)
                    </InputLabel>
                    <OutlinedInput
                      id="painting-horizontal-length"
                      name="horizontal_length"
                      value={horizontalDepth}
                      onChange={(e) => setHorizontalDepth(e.target.value)}
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">
                          <StraightenIcon />
                        </InputAdornment>
                      }
                      label="Horizontal Length (cm)"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="painting-vertical-length">
                      Vertical Length (cm)
                    </InputLabel>
                    <OutlinedInput
                      id="painting-vertical-length"
                      name="vertical_length"
                      value={verticalDepth}
                      onChange={(e) => setVerticalDepth(e.target.value)}
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">
                          <StraightenIcon />
                        </InputAdornment>
                      }
                      label="Vertical Length (cm)"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <CancelButton
          onClick={handleClose}
          tabIndex={0}
          aria-label="Cancel upload"
        >
          Cancel
        </CancelButton>
        <SubmitButton
          onClick={handleSubmit}
          disabled={!file || !title || uploading}
          tabIndex={0}
          aria-label="Upload painting"
          startIcon={uploading ? <CircularProgress size={20} /> : undefined}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </SubmitButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default UploadPaintingDialog;
