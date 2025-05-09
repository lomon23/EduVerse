import React from 'react';

import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container 
      id="hero-section"
      maxWidth="lg" // Changed from "xl" to "lg"
      sx={{ 
        mt: 6,
        mb: 8,
        px: { xs: 2, sm: 3, md: 4 }, // Reduced padding
        backgroundColor: '#121212',
        borderRadius: 2,
        width: '90%' // Add width constraint
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        gap: { xs: 4, md: 12 } // Increased gap between text and image
      }}>
        {/* Text content */}
        <Box sx={{ 
          flex: '1',
          maxWidth: { md: '60%' } // Reduced from 50%
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
          }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5.5rem' },
                fontWeight: 600, // Reduced from 700
                lineHeight: 1.1,
                color: '#ffffff', // White text for dark background
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
                letterSpacing: '-0.05em'
              }}
            >
              More than just learning
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#cccccc', // Light grey for better readability
                lineHeight: 1.5,
                maxWidth: '90%',
                fontWeight: 300,
                fontSize: '1.5rem', // Increased from 1.3rem
                opacity: 0.85
              }}
            >
              Create, learn and grow with our interactive learning platform
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                width: 'fit-content',
                fontSize: '1.1rem',
                py: 1.5,
                px: 4,
                borderRadius: 2,
                backgroundColor: '#b5831a', // --button-bg
                color: '#eee', // --text-color
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#a57318', // --button-hover
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                }
              }}
            >
              Start for free
            </Button>
          </Box>
        </Box>

        {/* Single large image instead of three small ones */}
        <Box sx={{ 
          flex: '1',
          maxWidth: { md: '40%' }
        }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover',

            }}
          />
        </Box>

      </Box>

      {/* Large image */}
      <Box
        component="img"
        src="https://univerpl.com.ua/wp-content/uploads/2021/08/close-up-student-reading-book-min-scaled.jpeg"
        sx={{
          width: '100%',
          height: 'auto',
          minHeight: 400,
          objectFit: 'cover',
          borderRadius: 4,
          mt: 6
        }}
      />
    </Container>
  );
};

export default HeroSection;
