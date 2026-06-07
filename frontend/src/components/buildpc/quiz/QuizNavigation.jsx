import React from 'react';

const QuizNavigation = ({ currentStep, isFirstStep, isLastStep, onNext, onPrev, isNextDisabled }) => {
  return (
    <div className="quiz-footer">
      <button 
        className="quiz-nav-button btn-back" 
        onClick={onPrev}
        disabled={isFirstStep}
        style={{ visibility: isFirstStep ? 'hidden' : 'visible' }}
      >
        Quay lại
      </button>
      <button 
        className="quiz-nav-button btn-next" 
        onClick={onNext}
        disabled={isNextDisabled}
      >
        {isLastStep ? 'Xem kết quả' : 'Tiếp tục'}
      </button>
    </div>
  );
};

export default QuizNavigation;
