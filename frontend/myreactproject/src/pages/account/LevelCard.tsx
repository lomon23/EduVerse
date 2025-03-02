import React from 'react';
import './styleAccount/level_card.css';

interface LevelCardProps {
    level: number;
    currentXP: number;
    maxXP: number;
    totalXP: number;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, currentXP, maxXP, totalXP }) => {
    const circumference = 2 * Math.PI * 54; // 2πr where r=54
    const offset = circumference - (currentXP / maxXP) * circumference;

    return (
        <div className="level-card">
            <div className="progress-container">
                <svg className="progress-ring" width="120" height="120">
                    <circle 
                        className="progress-bg" 
                        cx="60" 
                        cy="60" 
                        r="54"
                    />
                    <circle 
                        className="progress-bar" 
                        cx="60" 
                        cy="60" 
                        r="54"
                        style={{ strokeDashoffset: offset }}
                    />
                </svg>
                <div className="level">
                    {level}<br/>lvl
                </div>
            </div>
            
            <div className="stats">
                <div className="stat-box">
                    {currentXP} / {maxXP} XP
                </div>
                <div className="stat-box">
                    Залишилось: {maxXP - currentXP} XP
                </div>
                <div className="stat-box">
                    Всього: {totalXP} XP
                </div>
            </div>
        </div>
    );
};

export default LevelCard;