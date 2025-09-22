/**
 * Theme Context Provider for managing theme state and colors
 * Integrates with existing theme system and color scheme hooks
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from '../hooks/use-color-scheme';
import { ColorTheme, ThemeMode } from '../types';
import { useSettings } from './settings-context';

/**
 * Light theme colors
 */
const lightTheme: ColorTheme = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F7F8FA',
  text: '#0F172A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  info: '#007AFF',
};

/**
 * Dark theme colors
 */
const darkTheme: ColorTheme = {
  primary: '#60A5FA',
  secondary: '#818CF8',
  accent: '#FBBF24',
  background: '#0F172A',
  surface: '#111827',
  text: '#E5E7EB',
  textSecondary: '#9CA3AF',
  border: '#272B36',
  error: '#FF453A',
  warning: '#FF9F0A',
  success: '#30D158',
  info: '#64D2FF',
};

/**
 * Theme context interface
 */
interface ThemeContextType {
  isDark: boolean;
  theme: ColorTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  
  // Helper functions
  getColor: (colorKey: keyof ColorTheme) => string;
  getBackgroundStyle: () => { backgroundColor: string };
  getTextStyle: (variant?: 'primary' | 'secondary') => { color: string };
  getBorderStyle: () => { borderColor: string };
  
  // Dynamic colors based on content
  getContrastColor: (backgroundColor: string) => string;
  adjustOpacity: (color: string, opacity: number) => string;
}

/**
 * Create context
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Context Provider component
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { theme: settingsTheme, setTheme: setSettingsTheme } = useSettings();
  
  // Determine if dark mode should be active
  const isDark = settingsTheme === 'dark' || 
    (settingsTheme === 'auto' && systemColorScheme === 'dark');
  
  // Get current theme colors
  const theme = isDark ? darkTheme : lightTheme;
  
  // Force re-render when theme changes
  useEffect(() => {
    // This will trigger a re-render when theme changes
  }, [isDark, theme]);
  
  // Set theme mode
  const setThemeMode = (mode: ThemeMode) => {
    setSettingsTheme(mode);
  };
  
  // Toggle theme
  const toggleTheme = () => {
    if (settingsTheme === 'auto') {
      setThemeMode('light');
    } else if (settingsTheme === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('auto');
    }
  };
  
  // Helper functions
  const getColor = (colorKey: keyof ColorTheme): string => {
    return theme[colorKey];
  };
  
  const getBackgroundStyle = () => ({
    backgroundColor: theme.background,
  });
  
  const getTextStyle = (variant: 'primary' | 'secondary' = 'primary') => ({
    color: variant === 'primary' ? theme.text : theme.textSecondary,
  });
  
  const getBorderStyle = () => ({
    borderColor: theme.border,
  });
  
  // Get contrast color (black or white) based on background
  const getContrastColor = (backgroundColor: string): string => {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };
  
  // Get text color based on theme
  const getTextColor = (variant: 'primary' | 'secondary' = 'primary'): string => {
    return variant === 'primary' ? theme.text : theme.textSecondary;
  };
  
  // Adjust color opacity
  const adjustOpacity = (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  // Context value
  const contextValue: ThemeContextType = {
    isDark,
    theme,
    themeMode: settingsTheme,
    setThemeMode,
    toggleTheme,
    getColor,
    getBackgroundStyle,
    getTextStyle,
    getBorderStyle,
    getContrastColor,
    adjustOpacity,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get themed styles for common components
 */
export function useThemedStyles() {
  const { theme, getBackgroundStyle, getTextStyle, getBorderStyle } = useTheme();
  
  return {
    container: {
      ...getBackgroundStyle(),
      flex: 1,
    },
    
    surface: {
      backgroundColor: theme.surface,
      borderRadius: 8,
    },
    
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      ...getBorderStyle(),
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
    text: {
      primary: getTextStyle('primary'),
      secondary: getTextStyle('secondary'),
    },
    
    button: {
      primary: {
        backgroundColor: theme.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
    },
    
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      ...getBorderStyle(),
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      ...getTextStyle('primary'),
    },
    
    separator: {
      height: 1,
      backgroundColor: theme.border,
    },
  };
}

/**
 * Hook to get themed colors
 */
export function useColors() {
  const { theme } = useTheme();
  return theme;
}