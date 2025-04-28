import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const saveMessage = async (messageData: {
  chatId: string;
  senderEmail: string;
  senderName: string;
  content: string;
  type?: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/save_massage/`, messageData);
    return response.data;
  } catch (error) {
    console.error('Failed to save message:', error);
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/messages/${chatId}/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
};