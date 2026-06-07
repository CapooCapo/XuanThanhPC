import React from 'react';
import { useBuildPCQuiz } from '@/hooks/useBuildPCQuiz';
import { quizSteps } from '@/data/quizData';
import QuizProgressBar from './QuizProgressBar';
import QuizStep from './QuizStep';
import QuizNavigation from './QuizNavigation';
import QuizResult from './QuizResult';
import '@/styles/build-pc-quiz/quiz-modal.scss';

const BuildPCQuizModal = ({ onApplyRecommendation }) => {
  const {
    isOpen,
    currentStep,
    answers,
    isFinished,
    handleSelect,
    handleNext,
    handlePrev,
    skipQuiz,
    closeQuiz
  } = useBuildPCQuiz();

  if (!isOpen) return null;

  const step = quizSteps[currentStep];
  const isNextDisabled = !answers[step.id] && !step.optional;

  const handleApply = (finalAnswers) => {
    closeQuiz();
    if (onApplyRecommendation) {
      onApplyRecommendation(finalAnswers);
    }
  };

  return (
    <div className="build-pc-quiz-backdrop">
      <div className="build-pc-quiz-modal">
        <div className="quiz-header">
          <h3 className="quiz-title">Trợ lý Cấu hình AI</h3>
          <button className="skip-button" onClick={skipQuiz}>
            Bỏ qua
          </button>
        </div>
        
        {!isFinished && (
          <QuizProgressBar currentStep={currentStep} totalSteps={quizSteps.length} />
        )}

        <div className="quiz-body">
          {!isFinished ? (
            <QuizStep 
              step={step}
              selectedOptionId={answers[step.id]}
              onSelect={(optionId) => handleSelect(step.id, optionId)}
            />
          ) : (
            <QuizResult answers={answers} onApply={handleApply} />
          )}
        </div>

        {!isFinished && (
          <QuizNavigation 
            currentStep={currentStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === quizSteps.length - 1}
            onNext={handleNext}
            onPrev={handlePrev}
            isNextDisabled={isNextDisabled}
          />
        )}
      </div>
    </div>
  );
};

export default BuildPCQuizModal;
