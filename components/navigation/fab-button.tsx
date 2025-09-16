/**
 * Floating Action Button component for quick actions
 */

import React from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useColors } from '../../context';

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  title?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function FAB({
  onPress,
  icon,
  title,
  size = 56,
  style,
  testID,
}: FABProps) {
  const colors = useColors();

  const getFABStyle = (): ViewStyle => ({
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  });

  const getIconStyle = () => ({
    fontSize: size * 0.4,
    color: '#FFFFFF',
  });

  const getTitleStyle = () => ({
    fontSize: size * 0.25,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  });

  return (
    <TouchableOpacity
      style={[getFABStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
      testID={testID}
    >
      {icon ? (
        icon
      ) : title ? (
        <Text style={getTitleStyle()}>{title}</Text>
      ) : (
        <Text style={getIconStyle()}>+</Text>
      )}
    </TouchableOpacity>
  );
}