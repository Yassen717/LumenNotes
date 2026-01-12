/**
 * Note editing screen
 */

import { NoteEditor } from '@/components/notes/note-editor';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, useThemedAlert } from '@/components/ui';
import { useNotes, useTheme } from '@/context';
import { CreateNoteInput, UpdateNoteInput } from '@/types';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, updateNote } = useNotes();
  const { theme: colors } = useTheme();
  const { showAlert, AlertComponent } = useThemedAlert();
  
  const note = getNoteById(id);

  const handleSave = useCallback(async (noteData: CreateNoteInput | UpdateNoteInput) => {
    if (!note) return;
    
    try {
      await updateNote({
        id: note.id,
        ...(noteData as CreateNoteInput),
      });
      router.back();
    } catch (error) {
      showAlert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update note'
      );
    }
  }, [note, updateNote, showAlert]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  if (!note) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Note Not Found' }} />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Note not found</ThemedText>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Note',
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
        }}
      />
      
      <NoteEditor
        initialNote={note}
        onSave={handleSave}
        onCancel={handleCancel}
        autoFocus={false}
        showActions={true}
        testID="edit-note-editor"
      />
      
      <AlertComponent />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    minWidth: 100,
  },
});
