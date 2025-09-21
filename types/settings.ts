/**
 * Application settings and preferences types
 */

/**
 * Theme configuration
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * App settings interface
 */
export interface AppSettings {
  /** Theme preference */
  theme: ThemeMode;
  
  /** Default view mode for notes */
  defaultViewMode: 'list' | 'grid';
  
  /** Auto-save settings */
  autoSave: {
    enabled: boolean;
    intervalMs: number;
  };
  
  /** Font size preference */
  fontSize: 'small' | 'medium' | 'large';
  
  /** Haptic feedback enabled */
  hapticFeedback: boolean;
  
  /** Show note previews in list */
  showNotePreviews: boolean;
  
  /** Number of lines to show in preview */
  previewLines: number;
  
  /** Date format preference */
  dateFormat: 'relative' | 'absolute';
  
  /** Default note sorting */
  defaultSort: {
    field: 'createdAt' | 'updatedAt' | 'title';
    order: 'asc' | 'desc';
  };
  
  /** Backup settings */
  backup: {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    keepCount: number;
  };
  
  /** Privacy settings */
  privacy: {
    requireAuth: boolean;
    lockTimeout: number; // minutes
  };
}

/**
 * User preferences for onboarding
 */
export interface OnboardingPreferences {
  hasCompletedOnboarding: boolean;
  skippedFeatures: string[];
  preferredCategories: string[];
}

/**
 * Export/Import settings
 */
export interface ExportSettings {
  format: 'json' | 'markdown' | 'text';
  includeMetadata: boolean;
  includeTags: boolean;
  includeDeleted: boolean;
}

/**
 * Notification preferences
 */
export interface NotificationSettings {
  enabled: boolean;
  reminders: boolean;
  backupComplete: boolean;
  syncComplete: boolean;
}

/**
 * Storage settings
 */
export interface StorageSettings {
  maxNotes: number;
  maxFileSize: number; // MB
  cacheSize: number; // MB
  clearCacheOnStart: boolean;
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  largeFonts: boolean;
}

/**
 * Complete app configuration
 */
export interface AppConfig extends AppSettings {
  onboarding: OnboardingPreferences;
  notifications: NotificationSettings;
  storage: StorageSettings;
  accessibility: AccessibilitySettings;
}

/**
 * Settings update payload
 */
export type SettingsUpdatePayload = Partial<AppSettings>;
