export const fetchCourses = async () => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
        throw new Error("Необхідна авторизація");
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/courses/", {
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
            throw new Error(errorData.error || "Не вдалося отримати курси");
        }

        const data = await response.json();
        console.log('Отримані курси:', data); // For debugging
        return data;
    } catch (error) {
        console.error("Помилка завантаження курсів:", error);
        throw new Error("Не вдалося отримати курси");
    }
};
