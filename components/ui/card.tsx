/**
 * Card component with theme integration
 */

import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  margin?: number;
  shadow?: boolean;
  testID?: string;
}

export function Card({
  children,
  onPress,
  style,
  padding = 16,
  margin = 0,
  shadow = true,
  testID,
}: CardProps) {
  const colors = useColors();

  const getCardStyle = (): ViewStyle => ({
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding,
    margin,
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow && {
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  });

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
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