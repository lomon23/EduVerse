import React, { useEffect, useState } from "react";
import { fetchCourses } from "../../services/course/courseService";
import { Link } from "react-router-dom";

interface Course {
    _id: string;
    name: string;
    description?: string;
    author: string;
    listItemId: string[];
}

const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourses();
                console.log('Loaded courses:', data); // Debug log
                setCourses(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error('Error loading courses:', error);
                setLoading(false);
            }
        };
        loadCourses();
    }, []);

    if (loading) return <p>Завантаження...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📚 Список курсів</h2>
            {courses.length === 0 ? (
                <p>Немає курсів</p>
            ) : (
                <ul className="space-y-2">
                    {courses.map((course) => (
                        <li
                            key={course._id}
                            className="p-4 border rounded-lg shadow bg-white"
                        >
                            <Link 
                                to={`/courses/${course._id}`} 
                                className="text-lg font-bold text-blue-500 hover:underline"
                            >
                                {course.name}
                            </Link>
                            <p className="text-sm text-gray-600">
                                {course.description || "Без опису"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseList;