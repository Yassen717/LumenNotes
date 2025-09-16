/**
 * Note details screen - displays a single note with options to edit or delete
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { useColors, useNotes } from '@/context';
import { formatDate } from '@/utils';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, deleteNote, togglePinNote } = useNotes();
  const colors = useColors();
  
  const note = getNoteById(id);

  const handleEdit = useCallback(() => {
    if (note) {
      // router.push(`/note/edit/${note.id}`);
      console.log('Edit note:', note.title);
    }
  }, [note]);

  const handleDelete = useCallback(() => {
    if (!note) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(note.id);
              router.back();
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to delete note'
              );
            }
          },
        },
      ]
    );
  }, [note, deleteNote]);

  const handleTogglePin = useCallback(async () => {
    if (!note) return;
    
    try {
      await togglePinNote(note.id);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update note'
      );
    }
  }, [note, togglePinNote]);

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
          title: note.title,
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Edit"
                variant="ghost"
                size="small"
                onPress={handleEdit}
              />
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          {note.title}
        </ThemedText>
        
        <View style={styles.metadata}>
          <ThemedText style={styles.metadataText}>
            Created: {formatDate(note.createdAt, 'absolute')}
          </ThemedText>
          <ThemedText style={styles.metadataText}>
            Updated: {formatDate(note.updatedAt, 'relative')}
          </ThemedText>
          {note.category && (
            <ThemedText style={styles.metadataText}>
              Category: {note.category}
            </ThemedText>
          )}
        </View>

        {note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <ThemedText style={styles.tagsLabel}>Tags:</ThemedText>
            <View style={styles.tags}>
              {note.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.primary + '20' }]}>
                  <ThemedText style={[styles.tagText, { color: colors.primary }]}>
                    {tag}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        <ThemedText style={styles.content}>
          {note.content || 'No content'}
        </ThemedText>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title={note.isPinned ? 'Unpin' : 'Pin'}
          variant="outline"
          onPress={handleTogglePin}
          style={styles.actionButton}
        />
        <Button
          title="Delete"
          variant="outline"
          onPress={handleDelete}
          style={StyleSheet.flatten([styles.actionButton, { borderColor: colors.error }])}
          textStyle={{ color: colors.error }}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  metadata: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  metadataText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
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