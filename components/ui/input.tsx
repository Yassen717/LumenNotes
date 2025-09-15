/**
 * Basic input component with theme integration
 */

import React, { useState } from 'react';
import { Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';

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
  const colors = useColors();

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: multiline ? 12 : 10,
    minHeight: multiline ? 80 : 44,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingLeft: leftIcon ? 8 : 0,
    paddingRight: rightIcon ? 8 : 0,
    textAlignVertical: multiline ? 'top' : 'center',
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  });

  return (
    <View style={[getContainerStyle(), style]}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && <View>{leftIcon}</View>}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
}