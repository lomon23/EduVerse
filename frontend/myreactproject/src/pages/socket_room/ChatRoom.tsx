import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { fetchAccountDetails } from '../../services/account/accountService';
import { saveMessage, getMessages } from '../../services/room/chat_room';

interface Message {
  text: string;
  timestamp: string;
}

let newSocket : Socket | null = null; // Declare newSocket outside of the component

const ChatRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState('');
  const [accountDetails, setAccountDetails] = useState<any>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const details = await fetchAccountDetails();
        setAccountDetails(details);
        setNickname(`${details.firstName} ${details.lastName}`);

        // Load existing messages
        const existingMessages = await getMessages(roomId);
        const formattedMessages = existingMessages.map((msg: any) => ({
          text: `${msg.senderName}: ${msg.content}`,
          timestamp: new Date(msg.timestamp).toLocaleTimeString('en-GB')
        }));
        setMessages(formattedMessages);
        console.log('Loaded messages:', formattedMessages);
          if (!newSocket) {
              newSocket = io('http://localhost:5000');
              setSocket(newSocket);
              newSocket.emit('joinRoom', `${details.firstName} ${details.lastName}`, roomId);
              newSocket.on('message', (msg: Message) => {
                  setMessages(prev => [...prev, msg]);
              });
          }
        return () => {
          newSocket?.off('message');
          newSocket?.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, []);

  const sendMessage = async () => {
    if (message && socket && accountDetails) {
      const timestamp = new Date().toLocaleTimeString('en-GB');

      try {
        // Save message to database
        await saveMessage({
          chatId: roomId,
          senderEmail: accountDetails.email,
          senderName: nickname,
          content: message,
          type: 'text'
        });

        // Send message through socket
        socket.emit('sendMessage', { text: message, timestamp });
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        height: '300px',
        overflowY: 'scroll',
        marginBottom: '10px',
        backgroundColor: '#f5f5f5'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: 'bold' }}>{msg.timestamp}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
