import React from 'react';
import { useNavigate } from 'react-router-dom';
import './/style/courseList.css';

interface Course {
    _id: string;
    title: string;
    description: string;
    author_email: string;
    created_at: string;
}

interface CourseListProps {
    courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    const handleEditCourse = (courseId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/courses/edit/${courseId}`);
    };

    const handleStudyCourse = (courseId: string) => {
        navigate(`/courses/${courseId}/`);
    };

    return (
        <div className="course-list">
            {courses.map((course) => (
                <div 
                    key={course._id} 
                    className="course-card"
                    onClick={() => handleStudyCourse(course._id)}
                >
                    <div className="course-content">
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <span className="course-author">
                            Автор: {course.author_email}
                        </span>
                        <span className="course-date">
                            Створено: {new Date(course.created_at).toLocaleDateString('uk-UA')}
                        </span>
                    </div>
                    {course.author_email === userEmail && (
                        <div className="course-actions">
                            <button
                                className="edit-button"
                                onClick={(e) => handleEditCourse(course._id, e)}
                            >
                                Редагувати
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseList;