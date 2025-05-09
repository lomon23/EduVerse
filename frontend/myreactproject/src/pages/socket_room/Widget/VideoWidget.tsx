import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoWidgetProps {
  id: string;
  x: number;
  y: number;
  videoUrl: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  socket?: any; // Add socket prop for video sync
  onResize?: (width: number, height: number) => void;
  width?: number;
  height?: number;
}

interface YouTubeEvent {
  data: number;
  target: any;
}

interface VideoAction {
  type: 'play' | 'pause';
  timestamp: number;
  currentTime: number;
}

interface VideoActionResponse {
  widgetId: string;
  action: VideoAction;
}

interface VideoSyncPayload {
  widgetId: string;
  currentTime: number;
}

const VideoWidget: React.FC<VideoWidgetProps> = ({
  id,
  x,
  y,
  videoUrl,
  onDelete,
  onMouseDown,
  socket,
  onResize,
  width = 320,
  height = 240,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const initialSize = useRef({ width, height });
  const startPos = useRef({ x: 0, y: 0 });
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        console.log('Відео почалося!');
        socket?.emit('videoAction', {
          boardId: id.split('-')[0], // Assuming boardId is part of the widget id
          widgetId: id,
          action: {
            type: 'play',
            timestamp: Date.now(),
            currentTime: playerRef.current?.getCurrentTime() || 0
          }
        });
        break;
      case window.YT.PlayerState.PAUSED:
        console.log('Відео на паузі!');
        socket?.emit('videoAction', {
          boardId: id.split('-')[0],
          widgetId: id,
          action: {
            type: 'pause',
            timestamp: Date.now(),
            currentTime: playerRef.current?.getCurrentTime() || 0
          }
        });
        break;
      case window.YT.PlayerState.ENDED:
        console.log('Відео завершено!');
        break;
    }
  };

  useEffect(() => {
    if (!videoUrl) {
      console.error('No video URL provided:', videoUrl);
      return;
    }

    const videoId = getVideoId(videoUrl);
    if (!videoId) {
      console.error('Invalid video URL:', videoUrl);
      return;
    }

    console.log('Loading player for video:', videoId);

    // Create player once YouTube API is ready
    const initPlayer = () => {
      if (!playerDivRef.current) return;
      
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        height: '240',
        width: '320',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log('Player ready');
          },
          onStateChange: onPlayerStateChange
        }
      });
    };

    // Load YouTube API if not already loaded
    if (window.YT) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // This will be called by YouTube API when it's ready
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl, id]);

  // Handle sync from other clients
  useEffect(() => {
    if (!socket) return;

    const handleVideoAction = ({ widgetId, action }: VideoActionResponse) => {
      if (widgetId === id && playerRef.current) {
        if (action.type === 'play') {
          playerRef.current.seekTo(action.currentTime);
          playerRef.current.playVideo();
          console.log(`Синхронізація: відео запущено на ${action.currentTime} сек`);
        } else if (action.type === 'pause') {
          playerRef.current.seekTo(action.currentTime);
          playerRef.current.pauseVideo();
          console.log(`Синхронізація: відео зупинено на ${action.currentTime} сек`);
        }
        
      }
    };

    socket.on('videoActionReceived', handleVideoAction);

    return () => {
      socket.off('videoActionReceived', handleVideoAction);
    };
  }, [socket, id]);

  // Handle time sync from other clients
  useEffect(() => {
    if (!socket || !playerRef.current) return;

    const syncInterval = setInterval(() => {
      if (playerRef.current?.getPlayerState() === window.YT.PlayerState.PLAYING) {
        socket.emit('videoSync', {
          boardId: id.split('-')[0],
          widgetId: id,
          currentTime: playerRef.current.getCurrentTime()
        });
      }
    }, 5000); // Sync every 5 seconds

    socket.on('videoSync', ({ widgetId, currentTime }: VideoSyncPayload) => {
      if (widgetId === id && playerRef.current) {
        const currentPlayerTime = playerRef.current.getCurrentTime();
        const timeDiff = Math.abs(currentTime - currentPlayerTime);

        // Only sync if difference is more than 1 second
        if (timeDiff > 1) {
          playerRef.current.seekTo(currentTime);
          console.log(`Синхронізовано час відео до ${currentTime} сек`);
        }
      }
    });

    return () => {
      clearInterval(syncInterval);
      socket.off('videoSync');
    };
  }, [socket, id]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { width, height };
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    const newWidth = Math.max(MIN_WIDTH, initialSize.current.width + dx);
    const newHeight = Math.max(MIN_HEIGHT, initialSize.current.height + dy);

    onResize?.(newWidth, newHeight);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <Box
      onMouseDown={onMouseDown}
      sx={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width + 20}px`, // Add padding for border
        height: `${height + 20}px`,
        backgroundColor: '#f5f5f5',
        border: '10px solid #ddd',
        borderRadius: '4px',
        cursor: 'move',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          border: '10px solid #bbb'
        }
      }}
    >
      {/* Inner video container */}
      <Box
        sx={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          backgroundColor: '#000',
          pointerEvents: 'auto', // Enable video interaction
          borderRadius: '2px',
          overflow: 'hidden'
        }}
        onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking video
      >
        <div ref={playerDivRef} />
      </Box>

      <IconButton
        size="small"
        onClick={onDelete}
        sx={{
          position: 'absolute',
          top: -15,
          right: -15,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Add resize handle */}
      <IconButton
        size="small"
        onMouseDown={handleResizeStart}
        sx={{
          position: 'absolute',
          bottom: -15,
          right: -15,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          padding: '2px',
          cursor: 'se-resize',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <DragHandleIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default VideoWidget;
