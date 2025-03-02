import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourseById, fetchCourseItems, createCourseItem } from "../../services/course/courseService";
import VideoItem from "../../components/course/item/VideoItem";
import TextItem from "../../components/course/item/TextItem";

interface Course {
    _id: string;
    name: string;
    description?: string;
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

    if (loading) return <div>Завантаження...</div>;
    if (!course) return <div>Курс не знайдено</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="mb-8">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isEditing ? 'Скасувати' : 'Додати елемент'}
                </button>

                {isEditing && (
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4 p-4 border rounded">
                        <div>
                            <label className="block mb-1">Назва елементу</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Тип</label>
                            <select
                                value={itemType}
                                onChange={(e) => setItemType(e.target.value as "text" | "video")}
                                className="w-full p-2 border rounded"
                            >
                                <option value="text">Текст</option>
                                <option value="video">Відео</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">
                                {itemType === 'text' ? 'Текст' : 'URL відео'}
                            </label>
                            <input
                                type={itemType === 'video' ? 'url' : 'text'}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded"
                        >
                            Зберегти
                        </button>
                    </form>
                )}
            </div>

            <div className="space-y-4">
                {courseItems.map((item) => (
                    <div key={item._id} className="p-4 border rounded">
                        <h3 className="font-bold mb-2">{item.name}</h3>
                        {item.type === 'video' ? (
                            <VideoItem url={item.url || ''} />
                        ) : (
                            <TextItem text={item.text || ''} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;