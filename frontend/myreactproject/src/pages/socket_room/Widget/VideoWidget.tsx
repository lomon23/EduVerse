import React, { useState } from 'react';
import { Box, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface VideoWidgetProps {
  id: string;
  x: number;
  y: number;
  videoUrl?: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onUrlSubmit: (url: string) => void;
}

const VideoWidget: React.FC<VideoWidgetProps> = ({
  id,
  x,
  y,
  videoUrl,
  onDelete,
  onMouseDown,
  onUrlSubmit
}) => {
  const [url, setUrl] = useState(videoUrl || '');

  return (
    <Box
      onMouseDown={onMouseDown}
      sx={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '320px',
        height: '240px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'move',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
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

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Введіть URL відео"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          sx={{ backgroundColor: 'white', flex: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => onUrlSubmit(url)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          Готово
        </Button>
      </Box>
    </Box>
  );
};

export default VideoWidget;
