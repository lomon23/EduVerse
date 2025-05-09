import React, { useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';

interface VideoUrlInputProps {
  onSubmit: (url: string) => void;
}

const VideoUrlInput: React.FC<VideoUrlInputProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        size="small"
        placeholder="Введіть URL відео"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        sx={{ minWidth: 300 }}
      />
      <Button 
        variant="contained"
        size="small"
        onClick={() => onSubmit(url)}
      >
        Готово
      </Button>
    </Stack>
  );
};

export default VideoUrlInput;
