import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CustomSplash } from '@/components/custom-splash';
import { AppProvider, useTheme } from '@/context';
import { useSplashState } from '@/hooks/splash-state';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark, theme } = useTheme();
  const showSplash = useSplashState(3000);

  // Update system UI colors when theme changes
  useEffect(() => {
    // Set the root background color to match theme
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  // Show custom splash screen
  if (showSplash) {
    return <CustomSplash onComplete={() => {}} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          {/* Hide native headers for legal pages to use custom in-page headers */}
          <Stack.Screen name="legal/privacy" options={{ headerShown: false }} />
          <Stack.Screen name="legal/terms" options={{ headerShown: false }} />
        </Stack>
        <StatusBar 
          style={isDark ? 'light' : 'dark'} 
          backgroundColor={theme.background}
          translucent={false}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
