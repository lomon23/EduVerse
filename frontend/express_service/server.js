const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const handleBoardSockets = require('./sockets/board');

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["*"],
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  connectTimeout: 45000,
  pingTimeout: 30000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e8
});

handleBoardSockets(io);

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});