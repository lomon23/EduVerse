import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styleAccount/AcStyle.css";
import "./styleAccount/first_section.css";
import "./styleAccount/sec_thi_section.css";
import "./styleAccount/mainsection.css";
import SemiCircleChart from './circle';
import LevelCard from './LevelCard';

const Account: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // ... existing localStorage code ...
    }, []);
    const progressData = [
        { value: 2, color: "#FF6B6B", label: "Courses Completed" },
        { value: 3, color: "#4ECDC4", label: "Docs Read" },
        { value: 0, color: "#45B7D1", label: "Lessons Finished" }
    ];

    return (
        <main>
            <div className="first_section">
                <div className="profile-top">
                    <img 
                        src="https://static.wikia.nocookie.net/every-little-thing/images/4/4c/Lain_Iwakura_%28Serial_Experiments_Lain%29.png/revision/latest/scale-to-width-down/1200?cb=20230516201133" 
                        alt="Profile picture" 
                    />
                    <div className="profile-info">
                        <h1>{firstName || 'User'}</h1>
                        <h3>@{email || 'user'}</h3>
                        <button className="edit-profile-btn">Edit Profile</button>
                    </div>
                </div>

                <div className="comunyty_rank">
                    <p>Community Stats</p>
                    <div className="stats-container">
                        <div className="stat-item views">
                            <h3>Views: 0</h3>
                            <h4>Last week: 0</h4>
                        </div>
                        <div className="stat-item like">
                            <h3>Likes: 0</h3>
                            <h4>Last week: 0</h4>
                        </div>
                        <div className="stat-item comment">
                            <h3>Comments: 0</h3>
                            <h4>Last week: 0</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="second_section">
                        <div className="progress-container">
                            <SemiCircleChart data={progressData} />
                            <div className="progress-stats">
                                <div className="progress-item courses">
                                    <div className="progress-number">4</div>
                                    <p>Courses</p>
                                </div>
                                <div className="progress-item docs">
                                    <div className="progress-number">5</div>
                                    <p>Docs</p>
                                </div>
                                <div className="progress-item lessons">
                                    <div className="progress-number">6</div>
                                    <p>Lessons</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="third_section">
                        <LevelCard 
                            level={69}
                            currentXP={700}
                            maxXP={1000}
                            totalXP={4700}
                        />
                    </div>
                </div>
                <div className="mainsection">
                    <p>main sec</p>
                </div>
            </div>
        </main>
    );
};

export default Account;