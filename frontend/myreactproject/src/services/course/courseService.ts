const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const createCourse = async (name: string, description: string, author: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-course/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, author }),
        });

        if (!response.ok) throw new Error('Failed to create course');
        return await response.json();
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

export const fetchCourseById = async (courseId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched course data:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
    }
};

export const fetchCourseItems = async (courseId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/course/${courseId}/items/`);
        if (!response.ok) throw new Error('Failed to fetch course items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching course items:', error);
        throw error;
    }
};

export const createCourseItem = async (data: {
    course_id: string;
    name: string;
    type: 'text' | 'video';
    text?: string;
    url?: string;
}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-course-item/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to create course item');
        return await response.json();
    } catch (error) {
        console.error('Error creating course item:', error);
        throw error;
    }
};
// ...existing code...

export const fetchCourses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API response:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};