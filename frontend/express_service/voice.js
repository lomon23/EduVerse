const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

const roomUsers = {};

io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, userId }) => {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;

        if (!roomUsers[roomId]) roomUsers[roomId] = [];
        if (!roomUsers[roomId].includes(userId)) roomUsers[roomId].push(userId);

        io.to(roomId).emit('users-in-room', roomUsers[roomId]);
        socket.to(roomId).emit('user-connected', userId);
    });

    socket.on('voice', ({ data, roomId, from }) => {
        socket.to(roomId).emit('voice', { data, from });
    });

    socket.on('leave-room', ({ roomId, userId }) => {
        if (roomUsers[roomId]) {
            roomUsers[roomId] = roomUsers[roomId].filter(u => u !== userId);
            io.to(roomId).emit('users-in-room', roomUsers[roomId]);
            socket.to(roomId).emit('user-disconnected', userId);
        }
    });

    socket.on('disconnect', () => {
        const { roomId, userId } = socket;
        if (roomId && userId && roomUsers[roomId]) {
            roomUsers[roomId] = roomUsers[roomId].filter(u => u !== userId);
            io.to(roomId).emit('users-in-room', roomUsers[roomId]);
            socket.to(roomId).emit('user-disconnected', userId);
        }
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Voice server running on port ${PORT}`);
});