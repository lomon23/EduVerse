import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Button, IconButton, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { fetchAccountDetails } from '../../services/account/accountService';

// Shared styles for navigation links
const navLinkStyles = {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1.1rem', // Increased font size
    position: 'relative',
    padding: '4px 0',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '0%',
        height: '2px',
        backgroundColor: '#b5831a',
        transition: 'width 0.2s ease',
    },
    '&:hover::after': {
        width: '100%',
    },
    background: 'none',
};

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState<string>('/default-avatar.png');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        setIsLoggedIn(!!storedEmail);
    }, []);

    useEffect(() => {
        const loadAvatar = async () => {
            if (isLoggedIn) {
                try {
                    const details = await fetchAccountDetails();
                    setAvatar(details.avatar || '/default-avatar.png');
                } catch (error) {
                    console.error('Error loading avatar:', error);
                }
            }
        };
        loadAvatar();
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
    };

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAccountClick = () => {
        navigate('/account');
        handleClose();
    };

    const handleSettingsClick = () => {
        navigate('/settings');
        handleClose();
    };

    const handleLogoutClick = () => {
        handleLogout();
        handleClose();
    };

    return (
        <Box
            component="header"
            sx={{
                backgroundColor: '#121212',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
        >
            <Container
                maxWidth={false} // Full width container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '64px',
                    px: { xs: 2, md: 3 }, // Increased padding
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Link
                        to="/"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                        }}
                    >
                        EduPortal
                    </Link>

                    <Box sx={{ display: 'flex', gap: 3, ml: 3 }}>
                        <Box
                            component={Link}
                            to="#"
                            style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                textDecoration: 'none',
                                fontWeight: 600,
                                position: 'relative',
                                padding: '4px 0',
                            }}
                            sx={{
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '0%',
                                    height: '2px',
                                    backgroundColor: '#b5831a',
                                    transition: 'width 0.2s ease',
                                },
                                '&:hover::after': {
                                    width: '100%',
                                },
                                background: 'none',
                            }}
                        >
                            About me
                        </Box>
                        <Box
                            component={Link}
                            to="#"
                            style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                textDecoration: 'none',
                                fontWeight: 600,
                                position: 'relative',
                                padding: '4px 0',
                            }}
                            sx={{
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '0%',
                                    height: '2px',
                                    backgroundColor: '#b5831a',
                                    transition: 'width 0.2s ease',
                                },
                                '&:hover::after': {
                                    width: '100%',
                                },
                                background: 'none',
                            }}
                        >
                            Contact
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}> {/* Reduced gap from 4 to 2 */}
                    {isLoggedIn ? (
                        <>
                            <Box component={Link} to="/create_course" sx={navLinkStyles}>
                                Create Course
                            </Box>
                            <Divider orientation="vertical" sx={{ height: 24, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box component={Link} to="/premium" sx={navLinkStyles}>
                                Get Premium
                            </Box>
                            <Divider orientation="vertical" sx={{ height: 24, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Avatar
                                src={avatar}
                                onClick={handleAvatarClick}
                                sx={{
                                    width: 36, // Slightly larger avatar
                                    height: 36,
                                    border: '2px solid #b5831a',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                sx={{
                                    '& .MuiPaper-root': {
                                        backgroundColor: '#121212',
                                        color: '#fff',
                                        minWidth: 120,
                                        mt: 1
                                    }
                                }}
                            >
                                <MenuItem 
                                    onClick={handleAccountClick}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            color: '#b5831a',
                                            backgroundColor: 'rgba(181, 131, 26, 0.1)'
                                        }
                                    }}
                                >
                                    Account
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleSettingsClick}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            color: '#b5831a',
                                            backgroundColor: 'rgba(181, 131, 26, 0.1)'
                                        }
                                    }}
                                >
                                    Settings
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleLogoutClick}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            color: '#b5831a',
                                            backgroundColor: 'rgba(181, 131, 26, 0.1)'
                                        }
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 4 }}> {/* Added more right margin */}
                            <Box component={Link} to="/register" sx={navLinkStyles}>
                                Register
                            </Box>
                            <Divider orientation="vertical" sx={{ height: 24, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box component={Link} to="/login" sx={navLinkStyles}>
                                Login
                            </Box>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Header;
