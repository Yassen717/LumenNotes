/**
 * Note editor component for creating and editing notes
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '../../context';
import { CreateNoteInput, Note, UpdateNoteInput } from '../../types';
import { validateAndSanitizeNote } from '../../utils';
import { Button, Input } from '../ui';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: CreateNoteInput | UpdateNoteInput) => Promise<void>;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
  testID?: string;
  showActions?: boolean; // Whether to show the save/cancel action bar
}

export function NoteEditor({
  note,
  onSave,
  onCancel,
  style,
  autoFocus = true,
  testID,
  showActions = true,
}: NoteEditorProps) {
  const colors = useColors();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || '');
  const [tags, setTags] = useState(note?.tags.join(', ') || '');
  const [loading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Track changes
  useEffect(() => {
    const hasContentChanges = 
      title !== (note?.title || '') ||
      content !== (note?.content || '') ||
      category !== (note?.category || '') ||
      tags !== (note?.tags.join(', ') || '');
    
    setHasChanges(hasContentChanges);
  }, [title, content, category, tags, note]);

  // Keyboard visibility tracking
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: showActions ? 100 : 16, // Space for action bar
  });

  const getActionBarStyle = (): ViewStyle => ({
    position: 'absolute',
    bottom: keyboardVisible ? 0 : 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: keyboardVisible ? 12 : 32, // Account for safe area
    flexDirection: 'row',
    gap: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  });

  return (
    <View style={[getContainerStyle(), style]} testID={testID}>
      <ScrollView
        ref={scrollViewRef}
        style={getContentStyle()}
        contentContainerStyle={{ paddingBottom: 20 }}
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
          style={styles.titleInput}
        />

        <Input
          label="Content"
          placeholder="Start writing your note..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={12}
          maxLength={100000}
          testID="note-content-input"
          style={styles.contentInput}
        />

        <View style={styles.metadataSection}>
          <Input
            label="Category (Optional)"
            placeholder="e.g., Personal, Work, Ideas..."
            value={category}
            onChangeText={setCategory}
            maxLength={50}
            testID="note-category-input"
            style={styles.categoryInput}
          />

          <Input
            label="Tags (Optional)"
            placeholder="Separate tags with commas..."
            value={tags}
            onChangeText={setTags}
            maxLength={200}
            autoCapitalize="none"
            testID="note-tags-input"
            style={styles.tagsInput}
          />
        </View>
      </ScrollView>
      
      {showActions && (
        <View style={getActionBarStyle()}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={{ flex: 1 }}
            disabled={loading}
            testID="cancel-button"
          />
          <Button
            title={loading ? 'Saving...' : 'Save Note'}
            variant="primary"
            onPress={handleSave}
            style={{ flex: 2 }}
            loading={loading}
            disabled={!title.trim() || loading}
            testID="save-button"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleInput: {
    marginBottom: 20,
  },
  contentInput: {
    marginBottom: 20,
  },
  metadataSection: {
    marginTop: 8,
  },
  categoryInput: {
    marginBottom: 16,
  },
  tagsInput: {
    marginBottom: 8,
  },
});