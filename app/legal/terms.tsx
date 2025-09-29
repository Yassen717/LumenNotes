import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/context';

export default function TermsOfServiceScreen() {
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
            Terms of Service
          </ThemedText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.lead}>
            These Terms of Service ("Terms") govern your use of LumenNotes (the "App"). By using the App, you agree to
            these Terms.
          </ThemedText>

          <Section title="1. Use of the App">
            <ThemedText style={styles.paragraph}>
              You may use the App to create and manage personal notes. You are responsible for all content you create and
              any actions taken within the App on your device.
            </ThemedText>
          </Section>

          <Section title="2. Your Content">
            <ThemedText style={styles.paragraph}>
              You retain ownership of the content you create. The App stores your content locally on your device unless
              you choose to export, back up, or otherwise share it.
            </ThemedText>
          </Section>

          <Section title="3. Acceptable Use">
            <ThemedText style={styles.paragraph}>
              You agree not to misuse the App, including but not limited to attempting to reverse engineer, disrupt, or
              harm the App or other users.
            </ThemedText>
          </Section>

          <Section title="4. Privacy">
            <ThemedText style={styles.paragraph}>
              Your use of the App is also governed by our Privacy Policy. Please review it to understand how your data is
              handled.
            </ThemedText>
          </Section>

          <Section title="5. Disclaimer of Warranties">
            <ThemedText style={styles.paragraph}>
              The App is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, express or
              implied. We do not warrant that the App will be error-free or uninterrupted.
            </ThemedText>
          </Section>

          <Section title="6. Limitation of Liability">
            <ThemedText style={styles.paragraph}>
              To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of data, profits, or revenues, related to your use of the
              App.
            </ThemedText>
          </Section>

          <Section title="7. Changes to the App and Terms">
            <ThemedText style={styles.paragraph}>
              We may update the App and these Terms from time to time. Continued use of the App after changes constitutes
              acceptance of the updated Terms.
            </ThemedText>
          </Section>

          <Section title="8. Termination">
            <ThemedText style={styles.paragraph}>
              We may suspend or terminate access to the App if you violate these Terms or if we discontinue the App. You
              may stop using the App at any time by uninstalling it.
            </ThemedText>
          </Section>

          <Section title="9. Contact">
            <ThemedText style={styles.paragraph}>
              For questions about these Terms, contact the developer/maintainer of LumenNotes.
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
