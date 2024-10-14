import React from 'react';

const ATSScoreCard = ({ score }) => {
    const validScore = Math.min(Math.max(score, 0), 100);
    const getStrokeColor = () => {
        if (validScore < 50) return 'red';
        if (validScore < 80) return 'yellow';
        return 'green';
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validScore / 100) * circumference;

    return (
        <div className="flex items-center justify-center">
            <svg className="w-32 h-32">
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="lightgray"
                    strokeWidth="10"
                    fill="none"
                />
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={getStrokeColor()}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-xl font-bold">
                    {validScore}
                </text>
            </svg>
        </div>
    );
};

export default ATSScoreCard;
