import React from 'react';
import { Box } from '@mui/material';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#121212', // Dark background for the entire page
      '& > *': {
        position: 'relative', // Make sure content is above background
      }
    }}>
      {children}
    </Box>
  );
};

export default HomeLayout;
