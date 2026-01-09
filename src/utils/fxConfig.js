/**
 * Configuration for background FX based on theme and page
 * @param {string} theme - Theme: "pink", "rose-quartz", "ai-lab", etc.
 * @param {string} page - Page: "yearly" | "monthly" | "weekly" | "daily"
 * @param {boolean} isLoginPage - Whether this is the login page (reduced effects)
 * @returns {Object} Configuration object with counts, sizes, speeds, etc.
 */
export function getFXConfig(theme, page, isLoginPage = false) {
  // Page density multipliers
  const pageMultipliers = {
    yearly: { count: 0.7, speed: 0.8, size: 1.0 }, // Calm, fewer, slower
    monthly: { count: 0.85, speed: 0.9, size: 1.0 }, // Steady
    weekly: { count: 1.0, speed: 1.0, size: 1.0 }, // Active
    daily: { count: 1.2, speed: 1.1, size: 1.0 }, // Most alive but still subtle
  };

  const pageConfig = pageMultipliers[page] || pageMultipliers.weekly;
  
  // Greatly reduce effects on login page
  const loginMultiplier = isLoginPage ? { count: 0.1, speed: 1.0, size: 0.8 } : { count: 1.0, speed: 1.0, size: 1.0 };
  const effectiveConfig = {
    count: pageConfig.count * loginMultiplier.count,
    speed: pageConfig.speed * loginMultiplier.speed,
    size: pageConfig.size * loginMultiplier.size,
  };

  // Base configuration per theme
  const themeConfigs = {
    pink: {
      // Soft Pink theme: hearts + sparkles (improved visibility)
      heartCount: Math.round(10 * effectiveConfig.count), // Slightly fewer but larger
      sparkleCount: Math.round(6 * effectiveConfig.count),
      heartSizes: { 
        min: Math.round(18 * effectiveConfig.size), 
        max: Math.round(32 * effectiveConfig.size) 
      }, // Larger size variation (small, medium, occasional large)
      sparkleSizes: { min: 4, max: 8 },
      heartColors: [
        'rgba(244, 114, 182, 0.88)', // Higher opacity (85-90%)
        'rgba(236, 72, 153, 0.87)',
        'rgba(251, 113, 133, 0.89)',
        'rgba(244, 114, 182, 0.86)', // Variation for depth
      ],
      sparkleColors: ['rgba(255, 255, 255, 0.4)', 'rgba(244, 114, 182, 0.3)', 'rgba(251, 113, 133, 0.35)'],
      animationDuration: {
        min: 25 * effectiveConfig.speed, // Slower for graceful movement
        max: 35 * effectiveConfig.speed,
      },
      heartGlow: true, // Enable soft pink glow
    },
    'rose-quartz': {
      // Rose Quartz theme: hearts + sparkles (same as pink but with rose colors)
      heartCount: Math.round(10 * effectiveConfig.count),
      sparkleCount: Math.round(6 * effectiveConfig.count),
      heartSizes: { 
        min: Math.round(18 * effectiveConfig.size), 
        max: Math.round(32 * effectiveConfig.size) 
      },
      sparkleSizes: { min: 4, max: 8 },
      heartColors: [
        'rgba(232, 121, 249, 0.88)',
        'rgba(217, 70, 239, 0.87)',
        'rgba(245, 208, 254, 0.89)',
        'rgba(232, 121, 249, 0.86)',
      ],
      sparkleColors: ['rgba(255, 255, 255, 0.4)', 'rgba(232, 121, 249, 0.3)', 'rgba(245, 208, 254, 0.35)'],
      animationDuration: {
        min: 25 * effectiveConfig.speed,
        max: 35 * effectiveConfig.speed,
      },
      heartGlow: true,
    },
    'ai-lab': {
      // AI Lab theme: electric particles
      particleCount: Math.round(16 * effectiveConfig.count),
      lineCount: Math.round(6 * effectiveConfig.count),
      glowCount: Math.round(4 * effectiveConfig.count),
      particleSizes: { min: 3, max: 8 },
      lineLengths: { min: 20, max: 60 },
      glowSizes: { min: 30, max: 80 },
      particleColors: ['rgba(8, 145, 178, 0.2)', 'rgba(6, 182, 212, 0.25)', 'rgba(14, 165, 233, 0.18)'],
      lineColors: ['rgba(8, 145, 178, 0.15)', 'rgba(6, 182, 212, 0.2)'],
      glowColors: ['rgba(8, 145, 178, 0.1)', 'rgba(6, 182, 212, 0.12)'],
      animationDuration: {
        min: 15 * effectiveConfig.speed,
        max: 25 * effectiveConfig.speed,
      },
    },
    // Other themes use ai-lab base
    'midnight-ai': {
      particleCount: Math.round(16 * effectiveConfig.count),
      lineCount: Math.round(6 * effectiveConfig.count),
      glowCount: Math.round(4 * effectiveConfig.count),
      particleSizes: { min: 3, max: 8 },
      lineLengths: { min: 20, max: 60 },
      glowSizes: { min: 30, max: 80 },
      particleColors: ['rgba(59, 130, 246, 0.25)', 'rgba(37, 99, 235, 0.3)', 'rgba(96, 165, 250, 0.22)'],
      lineColors: ['rgba(59, 130, 246, 0.2)', 'rgba(37, 99, 235, 0.25)'],
      glowColors: ['rgba(59, 130, 246, 0.15)', 'rgba(37, 99, 235, 0.18)'],
      animationDuration: {
        min: 15 * effectiveConfig.speed,
        max: 25 * effectiveConfig.speed,
      },
    },
    'sage-reset': {
      particleCount: Math.round(16 * effectiveConfig.count),
      lineCount: Math.round(6 * effectiveConfig.count),
      glowCount: Math.round(4 * effectiveConfig.count),
      particleSizes: { min: 3, max: 8 },
      lineLengths: { min: 20, max: 60 },
      glowSizes: { min: 30, max: 80 },
      particleColors: ['rgba(74, 222, 128, 0.2)', 'rgba(34, 197, 94, 0.25)', 'rgba(134, 239, 172, 0.18)'],
      lineColors: ['rgba(74, 222, 128, 0.15)', 'rgba(34, 197, 94, 0.2)'],
      glowColors: ['rgba(74, 222, 128, 0.1)', 'rgba(34, 197, 94, 0.12)'],
      animationDuration: {
        min: 15 * effectiveConfig.speed,
        max: 25 * effectiveConfig.speed,
      },
    },
    'warm-neutral': {
      particleCount: Math.round(16 * effectiveConfig.count),
      lineCount: Math.round(6 * effectiveConfig.count),
      glowCount: Math.round(4 * effectiveConfig.count),
      particleSizes: { min: 3, max: 8 },
      lineLengths: { min: 20, max: 60 },
      glowSizes: { min: 30, max: 80 },
      particleColors: ['rgba(192, 132, 82, 0.2)', 'rgba(161, 98, 7, 0.25)', 'rgba(212, 165, 116, 0.18)'],
      lineColors: ['rgba(192, 132, 82, 0.15)', 'rgba(161, 98, 7, 0.2)'],
      glowColors: ['rgba(192, 132, 82, 0.1)', 'rgba(161, 98, 7, 0.12)'],
      animationDuration: {
        min: 15 * effectiveConfig.speed,
        max: 25 * effectiveConfig.speed,
      },
    },
    'lavender-tech': {
      particleCount: Math.round(16 * effectiveConfig.count),
      lineCount: Math.round(6 * effectiveConfig.count),
      glowCount: Math.round(4 * effectiveConfig.count),
      particleSizes: { min: 3, max: 8 },
      lineLengths: { min: 20, max: 60 },
      glowSizes: { min: 30, max: 80 },
      particleColors: ['rgba(167, 139, 250, 0.2)', 'rgba(139, 92, 246, 0.25)', 'rgba(196, 181, 253, 0.18)'],
      lineColors: ['rgba(167, 139, 250, 0.15)', 'rgba(139, 92, 246, 0.2)'],
      glowColors: ['rgba(167, 139, 250, 0.1)', 'rgba(139, 92, 246, 0.12)'],
      animationDuration: {
        min: 15 * effectiveConfig.speed,
        max: 25 * effectiveConfig.speed,
      },
    },
  };

  return themeConfigs[theme] || themeConfigs['ai-lab'];
}

