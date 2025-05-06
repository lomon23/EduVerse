import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createBoard, getBoardInfo, getAllBoards } from '../../services/room/board_room';
import { useNavigate } from 'react-router-dom';

interface Board {
    _id: string;
    name: string;
    avatar?: string;
    widgetsCount?: number;
    createdAt?: string;
    room_id?: string;
}

interface BoardListProps {
    roomId: string;
}

const BoardList: React.FC<BoardListProps> = ({ roomId }) => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [open, setOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [loading, setLoading] = useState(false);
    const [infoBoardId, setInfoBoardId] = useState('');
    const [infoResult, setInfoResult] = useState<any>(null);
    const [infoLoading, setInfoLoading] = useState(false);
    const [infoError, setInfoError] = useState<string | null>(null);
    const [allBoards, setAllBoards] = useState<Board[]>([]);
    const [allBoardsLoading, setAllBoardsLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewBoardName('');
    };

    const handleCreate = async () => {
        if (!newBoardName.trim()) return;
        setLoading(true);
        try {
            const res = await createBoard({ name: newBoardName, room_id: roomId });
            const info = await getBoardInfo(res._id);
            setBoards(prev => [...prev, { _id: res._id, name: res.name, avatar: res.avatar, widgetsCount: info.widgetsCount, createdAt: info.createdAt }]);
            handleClose();
        } catch (e) {
            // handle error
        }
        setLoading(false);
    };

    const handleGetBoardInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setInfoResult(null);
        setInfoError(null);
        if (!infoBoardId.trim()) return;
        setInfoLoading(true);
        try {
            const data = await getBoardInfo(infoBoardId.trim());
            setInfoResult(data);
        } catch (err) {
            setInfoError('Не вдалося отримати інформацію про дошку');
        }
        setInfoLoading(false);
    };

    const handleBoardClick = (boardId: string) => {
        navigate(`/board-room/${boardId}`);
    };

    useEffect(() => {
        setAllBoardsLoading(true);
        getAllBoards()
            .then(data => setAllBoards(data))
            .catch(() => setAllBoards([]))
            .finally(() => setAllBoardsLoading(false));
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>Дошки кімнати</Typography>
                <IconButton color="primary" onClick={handleOpen}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Grid container spacing={2}>
                {boards.map(board => (
                    <Grid item key={board._id} xs={12} sm={6} md={4} lg={3}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 2, 
                                minHeight: 100, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{board.name}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Віджетів: {board.widgetsCount ?? '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Дата створення: {board.createdAt ? new Date(board.createdAt).toLocaleString() : '-'}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleBoardClick(board._id)}
                                sx={{ mt: 2 }}
                            >
                                Переглянути дошку
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ my: 4 }}>
                <Typography variant="h6" gutterBottom>Перевірити інформацію про дошку</Typography>
                <form onSubmit={handleGetBoardInfo} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <TextField
                        label="ID дошки"
                        value={infoBoardId}
                        onChange={e => setInfoBoardId(e.target.value)}
                        size="small"
                    />
                    <Button type="submit" variant="outlined" disabled={infoLoading || !infoBoardId.trim()}>
                        Отримати
                    </Button>
                </form>
                {infoLoading && <Typography sx={{ mt: 1 }}>Завантаження...</Typography>}
                {infoError && <Typography color="error" sx={{ mt: 1 }}>{infoError}</Typography>}
                {infoResult && (
                    <Paper sx={{ mt: 2, p: 2 }}>
                        <Typography variant="subtitle2">ID: {infoResult._id}</Typography>
                        <Typography>Назва: {infoResult.name}</Typography>
                        <Typography>Кількість віджетів: {infoResult.widgetsCount}</Typography>
                        <Typography>Дата створення: {infoResult.createdAt ? new Date(infoResult.createdAt).toLocaleString() : '-'}</Typography>
                    </Paper>
                )}
            </Box>
            <Box sx={{ my: 4 }}>
                <Typography variant="h6" gutterBottom>Всі дошки (усіх кімнат)</Typography>
                {allBoardsLoading ? (
                    <Typography>Завантаження...</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {allBoards.map(board => (
                            <Grid item key={board._id} xs={12} sm={6} md={4} lg={3}>
                                <Paper elevation={1} sx={{ p: 2, minHeight: 80 }}>
                                    <Typography variant="subtitle2">{board.name}</Typography>
                                    <Typography variant="body2">ID: {board._id}</Typography>
                                    <Typography variant="body2">Room: {board.room_id ?? '-'}</Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleBoardClick(board._id)}
                                        sx={{ mt: 2 }}
                                    >
                                        Переглянути дошку
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Створити нову дошку</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Назва дошки"
                        fullWidth
                        value={newBoardName}
                        onChange={e => setNewBoardName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Скасувати</Button>
                    <Button onClick={handleCreate} disabled={loading || !newBoardName.trim()} variant="contained">
                        Створити
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BoardList;
