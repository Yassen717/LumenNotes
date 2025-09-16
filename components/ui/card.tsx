/**
 * Enhanced card component with improved theme integration and styling
 */

import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  margin?: number;
  shadow?: boolean;
  elevated?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  testID?: string;
}

export function Card({
  children,
  onPress,
  onLongPress,
  style,
  padding = 16,
  margin = 0,
  shadow = true,
  elevated = false,
  variant = 'default',
  testID,
}: CardProps) {
  const colors = useColors();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: variant === 'filled' ? colors.primary + '10' : colors.surface,
      borderRadius: 14,
      padding,
      margin,
      borderWidth: variant === 'outlined' ? 1.5 : 0,
      borderColor: variant === 'outlined' ? colors.border : 'transparent',
    };

    if (shadow && variant !== 'outlined') {
      baseStyle.shadowColor = colors.text;
      baseStyle.shadowOffset = { width: 0, height: elevated ? 4 : 2 };
      baseStyle.shadowOpacity = elevated ? 0.15 : 0.08;
      baseStyle.shadowRadius = elevated ? 8 : 4;
      baseStyle.elevation = elevated ? 6 : 3;
    }

    return baseStyle;
  };

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} testID={testID}>
      {children}
    </View>
  );
}