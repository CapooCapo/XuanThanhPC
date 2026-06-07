import React from 'react';
import QuizOptionCard from './QuizOptionCard';

const QuizStep = ({ step, selectedOptionId, onSelect }) => {
  return (
    <div className="quiz-step">
      <h2 className="step-title">{step.title}</h2>
      <p className="step-subtitle">{step.subtitle}</p>
      
      <div className="quiz-options-grid">
        {step.options.map((option) => (
          <QuizOptionCard 
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizStep;
