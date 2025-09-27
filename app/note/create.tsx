/**
 * Note creation screen with improved UX and simplified UI
 */

import { NoteEditor } from '@/components/notes/note-editor';
import { ThemedView } from '@/components/themed-view';
import { useThemedAlert } from '@/components/ui';
import { useNotes, useTheme } from '@/context';
import { CreateNoteInput, UpdateNoteInput } from '@/types';
import { Stack, router } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

export default function CreateNoteScreen() {
  const { createNote } = useNotes();
  const { theme: colors } = useTheme();
  const { showAlert, AlertComponent } = useThemedAlert();

  const handleSave = useCallback(async (noteData: CreateNoteInput | UpdateNoteInput) => {
    try {
      // For create screen, we only handle CreateNoteInput
      if ('id' in noteData) {
        throw new Error('Cannot update note in create screen');
      }
      await createNote(noteData as CreateNoteInput);
      router.back();
    } catch (error) {
      showAlert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create note'
      );
    }
  }, [createNote, showAlert]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'New Note',
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          presentation: 'modal',
        }}
      />
      
      <NoteEditor
        onSave={handleSave}
        onCancel={handleCancel}
        autoFocus={true}
        showActions={true}
        testID="create-note-editor"
      />
      
      <AlertComponent />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});