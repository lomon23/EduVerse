import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { fetchAccountDetails, AccountDetails } from '../../services/account/accountService';

const HeroSection: React.FC = () => {
    const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);

    useEffect(() => {
        const loadAccountDetails = async () => {
            try {
                const details = await fetchAccountDetails();
                setAccountDetails(details);
            } catch (error) {
                console.error('Error loading account details:', error);
            }
        };

        loadAccountDetails();
    }, []);

    return (
        <Box sx={{
            width: '100%',
            backgroundColor: 'rgba(50, 50, 50, 0.3)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            marginBottom: '24px'
        }}>
            <Box sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            color: '#fff',
                            fontWeight: 600,
                            mb: 1
                        }}
                    >
                        Welcome back, {accountDetails?.firstName || 'User'}
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '1.1rem'
                        }}
                    >
                        Ready to continue your learning journey?
                    </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                        sx={{ 
                            color: '#b5831a',
                            fontWeight: 600,
                            fontSize: '1.2rem'
                        }}
                    >
                        XP: {accountDetails?.xp || 0}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default HeroSection;
