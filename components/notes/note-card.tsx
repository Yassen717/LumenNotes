/**
 * Note card component for displaying individual notes in lists
 */

import React from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';
import { Note } from '../../types';
import { formatDate } from '../../utils';
import { Card } from '../ui';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
  showPreview?: boolean;
  previewLines?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function NoteCard({
  note,
  onPress,
  onLongPress,
  showPreview = true,
  previewLines = 3,
  style,
  testID,
}: NoteCardProps) {
  const colors = useColors();

  const getTitleStyle = () => ({
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  });

  const getPreviewStyle = () => ({
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  });

  const getMetaStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  });

  const getDateStyle = () => ({
    fontSize: 12,
    color: colors.textSecondary,
  });

  const getTagsStyle = () => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 4,
    marginBottom: 8,
  });

  const getTagStyle = () => ({
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 11,
    color: colors.primary,
  });

  const getCategoryStyle = () => ({
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    fontSize: 10,
    color: colors.accent,
    fontWeight: '500' as const,
  });

  const getPinIndicatorStyle = () => ({
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: colors.warning,
    borderRadius: 10,
    width: 8,
    height: 8,
  });

  const getCardStyle = (): ViewStyle => ({
    minHeight: 120,
    position: 'relative',
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
      style={[getCardStyle(), style]}
      testID={testID}
    >
      <TouchableOpacity
        onLongPress={onLongPress}
        delayLongPress={500}
        style={{ flex: 1 }}
      >
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
                {tag}
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
      </TouchableOpacity>
    </Card>
  );
}