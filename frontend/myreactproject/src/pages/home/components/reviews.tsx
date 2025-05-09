import React from 'react';
import { Box, Container, Typography, Avatar } from '@mui/material';
// Import local image
import ostapPhoto from '../photo/ostapKrochak.png';
import DanyloPhoto from '../photo/DabyloChubatyuk.png'

const reviews = [
  {
    name: 'Ostap Krochak',
    role: 'Developert',
    avatar: ostapPhoto, // Use imported image
    text: 'The platform helped me improve my skills significantly. The community is supportive and knowledgeable.',
  },
  {
    name: 'Danylo Chubatyuk',
    role: 'Student',
    avatar: DanyloPhoto,
    text: 'а я просто даун',
  },
  {
    name: 'Maksym Koshla',
    role: 'Teacher',
    avatar: 'https://i.pravatar.cc/150?img=3',
    text: 'As an educator, I find this platform incredibly useful. The tools provided make creating courses a breeze.',
  },
];

const Reviews: React.FC = () => {
  return (
    <Box sx={{ py: 12, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            mb: 10,
            fontWeight: 600,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#fff',
            maxWidth: '600px'
          }}
        >
          What Our Users Say
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 5,
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto'
        }}>
          {reviews.map((review, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 4,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(181, 131, 26, 0.5), transparent)'
                }
              }}
            >
              <Avatar
                src={review.avatar}
                sx={{ 
                  width: 64, 
                  height: 64,
                  mb: 2,
                  border: '2px solid rgba(181, 131, 26, 0.3)'
                }}
              />
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: '1.1rem',
                  mb: 1,
                  fontWeight: 500
                }}
              >
                {review.name}
              </Typography>
              <Typography
                sx={{
                  color: '#b5831a',
                  fontSize: '0.875rem',
                  mb: 3
                }}
              >
                {review.role}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}
              >
                {review.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Reviews;
