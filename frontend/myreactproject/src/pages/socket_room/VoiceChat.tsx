import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const VoiceChat: React.FC<{ roomId: string }> = ({ roomId }) => {
    const [isMicOn, setIsMicOn] = useState(false);
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState<string[]>([]);
    const localStreamRef = useRef<MediaStream | null>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
    const socketRef = useRef<any>(null);

    // Для ідентифікації користувача (можна замінити на email)
    const userId = useRef<string>(`user_${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);

        socketRef.current.emit('join-room', { roomId, userId: userId.current });

        setConnected(true);

        socketRef.current.on('voice', ({ data, from }: { data: ArrayBuffer; from: string }) => {
            // Створюємо окремий audio-елемент для кожного користувача
            if (!audioRefs.current[from]) {
                audioRefs.current[from] = new Audio();
            }
            const audioBlob = new Blob([data], { type: 'audio/webm;codecs=opus' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRefs.current[from]!.src = audioUrl;
            audioRefs.current[from]!.play();
        });

        socketRef.current.on('users-in-room', (userList: string[]) => {
            setUsers(userList);
        });

        socketRef.current.on('user-connected', (id: string) => {
            setUsers(prev => [...new Set([...prev, id])]);
        });

        socketRef.current.on('user-disconnected', (id: string) => {
            setUsers(prev => prev.filter(u => u !== id));
        });

        return () => {
            socketRef.current.emit('leave-room', { roomId, userId: userId.current });
            socketRef.current.disconnect();
            setConnected(false);
        };
    }, [roomId]);

    const startMic = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsMicOn(true);

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                event.data.arrayBuffer().then(buffer => {
                    socketRef.current.emit('voice', { data: buffer, roomId, from: userId.current });
                });
            }
        };

        mediaRecorder.start(300);

        // Stop mic on unmount
        return () => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            setIsMicOn(false);
        };
    };

    const stopMic = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            setIsMicOn(false);
        }
    };

    return (
        <div>
            <div>
                <strong>Статус:</strong> {connected ? 'Підключено' : 'Відключено'}
            </div>
            <div>
                <strong>У voice chat:</strong>
                <ul>
                    {users.map(u => (
                        <li key={u}>
                            {u === userId.current ? 'Ви' : u}
                        </li>
                    ))}
                </ul>
            </div>
            {!isMicOn ? (
                <button onClick={startMic}>Увімкнути мікрофон</button>
            ) : (
                <button onClick={stopMic}>Вимкнути мікрофон</button>
            )}
        </div>
    );
};

export default VoiceChat;