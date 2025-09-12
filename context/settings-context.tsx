/**
 * Settings Context Provider for managing app settings and preferences
 */

import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { DEFAULT_SETTINGS } from '../constants/storage-keys';
import { AppSettings, NotesViewMode, SettingsUpdatePayload, ThemeMode } from '../types';

/**
 * Settings state interface
 */
interface SettingsState extends AppSettings {
  loading: boolean;
  error: string | null;
}

/**
 * Settings actions
 */
type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'UPDATE_SETTING'; payload: { key: keyof AppSettings; value: any } }
  | { type: 'UPDATE_MULTIPLE_SETTINGS'; payload: SettingsUpdatePayload }
  | { type: 'RESET_SETTINGS' };

/**
 * Context interface
 */
interface SettingsContextType extends SettingsState {
  // Setting operations
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  updateMultipleSettings: (updates: SettingsUpdatePayload) => Promise<void>;
  resetSettings: () => Promise<void>;
  
  // Load and save
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  
  // Theme helpers
  toggleTheme: () => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  
  // View mode helpers
  toggleViewMode: () => Promise<void>;
  setViewMode: (mode: NotesViewMode) => Promise<void>;
  
  // Font size helpers
  increaseFontSize: () => Promise<void>;
  decreaseFontSize: () => Promise<void>;
  setFontSize: (size: 'small' | 'medium' | 'large') => Promise<void>;
  
  // Utility functions
  exportSettings: () => string;
  importSettings: (settingsJson: string) => Promise<void>;
}

/**
 * Initial state
 */
const initialState: SettingsState = {
  ...DEFAULT_SETTINGS,
  loading: false,
  error: null,
};

/**
 * Settings reducer
 */
function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_SETTINGS':
      return { ...state, ...action.payload };
      
    case 'UPDATE_SETTING':
      return { ...state, [action.payload.key]: action.payload.value };
      
    case 'UPDATE_MULTIPLE_SETTINGS':
      return { ...state, ...action.payload };
      
    case 'RESET_SETTINGS':
      return { ...initialState };
      
    default:
      return state;
  }
}

/**
 * Create context
 */
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Settings Context Provider component
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Setting operations
  const updateSetting = useCallback(async <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });
      // TODO: Implement with storage service
      console.log(`Updated setting ${key}:`, value);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update setting' });
      throw error;
    }
  }, []);

  const updateMultipleSettings = useCallback(async (updates: SettingsUpdatePayload): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_MULTIPLE_SETTINGS', payload: updates });
      // TODO: Implement with storage service
      console.log('Updated multiple settings:', updates);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update settings' });
      throw error;
    }
  }, []);

  const resetSettings = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'RESET_SETTINGS' });
      // TODO: Implement with storage service
      console.log('Reset settings to defaults');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to reset settings' });
      throw error;
    }
  }, []);

  // Load and save
  const loadSettings = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // TODO: Implement with storage service
      console.log('Loading settings from storage');
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load settings' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const saveSettings = useCallback(async (): Promise<void> => {
    try {
      // TODO: Implement with storage service
      console.log('Saving settings to storage');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to save settings' });
      throw error;
    }
  }, []);

  // Theme helpers
  const toggleTheme = useCallback(async (): Promise<void> => {
    const newTheme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
    await updateSetting('theme', newTheme);
  }, [state.theme, updateSetting]);

  const setTheme = useCallback(async (theme: ThemeMode): Promise<void> => {
    await updateSetting('theme', theme);
  }, [updateSetting]);

  // View mode helpers
  const toggleViewMode = useCallback(async (): Promise<void> => {
    const newMode: NotesViewMode = state.defaultViewMode === 'list' ? 'grid' : 'list';
    await updateSetting('defaultViewMode', newMode);
  }, [state.defaultViewMode, updateSetting]);

  const setViewMode = useCallback(async (mode: NotesViewMode): Promise<void> => {
    await updateSetting('defaultViewMode', mode);
  }, [updateSetting]);

  // Font size helpers
  const increaseFontSize = useCallback(async (): Promise<void> => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(state.fontSize);
    if (currentIndex < sizes.length - 1) {
      await updateSetting('fontSize', sizes[currentIndex + 1]);
    }
  }, [state.fontSize, updateSetting]);

  const decreaseFontSize = useCallback(async (): Promise<void> => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(state.fontSize);
    if (currentIndex > 0) {
      await updateSetting('fontSize', sizes[currentIndex - 1]);
    }
  }, [state.fontSize, updateSetting]);

  const setFontSize = useCallback(async (size: 'small' | 'medium' | 'large'): Promise<void> => {
    await updateSetting('fontSize', size);
  }, [updateSetting]);

  // Utility functions
  const exportSettings = useCallback((): string => {
    const settingsToExport: AppSettings = {
      theme: state.theme,
      defaultViewMode: state.defaultViewMode,
      autoSave: state.autoSave,
      fontSize: state.fontSize,
      hapticFeedback: state.hapticFeedback,
      showNotePreviews: state.showNotePreviews,
      previewLines: state.previewLines,
      dateFormat: state.dateFormat,
      defaultSort: state.defaultSort,
      backup: state.backup,
      privacy: state.privacy,
    };
    return JSON.stringify(settingsToExport, null, 2);
  }, [state]);

  const importSettings = useCallback(async (settingsJson: string): Promise<void> => {
    try {
      const parsedSettings = JSON.parse(settingsJson) as AppSettings;
      // Validate the imported settings
      // TODO: Add proper validation
      await updateMultipleSettings(parsedSettings);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid settings format' });
      throw new Error('Invalid settings format');
    }
  }, [updateMultipleSettings]);

  // Load settings on mount
  useEffect(() => {
    loadSettings().catch(console.error);
  }, [loadSettings]);

  // Auto-save settings when they change
  useEffect(() => {
    if (state.loading) return;
    
    const timeoutId = setTimeout(() => {
      saveSettings().catch(console.error);
    }, 1000); // Debounce saving

    return () => clearTimeout(timeoutId);
  }, [state, saveSettings]);

  // Context value
  const contextValue: SettingsContextType = {
    ...state,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    loadSettings,
    saveSettings,
    toggleTheme,
    setTheme,
    toggleViewMode,
    setViewMode,
    increaseFontSize,
    decreaseFontSize,
    setFontSize,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to use settings context
 */
export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

/**
 * Hook to get theme-related settings
 */
export function useThemeSettings() {
  const { theme, setTheme, toggleTheme } = useSettings();
  return { theme, setTheme, toggleTheme };
}

/**
 * Hook to get view-related settings
 */
export function useViewSettings() {
  const { 
    defaultViewMode, 
    fontSize, 
    showNotePreviews, 
    previewLines,
    setViewMode,
    setFontSize,
    increaseFontSize,
    decreaseFontSize
  } = useSettings();
  
  return {
    viewMode: defaultViewMode,
    fontSize,
    showNotePreviews,
    previewLines,
    setViewMode,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
  };
}