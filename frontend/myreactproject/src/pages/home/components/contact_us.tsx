import React from 'react';
import { Box, Container, Typography, TextField, Button, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const contactConfig = {
  email: {
    address: 'ostapkrochak22@gmail.com',
    label: 'Email us'
  },
  social: [
    {
      name: 'Telegram',
      icon: <TelegramIcon />,
      url: 'https://t.me/my_skatches',
      label: 'Join our Telegram Channel'
    },
    {
      name: 'GitHub',
      icon: <GitHubIcon />,
      url: 'https://github.com/lomon23',
      label: 'Report issues on GitHub'
    }
  ],
  legal: {
    companyName: 'LomonCompany',
    regNumber: '+380689801632',
    address: 'Sonyachna Street, 29',
    location: 'Zbyranka, Lviv, Ukraine, 79000'
  }
};

const ContactUs: React.FC = () => {
  return (
    <Box sx={{ py: 12, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 8
        }}>
          {/* Contact Form */}
          <Box>
            <Typography variant="h2" sx={{ mb: 8, fontWeight: 600, fontSize: { xs: '3rem', md: '4.5rem' }, color: '#fff' }}>
              Contact Us
            </Typography>
            
            <Box sx={{ 
              maxWidth: 600,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#b5831a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b5831a',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#b5831a'
                    }
                  }
                }}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#b5831a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b5831a',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#b5831a'
                    }
                  }
                }}
              />
              <TextField
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#b5831a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b5831a',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#b5831a'
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: '#b5831a',
                  '&:hover': {
                    backgroundColor: '#a57318',
                  }
                }}
              >
                Send Message
              </Button>
            </Box>
          </Box>

          {/* Alternative Contact Methods */}
          <Box sx={{ color: '#fff' }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#fff', fontWeight: 500 }}>
              Other Ways to Reach Us
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#b5831a' }} />
                <Typography>
                  {contactConfig.email.label}: <a href={`mailto:${contactConfig.email.address}`} 
                    style={{ color: '#b5831a', textDecoration: 'none' }}>
                    {contactConfig.email.address}
                  </a>
                </Typography>
              </Box>

              {contactConfig.social.map((social, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: '#b5831a' }}>{social.icon}</Box>
                  <Typography>
                    <a href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#b5831a', textDecoration: 'none' }}>
                      {social.label}
                    </a>
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                  Legal Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOnIcon sx={{ color: '#b5831a', mt: 0.5 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    {contactConfig.legal.companyName}<br />
                    Registration Number: {contactConfig.legal.regNumber}<br />
                    Address: {contactConfig.legal.address}<br />
                    {contactConfig.legal.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactUs;
