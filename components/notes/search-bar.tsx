/**
 * Search bar component for filtering notes
 */

import React, { useCallback, useState } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';
import { Input } from '../ui';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  showSuggestions?: boolean;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function SearchBar({
  onSearch,
  onClear,
  placeholder = 'Search notes...',
  showSuggestions = false,
  suggestions = [],
  onSuggestionPress,
  style,
  testID,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const colors = useColors();

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    onSearch(text);
    setShowSuggestionsList(text.length > 0 && showSuggestions);
  }, [onSearch, showSuggestions]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setShowSuggestionsList(false);
    onClear();
  }, [onClear]);

  const handleSuggestionPress = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestionsList(false);
    onSearch(suggestion);
    onSuggestionPress?.(suggestion);
  }, [onSearch, onSuggestionPress]);

  const getContainerStyle = (): ViewStyle => ({
    position: 'relative',
    zIndex: 1,
  });

  const getSuggestionsStyle = (): ViewStyle => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  });

  const getSuggestionItemStyle = (): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  });

  const getSuggestionTextStyle = () => ({
    fontSize: 14,
    color: colors.text,
  });

  const getSearchIcon = () => (
    <View style={{ padding: 4 }}>
      <Text style={{ fontSize: 16, color: colors.textSecondary }}>🔍</Text>
    </View>
  );

  const getLayoutIcon = () => (
    <View style={{ padding: 4 }}>
      <Text style={{ fontSize: 16, color: colors.textSecondary }}>☰</Text>
    </View>
  );

  const getClearIcon = () => (
    <TouchableOpacity onPress={handleClear} style={{ padding: 4 }}>
      <Text style={{ fontSize: 16, color: colors.textSecondary }}>✕</Text>
    </TouchableOpacity>
  );

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase()) &&
    suggestion.toLowerCase() !== searchQuery.toLowerCase()
  ).slice(0, 5);

  return (
    <View style={[getContainerStyle(), style]}>
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={handleSearchChange}
        leftIcon={getSearchIcon()}
        rightIcon={searchQuery.length > 0 ? getClearIcon() : getLayoutIcon()}
        testID={testID}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {showSuggestionsList && filteredSuggestions.length > 0 && (
        <View style={getSuggestionsStyle()}>
          {filteredSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[
                getSuggestionItemStyle(),
                index === filteredSuggestions.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={getSuggestionTextStyle()}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}