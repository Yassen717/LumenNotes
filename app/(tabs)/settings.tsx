/**
 * Settings page for LumenNotes app
 */

import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColors, useNotes, useSettings } from '@/context';

export default function SettingsScreen() {
  const colors = useColors();
  const { theme, toggleTheme } = useSettings();
  const themeMode = theme; // Use theme directly from settings
  const { getNotesStats, clearAllNotes } = useNotes();

  const stats = getNotesStats();

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleClearAllNotes = useCallback(() => {
    Alert.alert(
      'Clear All Notes',
      'Are you sure you want to delete all notes? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllNotes();
              Alert.alert('Success', 'All notes have been deleted.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear notes.');
            }
          },
        },
      ]
    );
  }, [clearAllNotes]);

  const handleExportNotes = useCallback(() => {
    // TODO: Implement export functionality
    Alert.alert('Export', 'Export functionality will be implemented soon.');
  }, []);

  const handleImportNotes = useCallback(() => {
    // TODO: Implement import functionality
    Alert.alert('Import', 'Import functionality will be implemented soon.');
  }, []);

  const handleAbout = useCallback(() => {
    Alert.alert(
      'About LumenNotes',
      'Version 1.0.0\n\nA beautiful and simple note-taking app built with React Native and Expo.\n\n© 2024 LumenNotes',
      [{ text: 'OK' }]
    );
  }, []);

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showArrow = true 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <ThemedText style={[styles.arrow, { color: colors.textSecondary }]}>›</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <ThemedText style={[styles.sectionHeader, { color: colors.primary }]}>
      {title}
    </ThemedText>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={[styles.backButtonText, { color: colors.primary }]}>
              ← Back
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Settings
          </ThemedText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* App Statistics */}
          <View style={styles.section}>
            <SectionHeader title="Statistics" />
            <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{stats.total}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Notes
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{stats.pinned}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Pinned Notes
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{stats.categories}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Categories
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{stats.tags}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Tags
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Appearance */}
          <View style={styles.section}>
            <SectionHeader title="Appearance" />
            <SettingItem
              title="Dark Mode"
              subtitle={`Currently: ${themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'On' : 'Off'}`}
              rightComponent={
                <Switch
                  value={themeMode === 'dark'}
                  onValueChange={handleThemeToggle}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={themeMode === 'dark' ? colors.primary : colors.textSecondary}
                />
              }
              showArrow={false}
            />
          </View>

          {/* Data Management */}
          <View style={styles.section}>
            <SectionHeader title="Data Management" />
            <SettingItem
              title="Export Notes"
              subtitle="Export all notes to a file"
              onPress={handleExportNotes}
            />
            <SettingItem
              title="Import Notes"
              subtitle="Import notes from a file"
              onPress={handleImportNotes}
            />
            <SettingItem
              title="Clear All Notes"
              subtitle="Permanently delete all notes"
              onPress={handleClearAllNotes}
            />
          </View>

          {/* About */}
          <View style={styles.section}>
            <SectionHeader title="About" />
            <SettingItem
              title="About LumenNotes"
              subtitle="Version 1.0.0"
              onPress={handleAbout}
            />
            <SettingItem
              title="Privacy Policy"
              subtitle="How we handle your data"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be available soon.')}
            />
            <SettingItem
              title="Terms of Service"
              subtitle="Terms and conditions"
              onPress={() => Alert.alert('Terms of Service', 'Terms of service will be available soon.')}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
              Made with ❤️ using React Native & Expo
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 60, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
