import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your backend URL

export interface RoomMember {
    email: string;
    role: string;
    joinedAt: string;
}

export interface RoomDetails {
    name: string;
    createdAt: string;
    ownerEmail: string;
    inviteCode: string;
    isPrivate: boolean;
    avatar?: string; // додано поле для аватарки
}

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
export const removeUserFromRoom = async (
    data: {
        roomId: string;
        userId?: string;
        email?: string;
    },
    ownerEmail: string // додайте цей параметр
) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/rooms/remove-user/`, {
            data,
            headers: { Email: ownerEmail }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to remove user from room');
    }
};

// Delete a room
export const deleteRoom = async (
    data: { roomId: string },
    ownerEmail: string // додайте цей параметр
) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/rooms/delete/`, {
            data,
            headers: { Email: ownerEmail }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to delete room');
    }
};

export const fetchRoomMembers = async (roomId: string): Promise<RoomMember[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/members/`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch room members');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching room members:', error);
        throw error;
    }
};

export const fetchRoomDetails = async (roomId: string, email: string): Promise<RoomDetails> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}/`, {
            headers: { Email: email }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to fetch room details');
    }
};

export const updateRoomAvatar = async (
    roomId: string,
    avatar: string,
    ownerEmail: string
) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/rooms/${roomId}/avatar/`, 
            { avatar },
            { headers: { Email: ownerEmail } }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to update room avatar');
    }
};

