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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
  paddingTop: '100%', // 1:1 Aspect ratio
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0,0,0,0.3)'
    : '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 24px rgba(0,0,0,0.4)'
      : '0 12px 24px rgba(0,0,0,0.15)',
    '& .overlay': {
      opacity: 1,
    },
  },
}));

const ImageContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#f0f0f0',
});

const PaintingImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  '&.liked': {
    color: theme.palette.error.main,
  },
  '&.saved': {
    color: theme.palette.primary.main,
  },
}));

const PaintingGrid: React.FC<PaintingGridProps> = ({ paintings, onAction }) => {
  const theme = useTheme();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);

  const handleActionClick = (e: React.MouseEvent, action: string, paintingId: string) => {
    e.stopPropagation();
    onAction(action, paintingId);
  };

  return (
    <>
      <Grid container spacing={3}>
        {paintings.map((painting) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={painting.id}>
            <StyledPaper onClick={() => setSelectedPainting(painting)}>
              <ImageContainer>
                <PaintingImage src={painting.imageUrl} alt={painting.title} />
                <Overlay className="overlay">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" color="white">
                      {painting.title}
                    </Typography>
                    <Typography variant="subtitle1" color="white">
                      ${painting.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={painting.isLiked ? "Unlike" : "Like"}>
                      <ActionButton
                        className={painting.isLiked ? 'liked' : ''}
                        onClick={(e) => handleActionClick(e, 'like', painting.id)}
                        size="small"
                      >
                        {painting.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
                  </Box>
                </Overlay>
              </ImageContainer>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>

      <Dialog
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
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ width: '100%', paddingTop: '75%', position: 'relative', mb: 2 }}>
                <Box
                  component="img"
                  src={selectedPainting.imageUrl}
                  alt={selectedPainting.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
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
      </Dialog>
    </>
  );
};

export default PaintingGrid;
