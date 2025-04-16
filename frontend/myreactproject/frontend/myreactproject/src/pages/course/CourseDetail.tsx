import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourseById, fetchCourseItems, createCourseItem, completeCourse } from "../../services/course/courseService";
import VideoItem from "../../components/course/item/VideoItem";
import TextItem from "../../components/course/item/TextItem";
import "./courseStyle/course_detail.css";

interface Course {
    _id: string;
    name: string;
    description?: string;
    xpReward: number;
    completionPercentage?: string;
}

interface CourseItem {
    _id: string;
    course_id: string;
    name: string;
    type: "text" | "video";
    text?: string;
    url?: string;
}

const CoursePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [courseItems, setCourseItems] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemType, setItemType] = useState<"text" | "video">("text");
    const [content, setContent] = useState("");
    const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const [courseData, itemsData] = await Promise.all([
                    fetchCourseById(id),
                    fetchCourseItems(id)
                ]);
                setCourse(courseData);
                setCourseItems(itemsData);

                // Load completed items from localStorage
                const savedCompletedItems = localStorage.getItem(`course_${id}_completed`);
                if (savedCompletedItems) {
                    setCompletedItems(new Set(JSON.parse(savedCompletedItems)));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !itemName || !content) return;

        try {
            const newItem = await createCourseItem({
                course_id: id,
                name: itemName,
                type: itemType,
                ...(itemType === 'text' ? { text: content } : { url: content })
            });
            setCourseItems([...courseItems, newItem]);
            setIsEditing(false);
            setItemName("");
            setContent("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleItemCompletion = async (itemId: string, completed: boolean) => {
        const newCompletedItems = new Set(completedItems);
        if (completed) {
            newCompletedItems.add(itemId);
        } else {
            newCompletedItems.delete(itemId);
        }
        setCompletedItems(newCompletedItems);
        
        // Save completed items to localStorage
        localStorage.setItem(
            `course_${id}_completed`,
            JSON.stringify([...newCompletedItems])
        );

        // Calculate and update completion percentage
        if (course && courseItems.length > 0) {
            const percentage = `${Math.round((newCompletedItems.size / courseItems.length) * 100)}%`;
            
            try {
                await fetch(`http://127.0.0.1:8000/api/courses/${id}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Email': localStorage.getItem('userEmail') || '',
                    },
                    body: JSON.stringify({ completionPercentage: percentage })
                });

                setCourse({
                    ...course,
                    completionPercentage: percentage
                });
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }
    };

    const handleCompleteCourse = async () => {
        if (!course || !id) return;

        try {
            const percentage = `${Math.round((completedItems.size / courseItems.length) * 100)}%`;
            const result = await completeCourse(id, percentage);
            
            setCourse({
                ...course,
                completionPercentage: percentage
            });

            alert(`Курс завершено! Ви отримали ${result.xp_earned} XP. Ваш прогрес: ${percentage}`);
        } catch (error) {
            console.error('Error completing course:', error);
            alert('Помилка при збереженні прогресу курсу');
        }
    };

    if (loading) return <div>Завантаження...</div>;
    if (!course) return <div>Курс не знайдено</div>;

    return (
        <div className="course-detail-container">
            <div className="course-info-card">
                <div className="course-info-content">
                    <h1 className="course-detail-title">{course.name}</h1>
                    <p className="course-detail-description">{course.description}</p>
                    <div className="course-detail-xp">XP за проходження: {course.xpReward}</div>
                    {course.completionPercentage && (
                        <div className="course-completion">
                            Завершено: {course.completionPercentage}
                        </div>
                    )}
                </div>
                <button 
                    className="complete-course-button"
                    onClick={handleCompleteCourse}
                >
                    Завершити курс
                </button>
            </div>

            <div className="course-detail-actions">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="course-detail-button"
                >
                    {isEditing ? 'Скасувати' : 'Додати елемент'}
                </button>

                {isEditing && (
                    <form onSubmit={handleSubmit} className="course-detail-form">
                        <div className="form-group">
                            <label className="form-label">Назва елементу</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Тип</label>
                            <select
                                value={itemType}
                                onChange={(e) => setItemType(e.target.value as "text" | "video")}
                                className="form-input"
                            >
                                <option value="text">Текст</option>
                                <option value="video">Відео</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                {itemType === 'text' ? 'Текст' : 'URL відео'}
                            </label>
                            <input
                                type={itemType === 'video' ? 'url' : 'text'}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="form-button"
                        >
                            Зберегти
                        </button>
                    </form>
                )}
            </div>

            <div className="course-items-container">
                <div className="course-items-list">
                    {courseItems.map((item) => (
                        <div key={item._id} className="course-item">
                            <h3 className="course-item-title">{item.name}</h3>
                            {item.type === 'video' ? (
                                <VideoItem url={item.url || ''} />
                            ) : (
                                <TextItem text={item.text || ''} />
                            )}
                            <div className="course-item-completion">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={completedItems.has(item._id)}
                                        onChange={(e) => handleItemCompletion(item._id, e.target.checked)}
                                    />
                                    Завершено
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursePage;