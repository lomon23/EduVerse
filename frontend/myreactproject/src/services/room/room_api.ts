import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your backend URL

// Create a room
export const createRoom = async (data: {
    name: string;
    isPrivate?: boolean;
}, email: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/rooms/create/`, data, {
            headers: { Email: email }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to create room');
    }
};

// Join a room
export const joinRoom = async (data: {
    inviteCode: string;
}, email: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/rooms/join/`, data, {
            headers: { Email: email }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to join room');
    }
};

// Join a course
export const joinCourse = async (data: {
    inviteCode: string;
}, email: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/courses/join/`, data, {
            headers: { Email: email }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to join course');
    }
};

// Remove a user from a room
export const removeUserFromRoom = async (data: {
    roomId: string;
    userId?: string;
    email?: string;
}) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/rooms/remove-user/`, { data });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to remove user from room');
    }
};

// Delete a room
export const deleteRoom = async (data: { roomId: string }) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/rooms/delete/`, { data });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to delete room');
    }
};
