import React from 'react';
import { Box, Paper, Typography, Container, Grid, List, ListItem, ListItemText } from '@mui/material';

const BoardRoom: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Інтерактивна дошка
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid sx={{ gridColumn: 'span 8' }}>
          <Paper elevation={3} sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Робоча область</Typography>
            
            <Box 
              sx={{ 
                flexGrow: 1, 
                backgroundColor: '#f5f5f5', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Тут буде реалізована інтерактивна дошка
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid sx={{ gridColumn: 'span 4' }}>
          <Paper elevation={3} sx={{ p: 2, height: '70vh' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Учасники</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Користувач 1 (Малює)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Користувач 2 (Переглядає)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Користувач 3 (Переглядає)" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BoardRoom;