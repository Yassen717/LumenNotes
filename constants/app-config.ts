/**
 * Application configuration and constants
 */


/**
 * App metadata
 */
export const APP_INFO = {
  name: 'LumenNotes',
  displayName: 'Lumen Notes',
  version: '1.0.0',
  description: 'A modern, elegant note-taking app',
  author: 'LumenNotes Team',
  website: 'https://lumennotes.app',
  supportEmail: 'support@lumennotes.app',
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  CLOUD_SYNC: false,
  VOICE_NOTES: false,
  RICH_TEXT_EDITOR: false,
  COLLABORATION: false,
  ANALYTICS: true,
  BIOMETRIC_LOCK: false,
  EXPORT_PDF: false,
  IMPORT_FROM_OTHER_APPS: false,
} as const;

/**
 * UI Constants
 */
export const UI_CONSTANTS = {
  // Spacing
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  BORDER_RADIUS: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  // Font sizes
  FONT_SIZES: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    hero: 32,
  },
  
  // Icon sizes
  ICON_SIZES: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  },
  
  // Z-index levels
  Z_INDEX: {
    backdrop: 1000,
    modal: 1100,
    overlay: 1200,
    toast: 1300,
    tooltip: 1400,
  },
  
  // Animation durations (ms)
  ANIMATION: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
} as const;

/**
 * Color constants
 */
export const COLORS = {
  // Note colors for categorization
  NOTE_COLORS: [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
    '#BB8FCE', // Light Purple
    '#85C1E9', // Light Blue
  ],
  
  // System colors
  SYSTEM: {
    error: '#FF4757',
    warning: '#FFA502',
    success: '#2ED573',
    info: '#3742FA',
  },
} as const;

/**
 * Performance thresholds
 */
export const PERFORMANCE = {
  // Virtualization thresholds
  VIRTUALIZE_THRESHOLD: 100, // notes count
  
  // Debounce times
  SEARCH_DEBOUNCE: 300,
  AUTOSAVE_DEBOUNCE: 1000,
  
  // Batch sizes
  SEARCH_BATCH_SIZE: 50,
  RENDER_BATCH_SIZE: 20,
  
  // Memory limits
  MAX_RENDERED_NOTES: 200,
  MAX_SEARCH_CACHE: 1000,
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  NOTE: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MAX_LENGTH: 100000,
  },
  
  TAG: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    MAX_PER_NOTE: 10,
    ALLOWED_CHARS: /^[a-zA-Z0-9\-_\s]+$/,
  },
  
  CATEGORY: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    ALLOWED_CHARS: /^[a-zA-Z0-9\-_\s]+$/,
  },
  
  SEARCH: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
} as const;

/**
 * Default categories for new users
 */
export const DEFAULT_CATEGORIES = [
  'Personal',
  'Work',
  'Ideas',
  'Tasks',
  'Journal',
  'Learning',
  'Projects',
  'Recipes',
  'Travel',
  'Health',
] as const;

/**
 * Export formats
 */
export const EXPORT_FORMATS = {
  JSON: {
    extension: '.json',
    mimeType: 'application/json',
    label: 'JSON',
  },
  MARKDOWN: {
    extension: '.md',
    mimeType: 'text/markdown',
    label: 'Markdown',
  },
  TEXT: {
    extension: '.txt',
    mimeType: 'text/plain',
    label: 'Plain Text',
  },
} as const;

/**
 * Keyboard shortcuts (for web)
 */
export const SHORTCUTS = {
  NEW_NOTE: 'cmd+n',
  SEARCH: 'cmd+f',
  SAVE: 'cmd+s',
  DELETE: 'cmd+backspace',
  TOGGLE_PIN: 'cmd+p',
  SETTINGS: 'cmd+comma',
  BOLD: 'cmd+b',
  ITALIC: 'cmd+i',
  UNDERLINE: 'cmd+u',
} as const;