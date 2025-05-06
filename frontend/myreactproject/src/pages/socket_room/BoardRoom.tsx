import React, { useEffect, useRef, useState } from 'react';
import { Box, Alert, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideoIcon from '@mui/icons-material/Videocam';
import { useParams, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import TextAreaWidget from './Widget/TextArea_widget';

interface Widget {
  id: string;
  x: number;
  y: number;
  color: string;
  type: 'box' | 'textarea' | 'video';
  text?: string;
  videoUrl?: string;
  isDragging?: boolean;
  width: number;
  height: number;
}

interface TextAreaWidgetProps {
  id: string;
  x: number;
  y: number;
  color: string;
  text: string;
  isDragging: boolean;
  width: number;
  height: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onTextChange: (text: string) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onResize: (width: number, height: number) => void;
}

const BoardRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const boardId = id;
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Підключення...');
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [openColorModal, setOpenColorModal] = useState(false);

  const handleOpenColorModal = () => setOpenColorModal(true);
  const handleCloseColorModal = () => setOpenColorModal(false);

  useEffect(() => {
    console.log('URL params:', {
      id,
      boardId,
      pathname: location.pathname,
      search: location.search
    });

    if (!boardId || boardId === 'undefined') {
      console.error('Invalid boardId:', boardId);
      setConnectionStatus('Помилка: Невірний ID дошки');
      return;
    }

    console.log('Connecting to board:', boardId);

    try {
      const socket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected, joining board:', boardId);
        socket.emit('joinBoard', boardId);
        setIsConnected(true);
        setConnectionStatus('Підключено');
      });

      socket.on('initialWidgets', (initialWidgets: Widget[]) => {
        console.log('Received initial widgets:', initialWidgets);
        setWidgets(initialWidgets);
      });

      socket.on('widgetCreated', (widget: Widget) => {
        console.log('Received widgetCreated event:', widget);
        setWidgets(prev => {
          const newWidgets = [...prev, widget];
          console.log('Updated widgets:', newWidgets);
          return newWidgets;
        });
      });

      socket.on('widgetMoved', ({ widgetId, x, y }) => {
        setWidgets(prev => prev.map(widget =>
          widget.id === widgetId ? { ...widget, x, y } : widget
        ));
      });

      socket.on('widgetDeleted', (widgetId: string) => {
        console.log('Received widgetDeleted event:', widgetId);
        setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
      });

      socket.on('widgetTextUpdated', ({ widgetId, text }) => {
        setWidgets(prev => prev.map(widget =>
          widget.id === widgetId ? { ...widget, text } : widget
        ));
      });

      socket.on('widgetResized', ({ widgetId, width, height }) => {
        setWidgets(prev => prev.map(widget =>
          widget.id === widgetId ? { ...widget, width, height } : widget
        ));
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
        setConnectionStatus('Відключено від сервера');
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
        setConnectionStatus(`Помилка підключення: ${error.message}`);
      });

      return () => {
        console.log('Cleaning up socket connection');
        socket.disconnect();
        socketRef.current = undefined;
      };
    } catch (error) {
      console.error('Socket connection error:', error);
      setConnectionStatus('Помилка підключення до сервера');
    }
  }, [boardId, id]);

  const handleCreateWidget = (type: 'box' | 'textarea' | 'video', color: string) => {
    if (!socketRef.current || !boardId || !isConnected) return;

    const newWidget: Widget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.random() * 300,
      y: Math.random() * 300,
      color: color,
      type: type,
      text: type === 'textarea' ? 'Новий текст' : undefined,
      videoUrl: type === 'video' ? '' : undefined,
      width: type === 'textarea' ? 200 : type === 'video' ? 320 : 100,
      height: type === 'textarea' ? 150 : type === 'video' ? 240 : 100
    };

    socketRef.current.emit('createWidget', boardId, newWidget);
  };

  const handleTextChange = (widgetId: string, newText: string) => {
    if (!socketRef.current) return;

    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, text: newText } : widget
    ));
    
    socketRef.current.emit('updateWidgetText', boardId, widgetId, newText);
  };

  const handleDeleteWidget = (e: React.MouseEvent, widgetId: string) => {
    e.stopPropagation();
    if (!socketRef.current) return;

    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    socketRef.current.emit('deleteWidget', boardId, widgetId);
  };

  const handleMouseDown = (e: React.MouseEvent, widget: Widget) => {
    e.preventDefault();
    setDraggedWidget(widget.id);
    setDragOffset({
      x: e.clientX - widget.x,
      y: e.clientY - widget.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedWidget || !socketRef.current) return;

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };

    setWidgets(prev => prev.map(widget =>
      widget.id === draggedWidget 
        ? { ...widget, x: newPosition.x, y: newPosition.y }
        : widget
    ));

    socketRef.current.emit('moveWidget', boardId, draggedWidget, newPosition);
  };

  const handleMouseUp = () => {
    setDraggedWidget(null);
  };

  const handleResize = (widgetId: string, width: number, height: number) => {
    if (!socketRef.current) return;

    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, width, height } : widget
    ));

    socketRef.current.emit('resizeWidget', boardId, widgetId, { width, height });
  };

  if (!boardId || boardId === 'undefined') {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Помилка: ID дошки не вказано
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ p: 2 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Alert 
        severity={isConnected ? "success" : "error"}
        sx={{ mb: 2 }}
      >
        {connectionStatus}
      </Alert>
      
      <Button 
        variant="contained" 
        onClick={handleOpenColorModal}
        sx={{ mb: 2 }}
      >
        Додати віджет
      </Button>

      <Dialog open={openColorModal} onClose={handleCloseColorModal}>
        <DialogTitle>Виберіть тип віджета</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, p: 2 }}>
            <Button 
              variant="outlined"
              onClick={() => {
                handleCreateWidget('textarea', '#ffffff');
                handleCloseColorModal();
              }}
              startIcon={<TextSnippetIcon />}
            >
              Текстовий віджет
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {
                handleCreateWidget('video', '#ffffff');
                handleCloseColorModal();
              }}
              startIcon={<VideoIcon />}
            >
              Відео віджет
            </Button>
            <Divider sx={{ my: 1 }}>Кольорові віджети</Divider>
            <Button 
              variant="contained" 
              onClick={() => {
                handleCreateWidget('box', '#ff0000');
                handleCloseColorModal();
              }}
              sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
            >
              Червоний віджет
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                handleCreateWidget('box', '#0000ff');
                handleCloseColorModal();
              }}
              sx={{ bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' } }}
            >
              Синій віджет
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColorModal}>Закрити</Button>
        </DialogActions>
      </Dialog>

      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 'calc(100vh - 200px)', 
          border: '1px solid #ccc',
          backgroundColor: '#fff'
        }}
      >
        {widgets.map(widget => (
          widget.type === 'textarea' ? (
            <TextAreaWidget
              key={widget.id}
              id={widget.id}
              x={widget.x}
              y={widget.y}
              color={widget.color}
              text={widget.text || ''}
              isDragging={draggedWidget === widget.id}
              width={widget.width}
              height={widget.height}
              onMouseDown={(e) => handleMouseDown(e, widget)}
              onTextChange={(text) => handleTextChange(widget.id, text)}
              onDelete={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteWidget(e, widget.id)}
              onResize={(width, height) => handleResize(widget.id, width, height)}
            />
          ) : (
            <Box
              key={widget.id}
              onMouseDown={(e) => handleMouseDown(e, widget)}
              sx={{
                position: 'absolute',
                left: `${widget.x}px`,
                top: `${widget.y}px`,
                width: `${widget.width}px`,
                height: `${widget.height}px`,
                backgroundColor: widget.color,
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'move',
                userSelect: 'none',
                zIndex: 1000,
                opacity: draggedWidget === widget.id ? 0.8 : 1,
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => handleDeleteWidget(e, widget.id)}
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '2px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )
        ))}
      </Box>
      <Typography variant="caption" sx={{ mt: 1 }}>
        Кількість віджетів: {widgets.length}
      </Typography>
    </Box>
  );
};

export default BoardRoom;