import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { fetchWeeklyTasks, WeeklyTask } from '../../services/mainPage/weekTask';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WeeklyTasks: React.FC = () => {
    const [tasks, setTasks] = useState<WeeklyTask[]>([]);
    const [randomTasks, setRandomTasks] = useState<WeeklyTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to get random tasks
    const getRandomTasks = (allTasks: WeeklyTask[], count: number = 3) => {
        const shuffled = [...allTasks].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchWeeklyTasks();
                setTasks(data);
                setRandomTasks(getRandomTasks(data));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    return (
        <Box sx={{
            position: 'absolute',
            right: '24px',
            bottom: '24px',
            backgroundColor: 'rgba(50, 50, 50, 0.3)',
            padding: '24px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            width: '350px'
        }}>
            <Paper sx={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        Тижневі завдання
                    </Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} sx={{ color: '#b5831a' }} />
                        </Box>
                    ) : error ? (
                        <Typography sx={{ color: 'error.main', p: 2 }}>{error}</Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {randomTasks.map((task) => (
                                <Paper
                                    key={task._id}
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        '&:hover': {
                                            borderColor: '#b5831a',
                                            backgroundColor: 'rgba(181, 131, 26, 0.05)'
                                        }
                                    }}
                                >
                                    <Typography sx={{ color: '#fff', mb: 1 }}>
                                        {task.title}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.875rem',
                                        mb: 1
                                    }}>
                                        {task.description}
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmojiEventsIcon sx={{ color: '#b5831a', fontSize: '1rem' }} />
                                            <Typography sx={{ color: '#b5831a', fontSize: '0.875rem' }}>
                                                {task.reward_xp} XP
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                color: '#b5831a',
                                                borderColor: '#b5831a',
                                                '&:hover': {
                                                    borderColor: '#b5831a',
                                                    backgroundColor: 'rgba(181, 131, 26, 0.1)'
                                                }
                                            }}
                                        >
                                            Take Task
                                        </Button>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default WeeklyTasks;

// тепер дивись мені потрібно написати ось таку систему, потрібно зробити часовий лічильний, так як це тижневі завдання то і оновлюватись вони повинні, раз в тиждень, і я подумав що найкраще буде зробити так що кожного тижня, 