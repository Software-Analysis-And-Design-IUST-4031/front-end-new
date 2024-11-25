import React, { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  styled,
  Badge,
  useTheme,
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { alpha } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ProfileTabsProps {
  postsCount: number;
  savedCount: number;
  onTabChange?: (index: number) => void;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
    backgroundColor: theme.palette.primary.main,
  },
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  minHeight: 48,
  marginRight: theme.spacing(4),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    },
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 0.8,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    marginRight: theme.spacing(1),
    transition: 'all 0.3s ease',
    color: theme.palette.text.secondary,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    minWidth: '20px',
    height: '20px',
    fontSize: '0.75rem',
  },
}));

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  postsCount = 0, 
  savedCount = 0,
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'blur(10px)',
      borderRadius: theme.shape.borderRadius,
      mb: 3,
    }}>
      <StyledTabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <StyledTab
          icon={<CollectionsIcon />}
          iconPosition="start"
          label={
            <StyledBadge badgeContent={postsCount} color="primary" showZero>
              <span>Posts</span>
            </StyledBadge>
          }
        />
        <StyledTab
          icon={<BookmarksIcon />}
          iconPosition="start"
          label={
            <StyledBadge badgeContent={savedCount} color="primary" showZero>
              <span>Saved</span>
            </StyledBadge>
          }
        />
      </StyledTabs>


      <TabPanel value={activeTab} index={0}>
   
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
      
      </TabPanel>
    </Box>
  );
};

// Tab Panel Component
const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default ProfileTabs;
