import React, { useState } from "react";
import { createCourse } from '../../services/course/courseService';
import { useNavigate } from 'react-router-dom';

const CreateCourse: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await createCourse(name, description, author);
            navigate('/');
        } catch (error) {
            setMessage("Помилка створення курсу");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Створення нового курсу</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Назва курсу</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Опис</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={4}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Автор</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Створити курс
                </button>
                {message && (
                    <p className="text-red-500 text-center">{message}</p>
                )}
            </form>
        </div>
    );
};

export default CreateCourse;