export const calculateRecommendations = (products, answers) => {
  if (!answers || Object.keys(answers).length === 0) return [];

  return products.map(product => {
    let score = 0;
    const reasons = [];

    // 1. Purpose Match
    const purposeMap = {
      'gaming': 'Gaming',
      'office': 'Văn phòng',
      'design': 'Editing',
      'streaming': 'Streaming'
    };
    
    const productPurpose = product.purpose || '';
    
    // Map design to both Editing and Workstation
    if (answers.purpose === 'design' && (productPurpose.includes('Editing') || productPurpose.includes('Workstation'))) {
      score += 40;
      reasons.push('Tối ưu Đồ họa & Render');
    } else if (purposeMap[answers.purpose] === productPurpose) {
      score += 40;
      reasons.push(`Chuẩn nhu cầu ${productPurpose}`);
    } else if (answers.purpose === 'gaming' && productPurpose === 'Streaming') {
      score += 25; // Streaming PCs are excellent for gaming
    } else if (answers.purpose === 'streaming' && productPurpose === 'Gaming') {
      score += 15; // Gaming PCs can handle some streaming
    } else if (answers.purpose === 'office' && price < 15000000) {
      score += 20; // Budget PCs are fine for office
    }

    // 2. Budget Match
    const price = product.price;
    let budgetMatch = false;
    
    if (answers.budget === 'under_10m' && price < 10000000) budgetMatch = true;
    else if (answers.budget === '10_20m' && price >= 10000000 && price <= 20000000) budgetMatch = true;
    else if (answers.budget === '20_40m' && price > 20000000 && price <= 40000000) budgetMatch = true;
    else if (answers.budget === 'above_40m' && price > 40000000) budgetMatch = true;

    if (budgetMatch) {
      score += 35;
      reasons.push('Đúng ngân sách');
    } else {
      // Calculate mismatch penalty
      let penalty = 0;
      if (answers.budget === 'under_10m' && price >= 10000000) penalty = Math.floor((price - 10000000) / 2000000) * 5;
      else if (answers.budget === '10_20m') {
        if (price < 10000000) penalty = 5; // Under budget is okay, slight penalty
        if (price > 20000000) penalty = Math.floor((price - 20000000) / 2000000) * 10;
      }
      else if (answers.budget === '20_40m') {
        if (price < 20000000) penalty = 10;
        if (price > 40000000) penalty = Math.floor((price - 40000000) / 5000000) * 10;
      }
      
      // Cap penalty at -50
      penalty = Math.min(penalty, 50);
      score -= penalty;
    }

    // 3. Style / Preference Match
    const nameLower = product.name.toLowerCase();
    const specsString = product.specs.join(' ').toLowerCase();

    if (answers.style) {
      if (answers.style === 'rgb' && (nameLower.includes('gaming') || nameLower.includes('rgb') || productPurpose === 'Gaming')) {
        score += 15;
        reasons.push('Đậm chất RGB Gaming');
      }
      if (answers.style === 'performance' && (specsString.includes('i9') || specsString.includes('ryzen 9') || specsString.includes('4080') || specsString.includes('4090'))) {
        score += 20;
        reasons.push('Cấu hình siêu khủng');
      }
      if (answers.style === 'premium' && price >= 30000000) {
        score += 15;
        reasons.push('Cao cấp & Sang trọng');
      }
      if (answers.style === 'minimalist' && (productPurpose === 'Workstation' || productPurpose === 'Editing')) {
        score += 10;
        reasons.push('Thiết kế tối giản');
      }
    }

    // Give a small boost to items that match type (PC vs Laptop). Mock data is all PCs for now.
    if (answers.type === 'pc') {
      score += 10;
    } else if (answers.type === 'laptop') {
      score -= 20; // Penalize PCs if they specifically wanted a laptop (graceful fallback)
      if (reasons.length === 0) reasons.push('Alternative to Laptop');
    }

    return {
      ...product,
      recommendationScore: score,
      recommendationReasons: reasons
    };
  }).sort((a, b) => b.recommendationScore - a.recommendationScore);
};
