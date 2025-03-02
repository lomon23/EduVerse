import React from 'react';
import './styleAccount/SemiCircleChart.css'

interface ChartData {
    value: number;
    color: string;
    label: string;
}

const SemiCircleChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 60;
    const strokeWidth = 12;

    const calculatePath = (startPercent: number, endPercent: number) => {
        // Convert percentages to angles (-90 to 90 degrees for semi-circle)
        const start = -90 + (startPercent * 180);
        const end = -90 + (endPercent * 180);
        
        // Calculate points on the arc
        const startX = radius * Math.cos((start * Math.PI) / 180);
        const startY = radius * Math.sin((start * Math.PI) / 180);
        const endX = radius * Math.cos((end * Math.PI) / 180);
        const endY = radius * Math.sin((end * Math.PI) / 180);
        
        // Determine if we need to draw the large arc
        const largeArc = endPercent - startPercent > 0.5 ? 1 : 0;
        
        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
    };

    let currentPercent = 0;

    return (
        <div className="chart-wrapper">
            <svg width="140" height="80" viewBox="-70 -20 140 90">
                {/* Background arc */}
                <path
                    d="M -60 0 A 60 60 0 0 1 60 0"
                    fill="none"
                    stroke="#eee"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                
                {/* Data arcs */}
                {data.map((item, index) => {
                    if (item.value === 0) return null;
                    
                    const itemPercent = item.value / total;
                    const path = calculatePath(currentPercent, currentPercent + itemPercent);
                    currentPercent += itemPercent;
                    
                    return (
                        <path
                            key={index}
                            d={path}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    );
                })}
                
                {/* Center text */}
                <text
                    x="0"
                    y="20"
                    textAnchor="middle"
                    className="total-text"
                >
                    {total}
                </text>
            </svg>
        </div>
    );
};

export default SemiCircleChart;