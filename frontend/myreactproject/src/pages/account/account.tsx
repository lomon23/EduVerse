import React, { useEffect, useState, useRef } from 'react';
import { 
    fetchAccountDetails, 
    updateAccountDetails, 
    uploadAvatar, 
    AccountDetails 
} from '../../services/account/accountService';
import './styleAccount/account.css';

const Account: React.FC = () => {
    const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState<AccountDetails | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleEdit = () => {
        setIsEditing(true);
        setEditedDetails(accountDetails);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedDetails(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                description: editedDetails.description // Add this line
            });

            // Refresh account details after successful update
            const updatedDetails = await fetchAccountDetails();
            setAccountDetails(updatedDetails);
            setIsEditing(false);
            setError('');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error instanceof Error ? error.message : 'Error updating profile');
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

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error}</div>;
    if (!accountDetails) return <div>Дані не знайдено</div>;

    return (
        <div className={`account-container ${isEditing ? 'edit-mode' : 'view-mode'}`}>
            <div className="account-header">
                <h2>Профіль користувача</h2>
                {!isEditing && (
                    <button className="edit-button" onClick={handleEdit}>
                        Редагувати
                    </button>
                )}
            </div>
            
            <div className="account-details">
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
                <div className="detail-item">
                    <label>Email:</label>
                    <span>{accountDetails.email}</span>
                </div>
                <div className="detail-item">
                    <label>Ім'я:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="firstName"
                            value={editedDetails?.firstName || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{accountDetails.firstName || 'Не вказано'}</span>
                    )}
                </div>

                <div className="detail-item">
                    <label>Прізвище:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={editedDetails?.lastName || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{accountDetails.lastName || 'Не вказано'}</span>
                    )}
                </div>

                <div className="detail-item">
                    <label>XP:</label>
                    <span>{accountDetails.xp}</span>
                </div>
                <div className="detail-item">
                    <label>Дата народження:</label>
                    {isEditing ? (
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={editedDetails?.dateOfBirth || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span>{accountDetails.dateOfBirth || 'Не вказано'}</span>
                    )}
                </div>
                <div className="detail-item">
                    <label>Завершені курси:</label>
                    {accountDetails.completed_courses.length > 0 ? (
                        <ul>
                            {accountDetails.completed_courses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))}
                        </ul>
                    ) : (
                        <span>Немає завершених курсів</span>
                    )}
                </div>

                <div className="detail-item description-item">
                    <label>Про себе:</label>
                    {isEditing ? (
                        <textarea
                            name="description"
                            value={editedDetails?.description || ''}
                            onChange={(e) => setEditedDetails(prev => prev ? {
                                ...prev,
                                description: e.target.value
                            } : null)}
                            placeholder="Розкажіть щось про себе..."
                            maxLength={500}
                        />
                    ) : (
                        <p className="description-text">
                            {accountDetails.description || 'Опис відсутній'}
                        </p>
                    )}
                </div>

                {isEditing && (
                    <div className="save-cancel-buttons">
                        <button className="save-button" onClick={handleSave}>
                            Зберегти
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            Скасувати
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;