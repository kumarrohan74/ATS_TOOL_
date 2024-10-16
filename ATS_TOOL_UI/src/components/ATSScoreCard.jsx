import React from 'react';

const ATSScoreCard = ({ score }) => {
    // Ensure the score is between 0 and 100
    const validScore = Math.min(Math.max(score, 0), 100);
    
    // Round the score to the nearest whole number
    const roundedScore = Math.round(validScore);

    const getStrokeColor = () => {
        if (roundedScore < 50) return 'red';
        if (roundedScore < 80) return 'yellow';
        return 'green';
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

    return (
        <div className="flex items-center justify-center">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="lightgray"
                    strokeWidth="10"
                    fill="none"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={getStrokeColor()}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    transform="rotate(-90 50 50)"
                />
                {/* Display the rounded score as an integer */}
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-xl font-bold">
                    {roundedScore}
                </text>
            </svg>
        </div>
    );
};

export default ATSScoreCard;
