import React, { useEffect, useState } from 'react';
import { Paper, Typography, Container, Tabs, Tab, List, ListItem, ListItemText, IconButton, Avatar, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from './ChatRoom';
import Grid from '@mui/material/Grid';
import { fetchRoomMembers, removeUserFromRoom, RoomMember, deleteRoom, updateRoomAvatar } from '../../services/room/room_api';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import VoiceChat from './VoiceChat';

const Room: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [roomDetails, setRoomDetails] = useState<{
        name: string;
        createdAt: string;
        ownerEmail: string;
        inviteCode?: string;
        isPrivate?: boolean;
        avatar?: string;
    } | null>(null);
    const [members, setMembers] = useState<RoomMember[]>([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);

    const currentUserEmail = localStorage.getItem('userEmail');

    // Функція для кодування файлу в base64
    const encodeFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Обробник вибору аватарки
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await encodeFileToBase64(file);
            setAvatarPreview(base64);
            setRoomDetails((prev) => prev ? { ...prev, avatar: base64 } : prev);
            setAvatarChanged(true); // показати кнопку "Зберегти"
        }
    };

    const handleSaveAvatar = async () => {
        if (!roomId || !currentUserEmail || !avatarPreview) return;
        setLoadingAvatar(true);
        try {
            await updateRoomAvatar(roomId, avatarPreview, currentUserEmail);
            setAvatarChanged(false);
        } catch (err) {
            alert('Не вдалося зберегти аватарку');
        }
        setLoadingAvatar(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                if (!email) {
                    setError('Електронна пошта не знайдена. Увійдіть у систему.');
                    return;
                }
                const roomResponse = await axios.get(`http://localhost:8000/api/rooms/${roomId}/`, {
                    headers: { Email: email },
                });
                setRoomDetails(roomResponse.data);
                setAvatarPreview(roomResponse.data.avatar);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Не вдалося завантажити дані');
            }
        };

        fetchData();
    }, [roomId]);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!roomId) return;
            try {
                const data = await fetchRoomMembers(roomId);
                setMembers(data);
            } catch (e) {}
        };
        fetchMembers();
    }, [roomId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleRemoveMember = async (email: string) => {
        if (!roomId || !currentUserEmail) return;
        try {
            await removeUserFromRoom({ roomId, email }, currentUserEmail);
            setMembers((prevMembers) => prevMembers.filter((member) => member.email !== email));
        } catch (err) {
            console.error('Failed to remove member:', err);
        }
    };

    const handleDeleteRoom = async () => {
        if (!roomId || !currentUserEmail) return;
        try {
            await deleteRoom({ roomId }, currentUserEmail);
            window.location.href = '/';
        } catch (err) {
            console.error('Failed to delete room:', err);
        }
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
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        {activeTab === 0 && (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        src={avatarPreview || undefined}
                                        alt="Room Avatar"
                                        sx={{ width: 64, height: 64, mr: 2 }}
                                    />
                                    {roomDetails.ownerEmail === currentUserEmail && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handleAvatarChange}
                                                />
                                                <Button variant="outlined" component="span" sx={{ mb: 1 }}>
                                                    Змінити аватарку
                                                </Button>
                                            </label>
                                            {avatarChanged && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSaveAvatar}
                                                    disabled={loadingAvatar}
                                                >
                                                    {loadingAvatar ? 'Збереження...' : 'Зберегти аватарку'}
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    {roomDetails.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Invite Code:</strong> {roomDetails.inviteCode}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Тип кімнати:</strong> {roomDetails.isPrivate ? 'Приватна' : 'Публічна'}
                                </Typography>
                                {roomDetails.ownerEmail === currentUserEmail && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        sx={{ mb: 2 }}
                                        onClick={handleDeleteRoom}
                                    >
                                        Видалити кімнату
                                    </Button>
                                )}
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                    Список учасників кімнати:
                                </Typography>
                                <List sx={{ mb: 2 }}>
                                    {members.map((member, idx) => (
                                        <ListItem
                                            key={member.email + idx}
                                            divider
                                            secondaryAction={
                                                roomDetails.ownerEmail === currentUserEmail && member.email !== roomDetails.ownerEmail && (
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member.email)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            <ListItemText
                                                primary={member.email}
                                                secondary={`Роль: ${member.role} | Приєднався: ${new Date(member.joinedAt).toLocaleString()}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Дата створення:</strong> {new Date(roomDetails.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Автор:</strong> {roomDetails.ownerEmail}
                                </Typography>
                            </>
                        )}
                        {activeTab === 1 && <ChatRoom roomId={roomId!} />}
                        {activeTab === 2 && (
                            <Typography variant="body1">
                                Це вкладка дошки. Тут буде реалізовано функціонал дошки.
                            </Typography>
                        )}
                        {activeTab === 3 && <VoiceChat roomId={roomId!} />}
                    </Paper>
                
                </Grid>
            </Grid>
        </Container>
    );
};

export default Room;