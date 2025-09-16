/**
 * Note editor component for creating and editing notes
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';
import { CreateNoteInput, Note, UpdateNoteInput } from '../../types';
import { validateAndSanitizeNote } from '../../utils';
import { Input } from '../ui';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: CreateNoteInput | UpdateNoteInput) => Promise<void>;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
  testID?: string;
}

export function NoteEditor({
  note,
  onSave,
  onCancel,
  style,
  autoFocus = true,
  testID,
}: NoteEditorProps) {
  const colors = useColors();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || '');
  const [tags, setTags] = useState(note?.tags.join(', ') || '');
  const [loading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasContentChanges = 
      title !== (note?.title || '') ||
      content !== (note?.content || '') ||
      category !== (note?.category || '') ||
      tags !== (note?.tags.join(', ') || '');
    
    setHasChanges(hasContentChanges);
  }, [title, content, category, tags, note]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const noteData = note
        ? ({
            id: note.id,
            title: title.trim(),
            content: content.trim(),
            category: category.trim() || undefined,
            tags: tagsArray,
          } as UpdateNoteInput)
        : ({
            title: title.trim(),
            content: content.trim(),
            category: category.trim() || undefined,
            tags: tagsArray,
          } as CreateNoteInput);

      // Validate and sanitize the data
      const { sanitized, validation } = validateAndSanitizeNote(noteData);
      
      if (!validation.isValid) {
        Alert.alert('Validation Error', validation.errors.join('\n'));
        return;
      }

      await onSave(sanitized);
      setHasChanges(false);
    } catch (error) {
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to save note'
      );
    } finally {
      setSaving(false);
    }
  }, [title, content, category, tags, note, onSave]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to cancel?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onCancel },
        ]
      );
    } else {
      onCancel();
    }
  }, [hasChanges, onCancel]);

  const getContainerStyle = (): ViewStyle => ({
    flex: 1,
    backgroundColor: colors.background,
  });

  const getContentStyle = (): ViewStyle => ({
    flex: 1,
    padding: 16,
  });

  return (
    <View style={[getContainerStyle(), style]} testID={testID}>
      <ScrollView 
        style={getContentStyle()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title"
          placeholder="Enter note title..."
          value={title}
          onChangeText={setTitle}
          autoFocus={autoFocus}
          maxLength={200}
          testID="note-title-input"
        />

        <Input
          label="Content"
          placeholder="Start writing your note..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={10}
          maxLength={100000}
          testID="note-content-input"
        />

        <Input
          label="Category (Optional)"
          placeholder="e.g., Personal, Work, Ideas..."
          value={category}
          onChangeText={setCategory}
          maxLength={50}
          testID="note-category-input"
        />

        <Input
          label="Tags (Optional)"
          placeholder="Separate tags with commas..."
          value={tags}
          onChangeText={setTags}
          maxLength={200}
          autoCapitalize="none"
          testID="note-tags-input"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Additional styles if needed
});