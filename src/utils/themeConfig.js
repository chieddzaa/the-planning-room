/**
 * Scalable Theme Configuration System
 * Defines all available themes with their color schemes and properties
 */

export const THEMES = {
  // Existing themes
  'soft-pink': {
    id: 'soft-pink',
    name: 'Soft Pink',
    displayName: 'soft pink',
    internalId: 'pink', // Maps to data-theme="pink"
    category: 'pink',
    description: 'For the girlies',
    buttonGradient: {
      default: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)',
      hover: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
    },
    buttonShadow: '0 4px 12px rgba(244, 114, 182, 0.25)',
    buttonHoverShadow: '0 6px 16px rgba(244, 114, 182, 0.35)',
    buttonFocusRing: '0 0 0 3px rgba(244, 114, 182, 0.2)',
    showHearts: true,
  },
  'ai-lab': {
    id: 'ai-lab',
    name: 'AI Lab',
    displayName: 'ai lab',
    internalId: 'ai-lab',
    category: 'neutral',
    description: 'For the guys',
    buttonGradient: {
      default: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      hover: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    buttonShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
    buttonHoverShadow: '0 6px 16px rgba(139, 92, 246, 0.35)',
    buttonFocusRing: '0 0 0 3px rgba(139, 92, 246, 0.2)',
    showHearts: false,
  },
  // Future themes
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    displayName: 'rose quartz',
    internalId: 'pink', // Uses pink theme base
    category: 'pink',
    description: 'Elevated pink',
    buttonGradient: {
      default: 'linear-gradient(135deg, #f5c2e7 0%, #e879f9 100%)',
      hover: 'linear-gradient(135deg, #e879f9 0%, #d946ef 100%)',
    },
    buttonShadow: '0 4px 12px rgba(232, 121, 249, 0.25)',
    buttonHoverShadow: '0 6px 16px rgba(232, 121, 249, 0.35)',
    buttonFocusRing: '0 0 0 3px rgba(232, 121, 249, 0.2)',
    showHearts: true,
  },
  'midnight-ai': {
    id: 'midnight-ai',
    name: 'Midnight AI',
    displayName: 'midnight ai',
    internalId: 'ai-lab', // Uses ai-lab theme base
    category: 'dark',
    description: 'Dark + electric accents',
    buttonGradient: {
      default: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      hover: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    },
    buttonShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    buttonHoverShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
    buttonFocusRing: '0 0 0 3px rgba(59, 130, 246, 0.25)',
    showHearts: false,
  },
  'sage-reset': {
    id: 'sage-reset',
    name: 'Sage Reset',
    displayName: 'sage reset',
    internalId: 'ai-lab', // Uses ai-lab theme base
    category: 'wellness',
    description: 'Green wellness',
    buttonGradient: {
      default: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
      hover: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    },
    buttonShadow: '0 4px 12px rgba(74, 222, 128, 0.25)',
    buttonHoverShadow: '0 6px 16px rgba(74, 222, 128, 0.35)',
    buttonFocusRing: '0 0 0 3px rgba(74, 222, 128, 0.2)',
    showHearts: false,
  },
  'warm-neutral': {
    id: 'warm-neutral',
    name: 'Warm Neutral',
    displayName: 'warm neutral',
    internalId: 'ai-lab', // Uses ai-lab theme base
    category: 'neutral',
    description: 'Beige / sand',
    buttonGradient: {
      default: 'linear-gradient(135deg, #d4a574 0%, #c08452 100%)',
      hover: 'linear-gradient(135deg, #c08452 0%, #a16207 100%)',
    },
    buttonShadow: '0 4px 12px rgba(192, 132, 82, 0.25)',
    buttonHoverShadow: '0 6px 16px rgba(192, 132, 82, 0.35)',
    buttonFocusRing: '0 0 0 3px rgba(192, 132, 82, 0.2)',
    showHearts: false,
  },
  'lavender-tech': {
    id: 'lavender-tech',
    name: 'Lavender Tech',
    displayName: 'lavender tech',
    internalId: 'ai-lab', // Uses ai-lab theme base
    category: 'purple',
    description: 'Soft purple',
    buttonGradient: {
      default: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
      hover: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    },
    buttonShadow: '0 4px 12px rgba(167, 139, 250, 0.25)',
    buttonHoverShadow: '0 6px 16px rgba(167, 139, 250, 0.35)',
    buttonFocusRing: '0 0 0 3px rgba(167, 139, 250, 0.2)',
    showHearts: false,
  },
};

/**
 * Get theme configuration by ID
 */
export function getThemeConfig(themeId) {
  return THEMES[themeId] || THEMES['ai-lab'];
}

/**
 * Get all available themes
 */
export function getAllThemes() {
  return Object.values(THEMES);
}

/**
 * Get themes by category
 */
export function getThemesByCategory(category) {
  return Object.values(THEMES).filter(theme => theme.category === category);
}

/**
 * Check if theme should show hearts
 */
export function shouldShowHearts(themeId) {
  const theme = getThemeConfig(themeId);
  return theme?.showHearts || false;
}

