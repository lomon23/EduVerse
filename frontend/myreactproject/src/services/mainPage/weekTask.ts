export enum TaskType {
    HOMEWORK = "homework",
    LESSON = "lesson",
    REVIEW = "review"
}

export interface WeeklyTask {
    _id: string;
    title: string;
    description: string;
    target_count: number;
    reward_xp: number;
    reward_badge_id?: string;
    created_at: string;
    is_completed: boolean;
    task_type: TaskType;
    current_progress: number;
    last_updated: string;
}

export const fetchWeeklyTasks = async () => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
        throw new Error("Необхідна авторизація");
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/weekly-tasks/", {
            method: 'GET',
            headers: {
                'Email': email,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Не вдалося отримати тижневі завдання");
        }

        const data = await response.json();
        console.log('Отримані тижневі завдання:', data);
        return data;
    } catch (error) {
        console.error("Помилка завантаження тижневих завдань:", error);
        throw new Error("Не вдалося отримати тижневі завдання");
    }
};

export const fetchTasksByType = async (taskType: TaskType) => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
        throw new Error("Необхідна авторизація");
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/weekly-tasks/type/${taskType}/`, {
            method: 'GET',
            headers: {
                'Email': email,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Не вдалося отримати завдання");
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка завантаження завдань:", error);
        throw error;
    }
};

export const updateTaskProgress = async (taskId: string, progress: number) => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
        throw new Error("Необхідна авторизація");
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/weekly-tasks/${taskId}/progress/`, {
            method: 'PUT',
            headers: {
                'Email': email,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ progress })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Не вдалося оновити прогрес");
        }

        return await response.json();
    } catch (error) {
        console.error("Помилка оновлення прогресу:", error);
        throw error;
    }
};
