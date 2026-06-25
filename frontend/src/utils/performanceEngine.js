export const calculatePerformance = (components) => {
  let gamingScore = 0;
  let productivityScore = 0;
  let aiScore = 0;
  
  const { cpu, gpu, ram } = components;

  if (cpu && gpu) {
    // Basic weighting: GPU heavily impacts gaming, CPU impacts productivity/AI
    gamingScore = ((gpu.gaming_score || 0) * 0.7) + ((cpu.gaming_score || 0) * 0.3);
    productivityScore = ((cpu.productivity_score || 0) * 0.6) + ((gpu.productivity_score || 0) * 0.4);
    aiScore = ((gpu.productivity_score || 0) * 0.8) + ((cpu.productivity_score || 0) * 0.2); // AI heavily relies on GPU
  }

  // Bottleneck estimation (simple logic)
  let bottleneck = null;
  if (cpu && gpu) {
    const ratio = (cpu.gaming_score || 1) / (gpu.gaming_score || 1);
    if (ratio < 0.7) {
      bottleneck = "CPU Bottleneck: Your CPU is too weak for this GPU.";
    } else if (ratio > 1.4) {
      bottleneck = "GPU Bottleneck: Your GPU is too weak for this CPU.";
    }
  }

  // RAM penalty
  const totalRam = ram.length * 16; // Assuming 16GB per stick for simplicity if not defined
  if (totalRam < 16 && gamingScore > 0) {
    gamingScore -= 1;
    bottleneck = "RAM Bottleneck: Consider at least 16GB for modern gaming.";
  }

  // Normalize scores to 10
  const normalize = (score) => Math.min(Math.max((score / 10).toFixed(1), 0), 10);

  return {
    gamingScore: normalize(gamingScore),
    productivityScore: normalize(productivityScore),
    aiScore: normalize(aiScore),
    fpsPredictions: {
      valorant: Math.floor(gamingScore * 80),
      cs2: Math.floor(gamingScore * 50),
      apex: Math.floor(gamingScore * 25),
      gta5: Math.floor(gamingScore * 20),
      cyberpunk: Math.floor(gamingScore * 12),
    },
    bottleneck
  };
};
