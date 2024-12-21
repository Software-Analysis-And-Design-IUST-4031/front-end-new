import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Paper,
  styled,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';
import CheckIcon from '@mui/icons-material/Check';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface ThemeCustomizerProps {
  open: boolean;
  onClose: () => void;
  onThemeChange: (theme: any) => void;
}

const ThemePreview = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 120,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 16px rgba(0,0,0,0.4)'
      : '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const ColorBox = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  open,
  onClose,
  onThemeChange,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState({
    background: '#ffffff',
    text: '#000000',
  });
  const [colorPickerOpen, setColorPickerOpen] = useState<'background' | 'text' | null>(null);

  // These will be replaced with actual theme data from the backend
  const presetThemes = {
    modern: [
      { name: 'Clean White', background: '#ffffff', text: '#000000' },
      { name: 'Dark Elegance', background: '#1a1a1a', text: '#ffffff' },
    ],
    cool: [
      { name: 'Ocean Blue', background: '#e8f4f8', text: '#2c3e50' },
      { name: 'Arctic Mint', background: '#f0f8f4', text: '#2d4a3e' },
    ],
    warm: [
      { name: 'Desert Sand', background: '#f8f2e8', text: '#4a3c2d' },
      { name: 'Sunset Rose', background: '#f8e8e8', text: '#4a2d2d' },
    ],
  };

  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset.name);
    setCustomColors({
      background: preset.background,
      text: preset.text,
    });
    onThemeChange({
      type: 'preset',
      name: preset.name,
      colors: {
        background: preset.background,
        text: preset.text,
      },
    });
  };

  const handleCustomColorChange = (color: ColorResult, type: 'background' | 'text') => {
    setCustomColors(prev => ({
      ...prev,
      [type]: color.hex,
    }));
    setSelectedPreset(null);
  };

  const handleSwapColors = () => {
    setCustomColors(prev => ({
      background: prev.text,
      text: prev.background,
    }));
  };

  const handleApplyCustom = () => {
    onThemeChange({
      type: 'custom',
      colors: customColors,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5">Customize Your Theme</Typography>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Preset Themes" />
          <Tab label="Custom Theme" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {Object.entries(presetThemes).map(([category, themes]) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
                  {category} Themes
                </Typography>
                <Grid container spacing={2}>
                  {themes.map((presetTheme) => (
                    <Grid item xs={12} sm={6} md={4} key={presetTheme.name}>
                      <ThemePreview
                        onClick={() => handlePresetSelect(presetTheme)}
                        sx={{
                          backgroundColor: presetTheme.background,
                          color: presetTheme.text,
                          border: selectedPreset === presetTheme.name
                            ? `2px solid ${theme.palette.primary.main}`
                            : 'none',
                        }}
                      >
                        <Typography variant="subtitle1">{presetTheme.name}</Typography>
                        <Typography variant="body2">Sample Text</Typography>
                      </ThemePreview>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Background Color
                </Typography>
                <ColorBox
                  sx={{
                    backgroundColor: customColors.background,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  onClick={() => setColorPickerOpen('background')}
                />
              </Box>

              <Tooltip title="Swap Colors">
                <IconButton onClick={handleSwapColors}>
                  <SwapHorizIcon />
                </IconButton>
              </Tooltip>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Text Color
                </Typography>
                <ColorBox
                  sx={{
                    backgroundColor: customColors.text,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  onClick={() => setColorPickerOpen('text')}
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>Preview</Typography>
            <ThemePreview
              sx={{
                backgroundColor: customColors.background,
                color: customColors.text,
              }}
            >
              <Typography variant="subtitle1">Custom Theme</Typography>
              <Typography variant="body2">
                This is how your theme will look like. Sample text to show the contrast.
              </Typography>
            </ThemePreview>

            {colorPickerOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={() => setColorPickerOpen(null)}
                />
                <ChromePicker
                  color={customColors[colorPickerOpen]}
                  onChange={(color) => handleCustomColorChange(color, colorPickerOpen)}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={activeTab === 0 ? onClose : handleApplyCustom}
          startIcon={<CheckIcon />}
        >
          Apply Theme
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemeCustomizer;
