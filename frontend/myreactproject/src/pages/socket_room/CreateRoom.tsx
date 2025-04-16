import React from 'react';
// First install @mui/material and @emotion/react @emotion/styled packages:
// npm install @mui/material @emotion/react @emotion/styled
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

const CreateRoom: React.FC = () => {
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
          />
          
          <TextField
            fullWidth
            label="Your Nickname"
            variant="outlined"
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Room Password (optional)"
            type="password"
            variant="outlined"
            margin="normal"
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Create Room
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRoom;