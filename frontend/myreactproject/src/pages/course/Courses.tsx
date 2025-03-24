import React, { useState, useEffect } from "react";
import { createCourse } from '../../services/course/courseService';
import { useNavigate } from 'react-router-dom';
import './courseStyle/create_course.css';

const CreateCourse: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [xpReward, setXpReward] = useState("0");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            setMessage("Увійдіть в систему для створення курсу");
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
    
        try {
            const xpRewardNumber = parseInt(xpReward);
            if (isNaN(xpRewardNumber)) {
                setMessage("XP має бути числом");
                return;
            }

            await createCourse(name, description, xpRewardNumber);
            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Помилка створення курсу");
            }
        }
    };


    return (
        <div className="create-course-container">
            <h2 className="create-course-title">Створення нового курсу</h2>
            <form onSubmit={handleSubmit} className="create-course-form">
                <div className="form-group">
                    <label className="form-label">Назва курсу</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Опис</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-input"
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">XP за проходження</label>
                    <input
                        type="number"
                        value={xpReward}
                        onChange={(e) => setXpReward(e.target.value)}
                        className="form-input"
                        min="0"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="form-button"
                >
                    Створити курс
                </button>
                {message && (
                    <p className="form-message">{message}</p>
                )}
            </form>
        </div>
    );
};

export default CreateCourse;
