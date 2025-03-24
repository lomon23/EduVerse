const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const createCourse = async (name: string, description: string, xpReward: number) => {
    try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            throw new Error("Email не знайдено");
        }

        const response = await fetch(`${API_BASE_URL}/create-course/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Email': email
            },
            body: JSON.stringify({
                name,
                description,
                xp_reward: xpReward
            })
        });

        if (!response.ok) {
            throw new Error("Не вдалося створити курс");
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка створення курсу:", error);
        throw error;
    }
};


export const fetchCourseById = async (courseId: string) => {
    try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            throw new Error("Email не знайдено");
        }

        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Email': email
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Курс не знайдено");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || `Помилка завантаження курсу: ${response.status}`);
        }

        const data = await response.json();
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
        const email = localStorage.getItem('userEmail');
        if (!email) {
            throw new Error("Email не знайдено");
        }

        const response = await fetch(`${API_BASE_URL}/create-course-item/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Email': email
            },
            body: JSON.stringify({
                ...data,
                author_email: email
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Помилка створення елементу курсу');
        }

        const result = await response.json();
        console.log('Created course item:', result); // Debug log
        return result;
    } catch (error) {
        console.error('Error creating course item:', error);
        throw error;
    }
};

export const fetchCourses = async () => {
    try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            throw new Error("Email не знайдено");
        }

        const response = await fetch(`${API_BASE_URL}/courses/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Email': email
            }
        });

        if (!response.ok) {
            throw new Error("Не вдалося отримати курси");
        }

        const data = await response.json();
        console.log('Отримані курси:', data); // Для дебагу
        return data;
    } catch (error) {
        console.error("Помилка завантаження курсів:", error);
        throw error;
    }
};

export const updateCourse = async (courseId: string, updateData: {
    title?: string;
    description?: string;
}) => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
        throw new Error("Необхідна авторизація");
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/`, {
            method: 'PUT',
            headers: {
                'Email': email,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Не вдалося оновити курс");
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка оновлення курсу:", error);
        throw error;
    }
};

export const completeCourse = async (courseId: string, completionPercentage: string) => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
        throw new Error("Необхідна авторизація");
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/complete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Email': email
            },
            body: JSON.stringify({ completionPercentage })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Не вдалося завершити курс");
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка завершення курсу:", error);
        throw error;
    }
};