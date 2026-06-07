import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { quizSteps } from '@/data/quizData';

export const useBuildPCQuiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const location = useLocation();

  const checkShouldShowQuiz = () => {
    const completedAt = localStorage.getItem('build_pc_quiz_completed_at');
    if (!completedAt) return true;
    
    const diff = Date.now() - Number(completedAt);
    return diff > 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    // Clean up old legacy item if it exists
    sessionStorage.removeItem('has_completed_pc_quiz');
    localStorage.removeItem('has_completed_pc_quiz');
    
    const shouldForceOpen = location.state?.openQuiz;

    if (checkShouldShowQuiz() || shouldForceOpen) {
      // Delay opening slightly for a better UX when entering the page
      const timer = setTimeout(() => {
        setIsOpen(true);
        setCurrentStep(0);
        setAnswers({});
        setIsFinished(false);
        
        if (shouldForceOpen) {
          window.history.replaceState({}, document.title);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.key]);

  const handleSelect = (stepId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
      localStorage.setItem('build_pc_quiz_completed_at', Date.now().toString());
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipQuiz = () => {
    setIsOpen(false);
    localStorage.setItem('build_pc_quiz_completed_at', Date.now().toString());
  };

  const closeQuiz = () => {
    setIsOpen(false);
    localStorage.setItem('build_pc_quiz_completed_at', Date.now().toString());
  };

  return {
    isOpen,
    currentStep,
    answers,
    isFinished,
    handleSelect,
    handleNext,
    handlePrev,
    skipQuiz,
    closeQuiz
  };
};
