/**
 * Constants for AsyncStorage keys and app configuration
 */

/**
 * AsyncStorage keys
 */
export const STORAGE_KEYS = {
  // Notes data
  NOTES: '@LumenNotes/notes',
  NOTES_INDEX: '@LumenNotes/notes_index',
  
  // App settings
  SETTINGS: '@LumenNotes/settings',
  THEME: '@LumenNotes/theme',
  
  // User preferences
  ONBOARDING: '@LumenNotes/onboarding',
  VIEW_MODE: '@LumenNotes/view_mode',
  SORT_PREFERENCE: '@LumenNotes/sort_preference',
  
  // Cache
  SEARCH_CACHE: '@LumenNotes/search_cache',
  CATEGORIES_CACHE: '@LumenNotes/categories_cache',
  TAGS_CACHE: '@LumenNotes/tags_cache',
  
  // Backup
  LAST_BACKUP: '@LumenNotes/last_backup',
  BACKUP_DATA: '@LumenNotes/backup_data',
  
  // Analytics
  USAGE_STATS: '@LumenNotes/usage_stats',
  
  // Security
  APP_LOCK: '@LumenNotes/app_lock',
  BIOMETRIC_SETTINGS: '@LumenNotes/biometric_settings',
} as const;

/**
 * App configuration constants
 */
export const APP_CONFIG = {
  // Version
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  
  // Limits
  MAX_NOTES: 10000,
  MAX_NOTE_LENGTH: 100000, // characters
  MAX_TITLE_LENGTH: 200,
  MAX_TAGS_PER_NOTE: 10,
  MAX_TAG_LENGTH: 50,
  
  // Auto-save
  AUTO_SAVE_INTERVAL: 3000, // 3 seconds
  AUTO_SAVE_DEBOUNCE: 500, // 0.5 seconds
  
  // Search
  SEARCH_DEBOUNCE: 300, // 0.3 seconds
  MAX_SEARCH_RESULTS: 100,
  SEARCH_MIN_CHARS: 2,
  
  // UI
  ANIMATION_DURATION: 300,
  HAPTIC_FEEDBACK_ENABLED: true,
  SPLASH_SCREEN_DURATION: 2000,
  
  // Backup
  AUTO_BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  MAX_BACKUP_FILES: 5,
  
  // Cache
  CACHE_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_CACHE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Default app settings
 */
export const DEFAULT_SETTINGS = {
  theme: 'auto' as const,
  defaultViewMode: 'list' as const,
  autoSave: {
    enabled: true,
    intervalMs: APP_CONFIG.AUTO_SAVE_INTERVAL,
  },
  fontSize: 'medium' as const,
  hapticFeedback: true,
  showNotePreviews: true,
  previewLines: 3,
  dateFormat: 'relative' as const,
  defaultSort: {
    field: 'updatedAt' as const,
    order: 'desc' as const,
  },
  backup: {
    autoBackup: true,
    frequency: 'daily' as const,
    keepCount: 7,
  },
  privacy: {
    requireAuth: false,
    lockTimeout: 15, // minutes
  },
} as const;

/**
 * Default onboarding preferences
 */
export const DEFAULT_ONBOARDING = {
  hasCompletedOnboarding: false,
  skippedFeatures: [],
  preferredCategories: ['Personal', 'Work', 'Ideas'],
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // General
  UNKNOWN_ERROR: 'An unexpected error occurred',
  NETWORK_ERROR: 'Network connection error',
  
  // Storage
  STORAGE_FULL: 'Device storage is full',
  STORAGE_ERROR: 'Failed to save data',
  STORAGE_READ_ERROR: 'Failed to read data',
  
  // Notes
  NOTE_NOT_FOUND: 'Note not found',
  NOTE_SAVE_FAILED: 'Failed to save note',
  NOTE_DELETE_FAILED: 'Failed to delete note',
  NOTE_TOO_LONG: `Note content exceeds ${APP_CONFIG.MAX_NOTE_LENGTH} characters`,
  TITLE_TOO_LONG: `Title exceeds ${APP_CONFIG.MAX_TITLE_LENGTH} characters`,
  
  // Validation
  TITLE_REQUIRED: 'Note title is required',
  INVALID_DATE: 'Invalid date format',
  INVALID_COLOR: 'Invalid color format',
  
  // Limits
  MAX_NOTES_REACHED: `Maximum of ${APP_CONFIG.MAX_NOTES} notes allowed`,
  MAX_TAGS_REACHED: `Maximum of ${APP_CONFIG.MAX_TAGS_PER_NOTE} tags per note`,
  
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  NOTE_SAVED: 'Note saved successfully',
  NOTE_DELETED: 'Note deleted successfully',
  NOTE_RESTORED: 'Note restored successfully',
  BACKUP_CREATED: 'Backup created successfully',
  BACKUP_RESTORED: 'Backup restored successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;