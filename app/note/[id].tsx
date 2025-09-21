/**
 * Note details screen with improved layout and better UX
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { useNotes, useTheme } from '@/context';
import { formatDate } from '@/utils';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, deleteNote, togglePinNote } = useNotes();
  const { theme: colors } = useTheme();
  
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
          title: note.title.length > 25 ? note.title.substring(0, 25) + '...' : note.title,
          headerShown: true,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
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
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.titleSection}>
          <ThemedText type="title" style={styles.title}>
            {note.title}
          </ThemedText>
          {note.isPinned && (
            <View style={[styles.pinBadge, { backgroundColor: colors.warning }]}>
              <ThemedText style={styles.pinText}>Pinned</ThemedText>
            </View>
          )}
        </View>
        
        <View style={[styles.metadata, { backgroundColor: colors.surface }]}>
          <View style={styles.metadataRow}>
            <ThemedText style={styles.metadataLabel}>Created:</ThemedText>
            <ThemedText style={styles.metadataText}>
              {formatDate(note.createdAt, 'absolute')}
            </ThemedText>
          </View>
          <View style={styles.metadataRow}>
            <ThemedText style={styles.metadataLabel}>Modified:</ThemedText>
            <ThemedText style={styles.metadataText}>
              {formatDate(note.updatedAt, 'relative')}
            </ThemedText>
          </View>
          {note.category && (
            <View style={styles.metadataRow}>
              <ThemedText style={styles.metadataLabel}>Category:</ThemedText>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                <ThemedText style={[styles.categoryText, { color: colors.primary }]}>
                  {note.category}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <ThemedText style={styles.tagsLabel}>Tags</ThemedText>
            <View style={styles.tags}>
              {note.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.accent + '20' }]}>
                  <ThemedText style={[styles.tagText, { color: colors.accent }]}>
                    #{tag}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.contentSection}>
          <ThemedText style={styles.contentLabel}>Content</ThemedText>
          <View style={[styles.contentBox, { backgroundColor: colors.surface }]}>
            <ThemedText style={styles.noteContent}>
              {note.content || 'No content'}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actions, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
          variant="outline"
          onPress={handleTogglePin}
          style={styles.actionButton}
          icon={<ThemedText>📌</ThemedText>}
        />
        <Button
          title="Delete Note"
          variant="destructive"
          onPress={handleDelete}
          style={styles.actionButton}
          icon={<ThemedText>🗑️</ThemedText>}
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
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 12,
  },
  pinBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pinText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metadata: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  metadataText: {
    fontSize: 14,
    opacity: 0.7,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
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
  contentSection: {
    marginBottom: 20,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
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