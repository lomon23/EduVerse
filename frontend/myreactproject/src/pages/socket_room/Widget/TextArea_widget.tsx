import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

interface TextAreaWidgetProps {
  id: string;
  x: number;
  y: number;
  color: string;
  text: string;
  isDragging?: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTextChange: (text: string) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onResize?: (width: number, height: number) => void;
  width?: number;
  height?: number;
}

const TextAreaWidget: React.FC<TextAreaWidgetProps> = ({
  id,
  x,
  y,
  color,
  text,
  isDragging,
  onMouseDown,
  onTextChange,
  onDelete,
  onResize,
  width = 200,
  height = 150,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const initialSize = useRef({ width, height });
  const startPos = useRef({ x: 0, y: 0 });

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
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        border: '10px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
        cursor: 'move',
        opacity: isDragging ? 0.8 : 1,
        '&:hover': {
          border: '10px solid #bbb'
        }
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e);
        }}
        sx={{
          position: 'absolute',
          top: -15,
          right: -15,
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
      
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onMouseDown={e => e.stopPropagation()}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          resize: 'none',
          outline: 'none',
          padding: '8px',
          fontSize: '14px',
          fontFamily: 'Arial',
          cursor: 'text'
        }}
      />

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

export default TextAreaWidget;
