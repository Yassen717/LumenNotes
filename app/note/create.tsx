/**
 * Note creation screen
 */

import { NoteEditor } from '@/components/notes/note-editor';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { useColors, useNotes } from '@/context';
import { CreateNoteInput, UpdateNoteInput } from '@/types';
import { Stack, router } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function CreateNoteScreen() {
  const { createNote } = useNotes();
  const colors = useColors();

  const handleSave = useCallback(async (noteData: CreateNoteInput | UpdateNoteInput) => {
    try {
      // For create screen, we only handle CreateNoteInput
      if ('id' in noteData) {
        throw new Error('Cannot update note in create screen');
      }
      await createNote(noteData as CreateNoteInput);
      router.back();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create note'
      );
    }
  }, [createNote]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'New Note',
          headerShown: true,
          headerLeft: () => (
            <Button
              title="Cancel"
              variant="ghost"
              size="small"
              onPress={handleCancel}
            />
          ),
          headerRight: () => (
            <Button
              title="Save"
              variant="ghost"
              size="small"
              onPress={() => {
                // This will be handled by the NoteEditor
              }}
            />
          ),
        }}
      />
      
      <NoteEditor
        onSave={handleSave}
        onCancel={handleCancel}
        autoFocus={true}
        testID="create-note-editor"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});