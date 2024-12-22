import React, { useState } from 'react';
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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { userService } from '../../services/userService';
import LikeButton from './LikeCounter';
interface Painting {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface PaintingGridProps {
  paintings: Painting[];
  onAction: (actionType: string, paintingId: string) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 24px rgba(0,0,0,0.4)'
      : '0 8px 24px rgba(0,0,0,0.1)',
    '& .overlay': {
      opacity: 1,
    },
    '& img': {
      transform: 'scale(1.05)',
    },
  },
}));

const ImageContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const PaintingImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
});

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)'
    : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.1)',
  },
  '&.liked': {
    color: theme.palette.error.main,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  '&.saved': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
}));

const PaintingTitle = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontWeight: 600,
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  marginBottom: theme.spacing(1),
}));

const PaintingPrice = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontWeight: 500,
  opacity: 0.9,
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  transform: 'translateY(20px)',
  opacity: 0,
  transition: 'all 0.3s ease',
  '.overlay:hover &': {
    transform: 'translateY(0)',
    opacity: 1,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
    overflow: 'hidden',
  },
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.mode === 'dark' ? '#242424' : '#F8F8F8',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
}));

const DeleteDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    padding: theme.spacing(3),
    minWidth: '400px',
    backdropFilter: 'blur(10px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.6)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.9)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(6px)',
  },
}));

const DeleteDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  fontSize: '1.75rem',
  fontWeight: 700,
  textAlign: 'center',
  paddingBottom: theme.spacing(1.5),
  marginBottom: theme.spacing(2)
}));

const DeleteDialogContent = styled(DialogContent)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
  textAlign: 'center',
  padding: theme.spacing(4, 3),
  fontSize: '1.1rem',
  lineHeight: 1.6,
}));

const DeleteDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3, 3),
}));

const DialogButton = styled(Button)(({ theme }) => ({
  minWidth: '130px',
  height: '48px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 3,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:active': {
    transform: 'scale(0.96)',
  },
}));

const NoButton = styled(DialogButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  backgroundColor: 'transparent',
  border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 5px 15px rgba(255,255,255,0.1)'
      : '0 5px 15px rgba(0,0,0,0.1)',
  },
}));

const YesButton = styled(DialogButton)(({ theme }) => ({
  color: '#FFFFFF',
  backgroundColor: theme.palette.error.main,
  border: `2px solid ${theme.palette.error.main}`,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    border: `2px solid ${theme.palette.error.dark}`,
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(255,59,48,0.3)',
  },
}));

const WarningIcon = styled('div')(({ theme }) => ({
  width: '64px',
  height: '64px',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,59,48,0.15)' : 'rgba(255,59,48,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${theme.palette.error.main}`,
  '& svg': {
    fontSize: '32px',
    color: theme.palette.error.main,
  },
}));

const PaintingGrid: React.FC<PaintingGridProps> = ({ paintings, onAction }) => {
  const theme = useTheme();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<Painting | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (paintingId: string) => {
    setImageErrors(prev => ({ ...prev, [paintingId]: true }));
  };

  const getImageUrl = (painting: Painting) => {
    if (imageErrors[painting.id]) {
      return 'https://via.placeholder.com/400x400?text=Image+Not+Available';
    }
    return painting.imageUrl;
  };

  const handleActionClick = (e: React.MouseEvent, action: string, paintingId: string) => {
    e.stopPropagation();
    if (action === 'delete') {
      const paintingToDelete = paintings.find(p => p.id === paintingId);
      if (paintingToDelete) {
        setDeleteConfirmation(paintingToDelete);
      }
    } else {
      onAction(action, paintingId);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      onAction('delete', deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {paintings.map((painting) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={painting.id}>
            <StyledPaper onClick={() => setSelectedPainting(painting)}>
              <ImageContainer>
                <PaintingImage 
                  src={getImageUrl(painting)} 
                  alt={painting.title}
                  onError={() => handleImageError(painting.id)}
                />
                <Overlay className="overlay">
                  <Box>
                    <PaintingTitle variant="h6">
                      {painting.title}
                    </PaintingTitle>
                    <PaintingPrice variant="subtitle1">
                      ${painting.price}
                    </PaintingPrice>
                  </Box>
                  <ActionButtonsContainer>
                    <Tooltip title={painting.isLiked ? "Unlike" : "Like"}>
                      <ActionButton
                        className={painting.isLiked ? 'liked' : ''}
                        onClick={(e) => handleActionClick(e, 'like', painting.id)}
                        size="small"
                      >
                        {/* {painting.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />} */}
                        <LikeButton paintingId={parseInt(painting.id)} />
                        {/* <LikeCounter paintingId={parseInt(painting.id)}/> */}
                        {/* {parseInt(painting.id)} */}

                      </ActionButton>
                    </Tooltip>
                    <Tooltip title={painting.isSaved ? "Unsave" : "Save"}>
                      <ActionButton
                        className={painting.isSaved ? 'saved' : ''}
                        onClick={(e) => handleActionClick(e, 'save', painting.id)}
                        size="small"
                      >
                        {painting.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </ActionButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <ActionButton
                        onClick={(e) => handleActionClick(e, 'share', painting.id)}
                        size="small"
                      >
                        <ShareIcon />
                      </ActionButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <ActionButton
                        onClick={(e) => handleActionClick(e, 'delete', painting.id)}
                        size="small"
                      >
                        <DeleteOutlineIcon />
                      </ActionButton>
                    </Tooltip>
                  </ActionButtonsContainer>
                </Overlay>
              </ImageContainer>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>

      <StyledDialog
        open={!!selectedPainting}
        onClose={() => setSelectedPainting(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPainting && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedPainting.title}</Typography>
                <Typography variant="h6">${selectedPainting.price}</Typography>
                <CloseButton onClick={() => setSelectedPainting(null)}>
                  <CloseIcon />
                </CloseButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ width: '100%', paddingTop: '75%', position: 'relative', mb: 2 }}>
                <Box
                  component="img"
                  src={getImageUrl(selectedPainting)}
                  alt={selectedPainting.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Typography variant="body1">{selectedPainting.description}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPainting(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>

      <DeleteDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        aria-labelledby="delete-dialog-title"
      >
        <DeleteDialogTitle id="delete-dialog-title">
          Delete Painting
        </DeleteDialogTitle>
        <DeleteDialogContent>
          <WarningIcon>
            <DeleteOutlineIcon />
          </WarningIcon>
          Are you sure you want to delete
          <Box component="span" sx={{ 
            display: 'block', 
            fontWeight: 700,
            fontSize: '1.2rem',
            color: theme => theme.palette.mode === 'dark' ? '#fff' : '#000',
            my: 1.5 
          }}>
            "{deleteConfirmation?.title}"
          </Box>
          This action cannot be undone.
        </DeleteDialogContent>
        <DeleteDialogActions>
          <NoButton 
            onClick={() => setDeleteConfirmation(null)}
            variant="outlined"
          >
            No
          </NoButton>
          <YesButton 
            onClick={handleConfirmDelete}
            variant="contained"
          >
            Yes
          </YesButton>
        </DeleteDialogActions>
      </DeleteDialog>
    </>
  );
};

export default PaintingGrid;
