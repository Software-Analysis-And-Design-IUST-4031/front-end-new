import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';

const themes = [
  { name: 'Default Theme', bg: '#FFFFFF', text: '#000000' },
  { name: 'Mindaro & Tropical Indigo', bg: 'var(--mindaro)', text: 'var(--TropicalIndigo)' },
  { name: 'Castleton Green & Fairy Tale', bg: 'var(--CastletonGreen)', text: 'var(--FairyTale)' },
  { name: 'Uranian Blue & Salmon', bg: 'var(--UranianBlue)', text: 'var(--Salmon)' },
  { name: 'Savoy Blue & Saffron', bg: 'var(--SavoyBlue)', text: 'var(--Saffron)' },
  { name: 'Alabaster & Moss Green', bg: 'var(--Alabaster)', text: 'var(--MossGreen)' },
  { name: 'Chestnut & Sunset', bg: 'var(--Chestnut)', text: 'var(--Sunset)' },
  { name: 'Feldgrau & Tea Green', bg: 'var(--Feldgrau)', text: 'var(--TeaGreen)' },
  { name: 'Beige & Verdigris', bg: 'var(--Beige)', text: 'var(--Verdigris)' },
  { name: 'Charcoal & Melon', bg: 'var(--Charcoal)', text: 'var(--Melon)' },
  { name: 'Timberwolf & Copper', bg: 'var(--Temberwolf)', text: 'var(--Copper)' },
  { name: 'Wenge & Dun', bg: 'var(--Wenge)', text: 'var(--Dun)' },
  { name: 'Midnight Green & Celadon', bg: 'var(--MidnightGreen)', text: 'var(--Celadon)' },
  { name: 'Rose Quartz & Seashell', bg: 'var(--RoseQuartz)', text: 'var(--Seashell)' },
  { name: 'Champagne Pink & Burnt Sienna', bg: 'var(--ChampagnePink)', text: 'var(--BurntSienna)' },
  { name: 'Amaranth Purple & Dutch White', bg: 'var(--AmaranthPurple)', text: 'var(--DutchWhite)' },
];


interface Theme {
  bg: string;
  text: string;
}

interface ThemeSelectorProps {
  onSelectTheme: (theme: Theme) => void;
  currentTheme: Theme;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelectTheme, currentTheme }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [reverted, setReverted] = useState(false);

  const openPicker = () => setIsPickerOpen(true);
  const closePicker = () => setIsPickerOpen(false);

  const handleThemeSelect = (theme: Theme) => {
    const finalTheme = reverted ? { bg: theme.text, text: theme.bg } : theme;
    onSelectTheme(finalTheme);
    closePicker();
  };

  const toggleRevert = () => setReverted((prev) => !prev);

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <Button
          variant="contained"
          onClick={openPicker}
          style={{
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.text}`,
          }}
        >
          Choose Theme
        </Button>
        <Button variant="contained" color="secondary" onClick={() => localStorage.clear()}>
        Clear Local Storage
        </Button>

      </Box>

      <Dialog open={isPickerOpen} onClose={closePicker}>
        <DialogTitle>Choose a Theme</DialogTitle>
        <DialogContent>
          <List>
            {themes.map((theme, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleThemeSelect(theme)}
                  style={{
                    backgroundColor: reverted ? theme.text : theme.bg,
                    color: reverted ? theme.bg : theme.text,
                    borderRadius: '5px',
                    marginBottom: '8px',
                  }}
                >
                  <ListItemText
                    primary={theme.name}
                    secondary={`BG: ${reverted ? theme.text : theme.bg}, Text: ${reverted ? theme.bg : theme.text}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleRevert} color="secondary">
            {reverted ? 'Unrevert Theme' : 'Revert Theme'}
          </Button>
          <Button onClick={closePicker} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ThemeSelector;