const handleBoardSockets = (io) => {
  // Зберігаємо віджети для кожної дошки
  const boardWidgets = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinBoard', (boardId) => {
      const room = `board-${boardId}`;
      socket.join(room);
      console.log(`User ${socket.id} joined board ${boardId}`);
      
      // Відправляємо існуючі віджети новому користувачу
      const existingWidgets = boardWidgets.get(boardId) || [];
      socket.emit('initialWidgets', existingWidgets);
    });

    socket.on('createWidget', (boardId, widget) => {
      console.log(`Creating widget:`, { boardId, widget });
      
      // Зберігаємо віджет
      if (!boardWidgets.has(boardId)) {
        boardWidgets.set(boardId, []);
      }
      boardWidgets.get(boardId).push(widget);
      
      // Broadcast to all clients in the room
      const room = `board-${boardId}`;
      console.log(`Broadcasting to room: ${room}`);
      io.to(room).emit('widgetCreated', widget);
    });

    socket.on('moveWidget', (boardId, widgetId, position) => {
      const widgets = boardWidgets.get(boardId) || [];
      const widgetIndex = widgets.findIndex(w => w.id === widgetId);
      
      if (widgetIndex !== -1) {
        widgets[widgetIndex] = { ...widgets[widgetIndex], ...position };
        io.to(`board-${boardId}`).emit('widgetMoved', { widgetId, ...position });
      }
    });

    socket.on('deleteWidget', (boardId, widgetId) => {
      console.log(`Deleting widget ${widgetId} from board ${boardId}`);
      
      const widgets = boardWidgets.get(boardId) || [];
      const updatedWidgets = widgets.filter(w => w.id !== widgetId);
      boardWidgets.set(boardId, updatedWidgets);
      
      io.to(`board-${boardId}`).emit('widgetDeleted', widgetId);
    });

    socket.on('updateWidgetText', (boardId, widgetId, text) => {
      const widgets = boardWidgets.get(boardId) || [];
      const widgetIndex = widgets.findIndex(w => w.id === widgetId);
      
      if (widgetIndex !== -1) {
        widgets[widgetIndex] = { ...widgets[widgetIndex], text };
        io.to(`board-${boardId}`).emit('widgetTextUpdated', { widgetId, text });
      }
    });

    socket.on('resizeWidget', (boardId, widgetId, size) => {
      const widgets = boardWidgets.get(boardId) || [];
      const widgetIndex = widgets.findIndex(w => w.id === widgetId);
      
      if (widgetIndex !== -1) {
        widgets[widgetIndex] = { ...widgets[widgetIndex], ...size };
        io.to(`board-${boardId}`).emit('widgetResized', { widgetId, ...size });
      }
    });

    socket.on('videoStateChange', (boardId, widgetId, state) => {
      const room = `board-${boardId}`;
      socket.to(room).emit('videoStateUpdated', { widgetId, ...state });
    });

    /**
     * @typedef {Object} VideoActionPayload
     * @property {string} boardId
     * @property {string} widgetId
     * @property {{ type: 'play' | 'pause', timestamp: number, currentTime: number }} action
     */

    /**
     * @param {VideoActionPayload} payload
     */
    socket.on('videoAction', (payload) => {
      if (!payload || !payload.action) {
        console.error('Invalid videoAction payload:', payload);
        return;
      }

      const { boardId, widgetId, action } = payload;
      const room = `board-${boardId}`;
      const actionType = action.type === 'play' ? 'started playing' : 'paused';
      
      console.log(`Video ${widgetId} in room ${room} ${actionType} at ${action.currentTime}s`);
      socket.to(room).emit('videoActionReceived', { widgetId, action });
    });

    socket.on('videoSync', (payload) => {
      if (!payload || !payload.currentTime) {
        console.error('Invalid videoSync payload:', payload);
        return;
      }

      const { boardId, widgetId, currentTime } = payload;
      const room = `board-${boardId}`;
      
      socket.to(room).emit('videoSync', { 
        widgetId, 
        currentTime 
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = handleBoardSockets;
