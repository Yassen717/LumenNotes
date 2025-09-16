/**
 * Enhanced button component with improved theme integration and styling
 */

import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useColors, useThemedStyles } from '../../context';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  hapticFeedback?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
  testID,
  hapticFeedback = true,
}: ButtonProps) {
  const themedStyles = useThemedStyles();
  const colors = useColors();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: size === 'small' ? 6 : size === 'large' ? 12 : 8,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 18,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      opacity: disabled || loading ? 0.6 : 1,
      minHeight: size === 'small' ? 32 : size === 'large' ? 48 : 40,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          shadowOpacity: 0.2,
          elevation: 3,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          shadowOpacity: 0.15,
          elevation: 2,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
          shadowOpacity: 0.2,
          elevation: 3,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
      marginLeft: icon ? 8 : 0,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'destructive':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseStyle,
          color: variant === 'ghost' ? colors.primary : colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const handlePress = () => {
    // Add haptic feedback if available and enabled
    if (hapticFeedback) {
      // TODO: Add expo-haptics feedback
    }
    onPress();
  };

  const getLoadingColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'destructive':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getLoadingColor()}
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}