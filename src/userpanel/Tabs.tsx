import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faBookmark } from '@fortawesome/free-solid-svg-icons';

const CustomTab = (props: any) => (
  <Tab {...props} sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }} />
);

const ProfileTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'post' | 'saved'>('post');

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'post' | 'saved') => {
    setActiveTab(newValue);
  };

  return (
    <Box mb={2}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <CustomTab
          icon={<FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 4 }} />}
          label="Posts"
          value="post"
        />
        <CustomTab
          icon={<FontAwesomeIcon icon={faBookmark} style={{ marginRight: 4 }} />}
          label="Saved"
          value="saved"
        />
      </Tabs>
    </Box>
  );
};

export default ProfileTabs;
