import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CreateIcon from '@mui/icons-material/Create';
import SchoolIcon from '@mui/icons-material/School';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const steps = [
  {
    icon: <HowToRegIcon sx={{ fontSize: 48 }} />,
    title: 'Register',
    description: 'Create your account in just a few clicks'
  },
  {
    icon: <CreateIcon sx={{ fontSize: 48 }} />,
    title: 'Create Courses',
    description: 'Design and build your own learning materials'
  },
  {
    icon: <DashboardCustomizeIcon sx={{ fontSize: 48 }} />,
    title: 'Interactive Board',
    description: 'Collaborate in real-time using our interactive whiteboard'
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 48 }} />,
    title: 'Learn & Teach',
    description: 'Study at your own pace or share your knowledge'
  }
];

const HowToWork: React.FC = () => {
  return (
    <Box sx={{ py: 16, backgroundColor: '121212' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            mb: 12,
            fontWeight: 600,
            fontSize: { xs: '3rem', md: '4.5rem' },
            color: '#111'
          }}
        >
          How it works
        </Typography>

        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 8, md: 6 },
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                position: 'relative',
                '&:not(:last-child)::after': {
                  content: '""',
                  position: 'absolute',
                  top: '24px',
                  right: '-50px',
                  width: '100px',
                  height: '2px',
                  backgroundColor: '#e0e0e0',
                  display: { xs: 'none', md: 'block' }
                }
              }}
            >
              <Box sx={{ 
                color: '#b5831a',
                mb: 3,
                p: 2,
                backgroundColor: 'rgba(181, 131, 26, 0.1)',
                borderRadius: '50%'
              }}>
                {step.icon}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '1.5rem',
                  color: '#111'
                }}
              >
                {step.title}
              </Typography>
              <Typography sx={{ color: '#666', maxWidth: '250px' }}>
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowToWork;
