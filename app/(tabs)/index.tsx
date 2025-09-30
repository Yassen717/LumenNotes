import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { FAB } from "@/components/navigation/fab-button";
import { NoteCard } from "@/components/notes/note-card";
import { SearchBar } from "@/components/notes/search-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useNotes, useTheme } from "@/context";
import { Note } from "@/types";
import { Text } from "react-native";

export default function NotesListScreen() {
  const {
    filteredNotes,
    loading,
    error,
    searchNotes,
    clearFilters,
    refreshNotes,
    toggleFavoriteNote,
  } = useNotes();
  const { theme: colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const insets = useSafeAreaInsets();

  const headerContainerStyle = useMemo(() => {
    return [
      styles.header,
      {
        paddingTop: Math.max(insets.top, 0) + 20,
      },
    ];
  }, [insets.top]);

  const listContentContainerStyle = useMemo(() => {
    return [
      styles.listContainer,
      {
        paddingBottom: 100 + Math.max(insets.bottom, 0),
      },
    ];
  }, [insets.bottom]);

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
    console.log("Long press on note:", note.title);
  }, []);

  const handleCreateNote = useCallback(() => {
    router.push("/note/create" as any);
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
      onToggleFavorite={() => toggleFavoriteNote(item.id)}
      style={styles.noteCard}
    />
  ), [handleNotePress, handleNoteLongPress, toggleFavoriteNote]);

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        <View style={headerContainerStyle}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.headerTitle}>
             <Text style={styles.Title}>Lumen</Text> Note
          </ThemedText>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/settings' as any)}
            testID="settings-button"
          >
            <MaterialIcons name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search note..."
          style={styles.searchBar}
        />
        <View style={styles.filtersRow}>
          <TouchableOpacity
            onPress={() => setFavoritesOnly(prev => !prev)}
            style={[styles.favoritesToggle, favoritesOnly && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
            testID="favorites-toggle"
          >
            <MaterialIcons
              name={favoritesOnly ? 'favorite' : 'favorite-border'}
              size={18}
              color={favoritesOnly ? colors.primary : colors.textSecondary}
            />
            <ThemedText style={[styles.favoritesToggleText, favoritesOnly && { color: colors.primary }]}>Favorites</ThemedText>
          </TouchableOpacity>
        </View>
        </View>

        <FlatList
        data={filteredNotes.filter(note => !note.isDeleted && (!favoritesOnly || note.isFavorite))}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listContentContainerStyle}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Title: {
    color:"#2196F3",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchBar: {
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  favoritesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
  },
  favoritesToggleText: {
    fontSize: 13,
    opacity: 0.8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  noteCard: {
    width: "48%",
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
  },
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "red",
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
  },
});
