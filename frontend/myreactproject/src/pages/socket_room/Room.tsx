import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Container, Grid, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import io, { Socket } from 'socket.io-client';

const Room: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [users, setUsers] = useState<{id: string, username: string}[]>([]);
  const [username, setUsername] = useState('User_' + Math.floor(Math.random() * 1000));
  const [room, setRoom] = useState('general');

  useEffect(() => {
    // Connect to socket server - make sure your Express server is running
    try {
      const newSocket = io('http://localhost:5000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });
      
      setSocket(newSocket);

      // Set up event listeners
      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to server');
        
        // Join room after connection
        newSocket.emit('joinRoom', username, room);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from server');
      });

      newSocket.on('message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('roomUsers', ({ users }) => {
        setUsers(users);
      });

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }, [username, room]);

  const sendMessage = () => {
    if (message && socket) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid sx={{ gridColumn: 'span 8' }}>
          <Paper elevation={3} sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* Connection Status */}
            <Typography variant="body2" sx={{ mb: 2 }}>
              Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </Typography>
            
            {/* Chat Messages Area */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, p: 2 }}>
              {messages.map((msg, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  <strong>{msg.user}:</strong> {msg.text}
                </Typography>
              ))}
              {!isConnected && (
                <Typography color="error">
                  Not connected to server. Make sure your Express server is running on port 5000.
                </Typography>
              )}
            </Box>

            {/* Message Input */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!isConnected}
              />
              <Button 
                variant="contained" 
                onClick={sendMessage}
                disabled={!isConnected}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid sx={{ gridColumn: 'span 4' }}>
          <Paper elevation={3} sx={{ p: 2, height: '70vh' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Participants</Typography>
            <List>
              {users.length > 0 ? (
                users.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No users connected" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Room;