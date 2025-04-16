const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const setupChatHandlers = require('./chat');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Express server is running' });
});

// Setup chat socket handlers
setupChatHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server on Express running on ${PORT} port`);
});