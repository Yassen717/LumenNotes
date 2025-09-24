/**
 * Enhanced note card component with improved layout and styling
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context';
import { Note } from '../../types';
import { formatDate } from '../../utils';
import { Card } from '../ui';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
  onToggleFavorite?: () => void;
  showPreview?: boolean;
  previewLines?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function NoteCard({
  note,
  onPress,
  onLongPress,
  onToggleFavorite,
  showPreview = true,
  previewLines = 3,
  style,
  testID,
}: NoteCardProps) {
  const { theme: colors } = useTheme();

  const getTitleStyle = () => ({
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  });

  const getPreviewStyle = () => ({
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  });

  const getMetaStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    zIndex: 1,
  });

  const getDateStyle = () => ({
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  });

  const getTagsStyle = () => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
    marginBottom: 10,
  });

  const getTagStyle = () => ({
    backgroundColor: colors.accent + '25',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    color: colors.accent,
    fontWeight: '500' as const,
  });

  const getCategoryStyle = () => ({
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600' as const,
  });

  const getColorDotStyle = () => ({
    position: 'absolute' as const,
    bottom: 10,
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: note.color || '#FF6B6B',
    zIndex: 0,
  });

  const getPinIndicatorStyle = () => ({
    position: 'absolute' as const,
    top: 12,
    right: 12,
    backgroundColor: colors.warning,
    borderRadius: 8,
    width: 6,
    height: 6,
  });

  const getFavoriteButtonContainer = (): ViewStyle => ({
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.surface + 'AA',
  });

  const getCardStyle = (): ViewStyle => ({
    minHeight: 135,
    position: 'relative',
    borderRadius: 18,
    padding: 14,
    paddingBottom: 18,
    backgroundColor: colors.surface,
    ...(note.color && {
      borderLeftWidth: 4,
      borderLeftColor: note.color,
    }),
  });

  const truncateText = (text: string, maxLines: number): string => {
    const words = text.split(' ');
    const wordsPerLine = 8; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <Card
      onPress={onPress}
      onLongPress={onLongPress}
      style={[getCardStyle(), style]}
      shadow={true}
      elevated={note.isPinned}
      variant={note.isPinned ? 'filled' : 'default'}
      testID={testID}
    >
      {onToggleFavorite && (
        <TouchableOpacity
          onPress={onToggleFavorite}
          accessibilityLabel={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={getFavoriteButtonContainer()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          testID={`favorite-toggle-${note.id}`}
        >
          <MaterialIcons
            name={note.isFavorite ? 'favorite' : 'favorite-border'}
            size={18}
            color={note.isFavorite ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      )}
      {note.isPinned && <View style={getPinIndicatorStyle()} />}
      
      <Text style={getTitleStyle()} numberOfLines={2}>
        {note.title}
      </Text>
      
      {showPreview && note.content && (
        <Text style={getPreviewStyle()} numberOfLines={previewLines}>
          {truncateText(note.content, previewLines)}
        </Text>
      )}
      
      {note.tags.length > 0 && (
        <View style={getTagsStyle()}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} style={getTagStyle()}>
              #{tag}
            </Text>
          ))}
          {note.tags.length > 3 && (
            <Text style={getTagStyle()}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}
      
      <View style={getMetaStyle()}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {note.category && (
            <Text style={getCategoryStyle()}>{note.category}</Text>
          )}
        </View>
        
        <Text style={getDateStyle()}>
          {formatDate(note.updatedAt, 'relative')}
        </Text>
      </View>
      
      <View style={getColorDotStyle()} />
    </Card>
  );
}