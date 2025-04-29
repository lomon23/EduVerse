import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const generateRoomId = () => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomNumber = Math.floor(Math.random() * 999) + 1; // Random number between 1 and 999
    return `${roomName}_${dateString}_${randomNumber}`;
  };

  const handleCreateRoom = () => {
    const roomId = generateRoomId();
    console.log("Generated Room ID:", roomId);
    // Here you would typically send the roomName, nickname, password, and roomId to your backend
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Room
        </Typography>
        
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
          
            fullWidth
            label="Room Name"
            variant="outlined"
            margin="normal"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          
          <TextField
            fullWidth
            label="Your Nickname"
            variant="outlined"
            margin="normal"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          
          <TextField
            fullWidth
            label="Room Password (optional)"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRoom;