import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, DialogActions, Button } from '@mui/material';

interface VideoUrlDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

const VideoUrlDialog: React.FC<VideoUrlDialogProps> = ({ open, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    onSubmit(url);
    setUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="URL відео"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSubmit} variant="contained">Додати</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoUrlDialog;
