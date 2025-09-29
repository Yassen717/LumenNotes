import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/context';

export default function PrivacyPolicyScreen() {
  const { theme: colors } = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              shadowColor: '#000000',
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={[styles.backButtonText, { color: colors.primary }]}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Privacy Policy
          </ThemedText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.lead}>
            This Privacy Policy explains how LumenNotes ("we", "us", or "our") collects, uses, and safeguards your
            information. We designed LumenNotes to keep your notes on your device by default.
          </ThemedText>

          <Section title="1. Data We Store">
            <ThemedText style={styles.paragraph}>
              - Notes content you create in the app.
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              - Optional metadata such as titles, tags, categories, timestamps, and preferences (e.g., theme).
            </ThemedText>
          </Section>

          <Section title="2. Data Storage and Sync">
            <ThemedText style={styles.paragraph}>
              Your data is stored locally on your device. Unless you explicitly export your data or enable any future
              backup/sync feature you choose to use, we do not transmit your notes to external servers.
            </ThemedText>
          </Section>

          <Section title="3. Analytics and Tracking">
            <ThemedText style={styles.paragraph}>
              LumenNotes does not include third‑party analytics or advertising SDKs. If this changes in the future, we
              will update this policy and provide an opt‑in choice where required.
            </ThemedText>
          </Section>

          <Section title="4. Backups and Exports">
            <ThemedText style={styles.paragraph}>
              You can export your notes as files you control. When you export, the files are created on your device, and
              any sharing you perform is under your control.
            </ThemedText>
          </Section>

          <Section title="5. Security">
            <ThemedText style={styles.paragraph}>
              We take reasonable measures to protect your data on-device. However, no method of electronic storage is
              100% secure. We recommend protecting your device with a passcode and keeping backups safe.
            </ThemedText>
          </Section>

          <Section title="6. Your Rights">
            <ThemedText style={styles.paragraph}>
              You can create, edit, and delete your notes at any time. If you uninstall the app, your locally stored
              data will be removed from your device. If you used exports or backups, those files remain wherever you
              saved them.
            </ThemedText>
          </Section>

          <Section title="7. Children’s Privacy">
            <ThemedText style={styles.paragraph}>
              LumenNotes is not directed to children under 13. We do not knowingly collect personal information from
              children. If you believe a child has provided us data, please contact us to remove it.
            </ThemedText>
          </Section>

          <Section title="8. Changes to This Policy">
            <ThemedText style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will revise the “Last updated” date and, when
              appropriate, provide in‑app notice.
            </ThemedText>
          </Section>

          <Section title="9. Contact">
            <ThemedText style={styles.paragraph}>
              For questions or requests, contact the developer/maintainer of LumenNotes.
            </ThemedText>
          </Section>

          <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
            Last updated: September 29, 2025
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme: colors } = useTheme();
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>{title}</ThemedText>
      <View style={[styles.sectionBody, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    // subtle shadow/elevation
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: { paddingVertical: 8, paddingHorizontal: 4 },
  backButtonText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerRight: { width: 60 },
  content: { flex: 1, paddingHorizontal: 20 },
  lead: { fontSize: 14, marginTop: 16, marginBottom: 4 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  sectionBody: { padding: 12, borderRadius: 12, borderWidth: 1 },
  paragraph: { fontSize: 14, marginBottom: 8 },
  footerText: { fontSize: 12, textAlign: 'center', marginVertical: 24 },
});

