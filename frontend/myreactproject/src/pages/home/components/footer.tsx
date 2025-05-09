import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Apps', href: '/apps' },
  { name: 'Platform API', href: '/api' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' }
];

const socialLinks = [
  { icon: <TelegramIcon />, href: 'https://t.me/learningplatform', label: 'Telegram' },
  { icon: <GitHubIcon />, href: 'https://github.com/learningplatform', label: 'GitHub' },
  { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/learningplatform', label: 'LinkedIn' }
];

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0a0a0a',
        color: '#fff',
        py: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center">
          {/* Links */}
          <Stack
            direction="row"
            spacing={3}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ '& > *': { px: 1 } }}
          >
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': {
                    color: '#b5831a'
                  }
                }}
              >
                {link.name}
              </Link>
            ))}
          </Stack>

          {/* Social Icons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              '& svg': {
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#b5831a'
                }
              }
            }}
          >
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex' }}
              >
                {social.icon}
              </Link>
            ))}
          </Stack>

          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}
          >
            © {new Date().getFullYear()} Learning Platform
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
