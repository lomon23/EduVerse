// Chat module for handling socket.io chat functionality
const setupChatHandlers = (io) => {
  const users = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (username, room) => {
      if (users[socket.id]) {
        socket.leave(users[socket.id].room);
      }

      users[socket.id] = { username, room };
      socket.join(room);
    });

    socket.on('sendMessage', ({ text, timestamp }) => {
      const user = users[socket.id];
      if (user) {
        io.to(user.room).emit('message', { text: `${user.username}: ${text}`, timestamp });
      }
    });

    socket.on('disconnect', () => {
      const user = users[socket.id];
      if (user) {
        delete users[socket.id];
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupChatHandlers;