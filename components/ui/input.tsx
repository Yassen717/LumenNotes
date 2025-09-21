/**
 * Enhanced input component with improved theme integration and styling
 */

import React, { useState } from 'react';
import { Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  autoFocus = false,
  secureTextEntry = false,
  error,
  disabled = false,
  style,
  inputStyle,
  testID,
  leftIcon,
  rightIcon,
  onRightIconPress,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme: colors } = useTheme();

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 20,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 14 : 12,
    minHeight: multiline ? 100 : 48,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isFocused ? 0.1 : 0.05,
    shadowRadius: 2,
    elevation: isFocused ? 2 : 1,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    paddingLeft: leftIcon ? 10 : 0,
    paddingRight: rightIcon ? 10 : 0,
    textAlignVertical: multiline ? 'top' : 'center',
    paddingTop: multiline ? 4 : 0,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: 13,
    color: colors.error,
    marginTop: 6,
    fontWeight: '500',
  });

  return (
    <View style={[getContainerStyle(), style]}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary + '99'}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
          selectionColor={colors.primary}
        />
        
        {rightIcon && (
          <TouchableOpacity 
            onPress={onRightIconPress} 
            disabled={!onRightIconPress}
            style={{ marginLeft: 8, padding: 4 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
}