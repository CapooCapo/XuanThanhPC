export const checkCompatibility = (components) => {
  const warnings = [];
  const errors = [];

  const { cpu, motherboard, psu, case: pcCase, gpu, cooler } = components;

  // CPU & Motherboard socket
  if (cpu && motherboard) {
    if (cpu.socket !== motherboard.socket) {
      errors.push(`Socket mismatch: CPU (${cpu.socket}) does not match Motherboard (${motherboard.socket})`);
    }
  }

  // Case Clearances
  if (pcCase) {
    if (gpu && gpu.gpu_length && pcCase.gpu_length && gpu.gpu_length > pcCase.gpu_length) {
      errors.push(`GPU Length (${gpu.gpu_length}mm) exceeds Case clearance (${pcCase.gpu_length}mm)`);
    }
    if (cooler && cooler.cooler_height && pcCase.cooler_height && cooler.cooler_height > pcCase.cooler_height) {
      errors.push(`Cooler Height (${cooler.cooler_height}mm) exceeds Case clearance (${pcCase.cooler_height}mm)`);
    }
  }

  // Power Consumption
  let totalPower = 0;
  Object.values(components).forEach(comp => {
    if (Array.isArray(comp)) {
      comp.forEach(c => totalPower += (c.power_draw || 0));
    } else if (comp) {
      totalPower += (comp.power_draw || 0);
    }
  });

  if (psu && psu.power_draw < totalPower) {
    errors.push(`Insufficient PSU Wattage. System needs ${totalPower}W, PSU is ${psu.power_draw}W`);
  } else if (psu && psu.power_draw < totalPower * 1.2) {
    warnings.push(`PSU Wattage (${psu.power_draw}W) is close to system draw (${totalPower}W). Consider upgrading for better efficiency and future-proofing.`);
  }

  return {
    isCompatible: errors.length === 0,
    errors,
    warnings,
    totalPower
  };
};
