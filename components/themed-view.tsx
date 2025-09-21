import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'background' | 'surface';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  variant = 'background',
  ...otherProps 
}: ThemedViewProps) {
  const { theme } = useTheme();
  
  // Use custom colors if provided, otherwise use theme colors
  const backgroundColor = lightColor && darkColor 
    ? (theme.background === '#000000' ? darkColor : lightColor)
    : variant === 'surface' ? theme.surface : theme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
