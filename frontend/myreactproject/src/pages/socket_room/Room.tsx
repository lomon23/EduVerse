import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Container, Grid, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from './ChatRoom'; // Import the ChatRoom component

const Room: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>(); // Get roomId from URL params
    const [roomDetails, setRoomDetails] = useState<{
        name: string;
        createdAt: string;
        ownerEmail: string;
    } | null>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0); // State for active tab

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage
                if (!email) {
                    setError('Електронна пошта не знайдена. Увійдіть у систему.');
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/rooms/${roomId}/`, {
                    headers: { Email: email },
                });

                setRoomDetails(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Не вдалося завантажити дані кімнати');
            }
        };

        fetchRoomDetails();
    }, [roomId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!roomDetails) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Завантаження даних кімнати...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {/* Tabs Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Main Page" />
                            <Tab label="Chat" />
                            <Tab label="Board" />
                            <Tab label="Voice Chat" />
                        </Tabs>
                    </Paper>
                </Grid>

                {/* Tab Content */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        {activeTab === 0 && (
                            <>
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    {roomDetails.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Дата створення:</strong> {new Date(roomDetails.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Автор:</strong> {roomDetails.ownerEmail}
                                </Typography>
                            </>
                        )}
                        
                        {activeTab === 1 && <ChatRoom roomId={roomId!} />} {/* Render ChatRoom component */}
                        {activeTab === 2 && (
                            <Typography variant="body1">
                                Це вкладка дошки. Тут буде реалізовано функціонал дошки.
                            </Typography>
                        )}
                        {activeTab === 3 && (
                            <Typography variant="body1">
                                Це вкладка голосового чату. Тут буде реалізовано функціонал голосового чату.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Room;