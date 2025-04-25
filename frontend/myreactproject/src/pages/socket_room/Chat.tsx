import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import io, { Socket } from 'socket.io-client';

interface ChatProps {
    roomId: string;
}

const Chat: React.FC<ChatProps> = ({ roomId }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Retrieve username from localStorage
        const storedFirstName = localStorage.getItem('firstName');
        const storedLastName = localStorage.getItem('lastName');
        const user = storedFirstName && storedLastName ? `${storedFirstName} ${storedLastName}` : 'Anonymous';
        setUsername(user);

        // Connect to socket server
        const newSocket = io('http://localhost:5000', {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
        });

        setSocket(newSocket);

        // Join the room
        newSocket.emit('joinRoom', { username: user, roomId });

        // Listen for messages
        newSocket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const sendMessage = () => {
        if (message && socket) {
            socket.emit('sendMessage', { text: message, roomId, user: username });
            setMessage('');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Chat
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                {messages.map((msg, index) => (
                    <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                        <strong>{msg.user}:</strong> {msg.text}
                    </Typography>
                ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                    size="small"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button variant="contained" onClick={sendMessage}>
                    Send
                </Button>
            </Box>
        </Paper>
    );
};

export default Chat;
