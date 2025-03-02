export const fetchCourses = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/courses/");
        if (!response.ok) throw new Error("Не вдалося отримати курси");
        return await response.json();
    } catch (error) {
        console.error("Помилка завантаження курсів:", error);
        return [];
    }
};
