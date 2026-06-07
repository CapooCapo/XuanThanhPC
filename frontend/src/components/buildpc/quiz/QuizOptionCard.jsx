import React from 'react';

const QuizOptionCard = ({ option, isSelected, onSelect }) => {
  return (
    <div 
      className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(option.id)}
    >
      {option.icon && <span className="option-icon">{option.icon}</span>}
      <span className="option-label">{option.label}</span>
    </div>
  );
};

export default QuizOptionCard;
