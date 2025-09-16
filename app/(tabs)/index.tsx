import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { FAB } from '@/components/navigation/fab-button';
import { NoteCard } from '@/components/notes/note-card';
import { SearchBar } from '@/components/notes/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColors, useNotes } from '@/context';
import { Note } from '@/types';

export default function NotesListScreen() {
  const {
    filteredNotes,
    loading,
    error,
    searchNotes,
    clearFilters,
    refreshNotes,
  } = useNotes();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshNotes();
    } finally {
      setRefreshing(false);
    }
  }, [refreshNotes]);

  const handleNotePress = useCallback((note: Note) => {
    router.push(`/note/${note.id}` as any);
  }, []);

  const handleNoteLongPress = useCallback((note: Note) => {
    // TODO: Show context menu
    console.log('Long press on note:', note.title);
  }, []);

  const handleCreateNote = useCallback(() => {
    router.push('/note/create' as any);
  }, []);

  const handleSearch = useCallback((query: string) => {
    searchNotes(query);
  }, [searchNotes]);

  const handleClearSearch = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const renderNote = useCallback(({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => handleNotePress(item)}
      onLongPress={() => handleNoteLongPress(item)}
      style={styles.noteCard}
    />
  ), [handleNotePress, handleNoteLongPress]);

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <ThemedText style={styles.emptyStateTitle}>No notes yet</ThemedText>
      <ThemedText style={styles.emptyStateSubtitle}>
        Tap the + button to create your first note
      </ThemedText>
    </ThemedView>
  );

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorState}>
          <ThemedText style={styles.errorTitle}>Error loading notes</ThemedText>
          <ThemedText style={styles.errorSubtitle}>{error}</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          My Notes
        </ThemedText>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredNotes.filter(note => !note.isDeleted)}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <FAB onPress={handleCreateNote} testID="create-note-fab" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    marginBottom: 18,
    fontSize: 32,
    fontWeight: '700',
  },
  searchBar: {
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for FAB
    paddingTop: 8,
  },
  noteCard: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: 'red',
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});
