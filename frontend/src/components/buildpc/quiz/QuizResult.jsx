import React, { useMemo } from 'react';

const QuizResult = ({ answers, onApply }) => {
  const recommendation = useMemo(() => {
    // Basic recommendation logic based on answers
    const purpose = answers['purpose'];
    const budget = answers['budget'];
    const type = answers['type'];
    
    let buildName = 'Premium Build';
    
    if (purpose === 'gaming') {
      if (budget === 'under_10m' || budget === '10_20m') buildName = 'Esports Gaming Build';
      else if (budget === '20_40m') buildName = 'RTX 4060/4070 Gaming Build';
      else buildName = 'Ultimate 4K Gaming Build';
    } else if (purpose === 'office') {
      buildName = 'Compact Office Build';
    } else if (purpose === 'design') {
      buildName = 'Creator Studio Build';
    } else if (purpose === 'streaming') {
      buildName = 'Streamer PRO Build';
    }
    
    return {
      title: type === 'laptop' ? `${buildName.replace('Build', 'Laptop')}` : buildName,
      description: 'Dựa trên nhu cầu và ngân sách của bạn, chúng tôi đã cấu hình sẵn những sản phẩm tốt nhất.'
    };
  }, [answers]);

  return (
    <div className="quiz-result">
      <div className="result-icon">✨</div>
      <h2>Phân tích hoàn tất!</h2>
      <p>Chúng tôi đã tìm thấy cấu hình hoàn hảo dành cho bạn.</p>
      
      <div className="recommendation-card">
        <h3>{recommendation.title}</h3>
        <p style={{ marginTop: '12px', fontSize: '1rem', marginBottom: 0 }}>
          {recommendation.description}
        </p>
      </div>

      <div>
        <button 
          className="btn-view-products" 
          onClick={() => onApply(answers)}
        >
          Xem sản phẩm đề xuất
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
