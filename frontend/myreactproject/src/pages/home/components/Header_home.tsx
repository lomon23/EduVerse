import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const pages = [
  { title: 'Головна', path: '/' },
  { title: 'Курси', path: '/courses' },
  { title: 'Про нас', path: '/about' },
];

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#0a0a0a', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 600,
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            LOGO
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.path} onClick={() => handleNavigate(page.path)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            LOGO
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  mr: 2,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  '&:hover': {
                    color: '#b5831a'
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Auth buttons */}
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="text"
              sx={{ 
                mr: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#b5831a'
                }
              }}
              onClick={() => {
                document.getElementById('hero-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
                // Add extra smoothness with custom duration
                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }, 100);
              }}
            >
              Get Free
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#b5831a',
                '&:hover': {
                  backgroundColor: '#a57318',
                }
              }}
              onClick={() => {
                setTimeout(() => {
                  const pricing = document.getElementById('pricing');
                  if (pricing) {
                    pricing.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }
                }, 100);
              }}
            >
              Try Pro
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HomeHeader;
