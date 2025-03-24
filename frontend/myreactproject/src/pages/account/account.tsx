import React, { useEffect, useState, useRef } from 'react';
import { 
    fetchAccountDetails, 
    updateAccountDetails, 
    uploadAvatar, 
    AccountDetails 
} from '../../services/account/accountService';
import CourseList from '../../components/course/CourseList';
import { fetchCourses } from '../../services/course/courseService';
import './styleAccount/account.css';

const Account: React.FC = () => {
    const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState<AccountDetails | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState<string | null>(null);

    useEffect(() => {
        const loadAccountDetails = async () => {
            try {
                const details = await fetchAccountDetails();
                setAccountDetails(details);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Помилка завантаження даних');
            } finally {
                setLoading(false);
            }
        };

        loadAccountDetails();
    }, []);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourses();
                console.log('Завантажені курси:', data);
                setCourses(data);
            } catch (err) {
                setCoursesError(err instanceof Error ? err.message : 'Помилка завантаження курсів');
            } finally {
                setCoursesLoading(false);
            }
        };

        loadCourses();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedDetails(accountDetails);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedDetails(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!editedDetails) return;
        
        setEditedDetails({
            ...editedDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (!editedDetails) return;

        try {
            await updateAccountDetails({
                firstName: editedDetails.firstName,
                lastName: editedDetails.lastName,
                dateOfBirth: editedDetails.dateOfBirth,
                description: editedDetails.description
            });

            const updatedDetails = await fetchAccountDetails();
            setAccountDetails(updatedDetails);
            setIsEditing(false);
            setError('');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error instanceof Error ? error.message : 'Помилка оновлення профілю');
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await convertToBase64(file);
            await uploadAvatar(base64);
            
            // Refresh account details after successful upload
            const updatedDetails = await fetchAccountDetails();
            setAccountDetails(updatedDetails);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error uploading avatar');
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    if (loading) return <div className="loading">Завантаження...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!accountDetails) return <div className="error">Дані не знайдено</div>;

    return (
        <div className="account-container">
            {/* Ліва колонка */}
            <div className="account-sidebar">
                <div className="profile-basic-info">
                    <div className="avatar-section">
                        <img 
                            src={accountDetails?.avatar || '/default-avatar.png'} 
                            alt="Profile avatar" 
                            className="profile-avatar"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button 
                            className="upload-avatar-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Змінити фото
                        </button>
                    </div>
                    
                    <div className="profile-info-section">
                        {/* Existing fields */}
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{accountDetails.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Ім'я:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={editedDetails?.firstName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Введіть ім'я"
                                />
                            ) : (
                                <span>{accountDetails.firstName || 'Не вказано'}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <label>Прізвище:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={editedDetails?.lastName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Введіть прізвище"
                                />
                            ) : (
                                <span>{accountDetails.lastName || 'Не вказано'}</span>
                            )}
                        </div>
                        {/* New fields */}
                        <div className="info-item">
                            <label>Дата народження:</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={editedDetails?.dateOfBirth || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{accountDetails.dateOfBirth ? new Date(accountDetails.dateOfBirth).toLocaleDateString('uk-UA') : 'Не вказано'}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <label>Про себе:</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={editedDetails?.description || ''}
                                    onChange={handleInputChange}
                                    placeholder="Розкажіть про себе"
                                />
                            ) : (
                                <span>{accountDetails.description || 'Не вказано'}</span>
                            )}
                        </div>
                        {/* Edit buttons */}
                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button className="save-button" onClick={handleSave}>Зберегти</button>
                                    <button className="cancel-button" onClick={handleCancel}>Скасувати</button>
                                </>
                            ) : (
                                <button className="upload-avatar-btn" onClick={handleEdit}>Редагувати профіль</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Права секція */}
            <div className="account-main">
                {/* Верхня панель статистики */}
                <div className="stats-panel">
                    <div className="stat-card">
                        <h3>Рівень</h3>
                        <div className="stat-value">{Math.floor(accountDetails.xp / 100)}</div>
                    </div>
                    <div className="stat-card">
                        <h3>XP</h3>
                        <div className="stat-value">{accountDetails.xp}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Курсів завершено</h3>
                        <div className="stat-value">
                            {accountDetails.completed_courses?.length || 0}
                        </div>
                    </div>
                </div>



                {/* Courses section */}
                <div className="courses-section">
                    <h1>Список курсів</h1>
                    {coursesLoading ? (
                        <div className="loading">Завантаження курсів...</div>
                    ) : coursesError ? (
                        <div className="error">{coursesError}</div>
                    ) : (
                        <CourseList courses={courses} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;