import { create } from 'zustand';

const calculateMetrics = (components) => {
  let totalPrice = 0;
  let totalPowerDraw = 0;
  let warnings = [];
  
  // Helper to safely process a component or array of components
  const processComponent = (comp) => {
    if (!comp) return;
    if (Array.isArray(comp)) {
      comp.forEach(c => {
        if (c.price) totalPrice += Number(c.price);
        if (c.wattage) totalPowerDraw += Number(c.wattage);
      });
    } else {
      if (comp.price) totalPrice += Number(comp.price);
      if (comp.wattage) totalPowerDraw += Number(comp.wattage);
    }
  };

  Object.values(components).forEach(processComponent);

  // Compatibility Checks
  const cpu = components.cpu;
  const mb = components.motherboard;
  const psu = components.psu;

  if (cpu && mb) {
    const cpuSocket = cpu.specifications?.socket;
    const mbSocket = mb.specifications?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      warnings.push(`Cảnh báo: CPU Socket (${cpuSocket}) không tương thích với Mainboard Socket (${mbSocket})!`);
    }
  }

  if (psu && psu.specifications?.max_wattage) {
    if (totalPowerDraw > psu.specifications.max_wattage * 0.9) {
      warnings.push(`Cảnh báo: Nguồn điện (PSU) quá yếu so với tổng công suất tiêu thụ (${totalPowerDraw}W)!`);
    }
  } else if (totalPowerDraw > 0 && !psu) {
    warnings.push('Gợi ý: Cấu hình của bạn cần một bộ nguồn (PSU) để hoạt động.');
  }

  // FPS Predictions & Scores
  const gpu = components.gpu;
  let fpsPredictions = {};
  let gamingScore = 0;
  let productivityScore = 0;

  if (gpu && cpu) {
    gamingScore = Math.floor((gpu.gaming_score * 0.7) + (cpu.gaming_score * 0.3));
    productivityScore = Math.floor((cpu.productivity_score * 0.7) + (gpu.productivity_score * 0.3));

    const baseFps = gpu.specifications?.baseline_fps || 100;
    const multiplier = (cpu.gaming_score || 80) / 100;
    const actualFps = Math.floor(baseFps * multiplier);

    fpsPredictions = {
      'CS2': Math.floor(actualFps * 1.5),
      'Valorant': Math.floor(actualFps * 1.8),
      'GTA V': Math.floor(actualFps * 1.2),
      'Cyberpunk 2077': Math.floor(actualFps * 0.6),
      'Black Myth: Wukong': Math.floor(actualFps * 0.5)
    };
  }

  return {
    totalPrice,
    totalPowerDraw,
    warnings,
    gamingScore,
    productivityScore,
    fpsPredictions
  };
};

export const usePCBuilderStore = create((set, get) => ({
  selectedComponents: {
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: [],
    ssd: [],
    hdd: [],
    psu: null,
    cooler: null,
    case: null,
    fans: [],
  },
  hoveredSlot: null,
  cameraPosition: { x: 0, y: 0, z: 5 },
  metrics: {
    totalPrice: 0,
    totalPowerDraw: 0,
    warnings: [],
    gamingScore: 0,
    productivityScore: 0,
    fpsPredictions: {},
  },

  setHoveredSlot: (slot) => set({ hoveredSlot: slot }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  addComponent: (type, component) => set((state) => {
    if (!type || !component) return state;
    const newComponents = { ...state.selectedComponents };
    
    if (['ram', 'ssd', 'hdd', 'fans'].includes(type)) {
      newComponents[type] = [...(newComponents[type] || []), component];
    } else {
      newComponents[type] = component;
    }

    const newMetrics = calculateMetrics(newComponents);
    return { selectedComponents: newComponents, metrics: newMetrics };
  }),

  removeComponent: (type, id) => set((state) => {
    if (!type) return state;
    const newComponents = { ...state.selectedComponents };
    
    if (['ram', 'ssd', 'hdd', 'fans'].includes(type)) {
      newComponents[type] = (newComponents[type] || []).filter(c => c?.id !== id);
    } else {
      newComponents[type] = null;
    }

    const newMetrics = calculateMetrics(newComponents);
    return { selectedComponents: newComponents, metrics: newMetrics };
  }),

  loadPreset: (componentsMap) => set((state) => {
    // componentsMap contains populated objects instead of just IDs for simplicity in this demo
    const newComponents = {
      cpu: null, gpu: null, motherboard: null, psu: null, cooler: null, case: null,
      ram: [], ssd: [], hdd: [], fans: [],
      ...componentsMap
    };
    const newMetrics = calculateMetrics(newComponents);
    return { selectedComponents: newComponents, metrics: newMetrics };
  }),

  resetBuilder: () => set({
    selectedComponents: { cpu: null, gpu: null, motherboard: null, ram: [], ssd: [], hdd: [], psu: null, cooler: null, case: null, fans: [] },
    metrics: { totalPrice: 0, totalPowerDraw: 0, warnings: [], gamingScore: 0, productivityScore: 0, fpsPredictions: {} }
  }),
}));
