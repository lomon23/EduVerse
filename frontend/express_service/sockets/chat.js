// This file will be used to handle chat-specific socket events
const setupChatHandlers = (io) => {
    const users = {};
    
    io.on('connection', (socket) => {
      // Handle user joining a room
      socket.on('joinRoom', (username, room) => {
        // Store user info
        users[socket.id] = { username, room };
        
        // Join the room
        socket.join(room);
        
        // Welcome the current user
        socket.emit('message', {
          user: 'System',
          text: `Welcome to the room, ${username}!`
        });
        
        // Broadcast to others in the room
        socket.to(room).emit('message', {
          user: 'System',
          text: `${username} has joined the room`
        });
        
        // Send users in room info
        io.to(room).emit('roomUsers', {
          room,
          users: getUsersInRoom(room)
        });
      });
      
      // Handle chat messages
      socket.on('sendMessage', (message) => {
        const user = users[socket.id];
        if (user) {
          io.to(user.room).emit('message', {
            user: user.username,
            text: message
          });
        }
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
          io.to(user.room).emit('message', {
            user: 'System',
            text: `${user.username} has left the room`
          });
          
          // Remove user from users object
          delete users[socket.id];
          
          // Send updated users list
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersInRoom(user.room)
          });
        }
      });
    });
    
    // Helper function to get users in a room
    function getUsersInRoom(room) {
      return Object.entries(users)
        .filter(([_, user]) => user.room === room)
        .map(([id, user]) => ({ id, username: user.username }));
    }
  };
  
  module.exports = setupChatHandlers;