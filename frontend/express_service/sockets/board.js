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

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = handleBoardSockets;
