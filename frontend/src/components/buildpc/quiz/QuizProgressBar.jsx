import React from 'react';

const QuizProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="quiz-progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default QuizProgressBar;
