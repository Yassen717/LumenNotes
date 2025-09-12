/**
 * Central export file for all context providers and hooks
 */

// Notes context
export * from './notes-context';

// Settings context
export * from './settings-context';

// Theme context
export * from './theme-context';

// Combined provider component
import React from 'react';
import { NotesProvider } from './notes-context';
import { SettingsProvider } from './settings-context';
import { ThemeProvider } from './theme-context';

/**
 * Combined provider that wraps all context providers
 * Use this at the root of your app to provide all contexts
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <NotesProvider>
          {children}
        </NotesProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}