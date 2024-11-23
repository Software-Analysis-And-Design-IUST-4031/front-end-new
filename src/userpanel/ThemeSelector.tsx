import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  Typography,
  IconButton,
  styled,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface CustomTheme {
  bg: string;
  text: string;
}

interface ThemeOption {
  name: string;
  bg: string;
  text: string;
  category: string;
}

interface ThemeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (theme: CustomTheme) => void;
  currentTheme: CustomTheme;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
  },
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const ThemeBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    '& .reverse-button': {
      opacity: 1,
    },
  },
}));

const ReverseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.2s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  padding: theme.spacing(0.5),
}));

const ColorPreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 100,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
}));

const themes: ThemeOption[] = [
  { name: 'Default Light', bg: '#F7F8FA', text: '#333333', category: 'modern' },
  { name: 'VS Code Dark', bg: '#1F1F1F', text: '#FFFFFF', category: 'modern' },
  { name: 'Soft Dark', bg: '#252526', text: '#FFFFFF', category: 'modern' },
  { name: 'Midnight Blue', bg: '#1E1E2E', text: '#FFFFFF', category: 'cool' },
  { name: 'Ocean Blue', bg: '#E3F2FD', text: '#1565C0', category: 'cool' },
  { name: 'Forest Green', bg: '#E8F5E9', text: '#2E7D32', category: 'natural' },
  { name: 'Sunset Orange', bg: '#FBE9E7', text: '#D84315', category: 'warm' },
  { name: 'Royal Purple', bg: '#EDE7F6', text: '#4527A0', category: 'special' },
  { name: 'Desert Sand', bg: '#FFF3E0', text: '#EF6C00', category: 'warm' },
  { name: 'Mint Green', bg: '#E0F2F1', text: '#00695C', category: 'natural' },
  { name: 'Rose Pink', bg: '#FCE4EC', text: '#C2185B', category: 'warm' },
  { name: 'Dark Matter', bg: '#21252B', text: '#FFFFFF', category: 'modern' },
  { name: 'Monokai Dark', bg: '#272822', text: '#FFFFFF', category: 'modern' },
  { name: 'Lavender', bg: '#F3E5F5', text: '#6A1B9A', category: 'special' },
  { name: 'Coral Red', bg: '#FFEBEE', text: '#C62828', category: 'warm' },
  { name: 'Teal', bg: '#E0F2F1', text: '#00796B', category: 'cool' },
  { name: 'Charcoal', bg: '#263238', text: '#ECEFF1', category: 'modern' },
  { name: 'Champagne Pink & Cool Gray', bg: '#F7E7CE', text: '#8C92AC', category: 'modern' },
  { name: 'Pearl & Fire Break', bg: '#E8E0D5', text: '#B22222', category: 'natural' },
  { name: 'Chinese Violet & Mimi Pink', bg: '#856088', text: '#FFE4E1', category: 'special' },
  { name: 'Misty Rose & Old Gold', bg: '#FFE4E1', text: '#CFB53B', category: 'warm' },
  { name: 'Mindaro & Tropical Indigo', bg: 'var(--mindaro)', text: 'var(--TropicalIndigo)', category: 'special' },
  { name: 'Castleton Green & Fairy Tale', bg: 'var(--CastletonGreen)', text: 'var(--FairyTale)', category: 'natural' },
  { name: 'Uranian Blue & Salmon', bg: 'var(--UranianBlue)', text: 'var(--Salmon)', category: 'cool' },
  { name: 'Savoy Blue & Saffron', bg: 'var(--SavoyBlue)', text: 'var(--Saffron)', category: 'special' },
  { name: 'Alabaster & Moss Green', bg: 'var(--Alabaster)', text: 'var(--MossGreen)', category: 'natural' },
  { name: 'Chestnut & Sunset', bg: 'var(--Chestnut)', text: 'var(--Sunset)', category: 'warm' },
  { name: 'Feldgrau & Tea Green', bg: 'var(--Feldgrau)', text: 'var(--TeaGreen)', category: 'natural' },
  { name: 'Beige & Verdigris', bg: 'var(--Beige)', text: 'var(--Verdigris)', category: 'natural' },
  { name: 'Charcoal & Melon', bg: 'var(--Charcoal)', text: 'var(--Melon)', category: 'modern' },
  { name: 'Timberwolf & Copper', bg: 'var(--Temberwolf)', text: 'var(--Copper)', category: 'warm' },
  { name: 'Wenge & Dun', bg: 'var(--Wenge)', text: 'var(--Dun)', category: 'warm' },
  { name: 'Midnight Green & Celadon', bg: 'var(--MidnightGreen)', text: 'var(--Celadon)', category: 'natural' },
  { name: 'Rose Quartz & Seashell', bg: 'var(--RoseQuartz)', text: 'var(--Seashell)', category: 'warm' },
  { name: 'Champagne Pink & Burnt Sienna', bg: 'var(--ChampagnePink)', text: 'var(--BurntSienna)', category: 'warm' },
  { name: 'Amaranth Purple & Dutch White', bg: 'var(--AmaranthPurple)', text: 'var(--DutchWhite)', category: 'special' }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ open, onClose, onSelect, currentTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleThemeClick = (theme: ThemeOption) => {
    onSelect({ bg: theme.bg, text: theme.text });
  };

  const handleReverseTheme = (event: React.MouseEvent, theme: ThemeOption) => {
    event.stopPropagation();
    onSelect({ bg: theme.text, text: theme.bg });
  };

  const categories = ['all', ...new Set(themes.map(t => t.category))];

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogHeader>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <DialogTitle sx={{ p: 0, fontSize: '1.5rem', fontWeight: 600 }}>
              Choose Theme
            </DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton 
                onClick={onClose}
                sx={{ 
                  '&:hover': { 
                    transform: 'rotate(90deg)',
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Tabs
            value={selectedCategory}
            onChange={(_, value) => setSelectedCategory(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            {categories.map(category => (
              <Tab 
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                value={category}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 500,
                }}
              />
            ))}
          </Tabs>
        </Box>
      </DialogHeader>

      <DialogContent sx={{ p: 0 }}>
        <Grid container spacing={2}>
          {filteredThemes.map((theme, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ThemeBox 
                onClick={() => handleThemeClick(theme)}
                sx={{
                  cursor: 'pointer',
                  border: currentTheme && currentTheme.bg === theme.bg ? '2px solid #2196F3' : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <ColorPreview sx={{ 
                  backgroundColor: theme.bg,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: theme.text,
                      fontWeight: 500,
                      textAlign: 'center',
                      px: 2,
                    }}
                  >
                    Preview Text
                  </Typography>
                </ColorPreview>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {theme.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    textAlign: 'center',
                    display: 'block',
                    color: 'text.secondary',
                  }}
                >
                  {theme.category}
                </Typography>
                <ReverseButton
                  className="reverse-button"
                  size="small"
                  onClick={(e) => handleReverseTheme(e, theme)}
                  title="Reverse colors"
                >
                  <SwapHorizIcon fontSize="small" />
                </ReverseButton>
              </ThemeBox>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
};

export default ThemeSelector;