import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const advantages = [
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Expert-Led Courses',
    description: 'Learn from industry professionals and experienced instructors'
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    title: 'Interactive Learning',
    description: 'Engage with peers and mentors in real-time collaborative sessions'
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    title: 'Learn Anywhere',
    description: 'Access your courses on any device, anytime, anywhere'
  },
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />,
    title: 'Verified Certificates',
    description: 'Earn recognized certificates upon course completion'
  }
];

const Advantages: React.FC = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            mb: 6,
            fontWeight: 600,
            fontSize: { xs: '3rem', md: '4.5rem' },
            color: '#111',
            maxWidth: '600px' // Limit text width
          }}
        >
          Why Choose Us
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {advantages.map((advantage, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
                maxWidth: '800px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateX(8px)'
                }
              }}
            >
              <Box sx={{ color: '#b5831a', pt: 1 }}>
                {advantage.icon}
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: '#111'
                  }}
                >
                  {advantage.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    fontSize: '1.1rem'
                  }}
                >
                  {advantage.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Advantages;
