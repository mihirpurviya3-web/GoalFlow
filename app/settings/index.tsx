// Powered by OnSpace.AI — Settings
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();

  const [reminderEnabled, setReminderEnabled] = useState(user?.preferences.reminderEnabled ?? true);

  const toggleReminders = async (value: boolean) => {
    setReminderEnabled(value);
    await updateProfile({ preferences: { ...user!.preferences, reminderEnabled: value } });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader title="Settings" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>

        <SectionHeader label="Account" />
        <View style={styles.card}>
          <MenuRow icon="person-outline" label="Edit Profile" onPress={() => {}} />
          <MenuRow icon="lock-outline" label="Change Password" onPress={() => {}} />
        </View>

        <SectionHeader label="Notifications" />
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="notifications-none" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Enable Reminders</Text>
            </View>
            <Switch value={reminderEnabled} onValueChange={toggleReminders} trackColor={{ true: Colors.primary }} thumbColor={Colors.textInverse} />
          </View>
          <MenuRow icon="tune" label="Notification Preferences" onPress={() => router.push('/settings/notifications')} />
        </View>

        <SectionHeader label="Preferences" />
        <View style={styles.card}>
          <MenuRow icon="calendar-today" label="Preferred Days" value={`${user?.preferences.preferredDays.length ?? 5} days`} onPress={() => {}} />
          <MenuRow icon="schedule" label="Preferred Time" value={user?.preferences.preferredTime ?? 'Morning'} onPress={() => {}} capitalize />
          <MenuRow icon="track-changes" label="Weekly Target" value={`${user?.preferences.weeklyTarget ?? 5} actions`} onPress={() => {}} />
        </View>

        <SectionHeader label="Data" />
        <View style={styles.card}>
          <MenuRow icon="download" label="Export My Data" onPress={() => {}} />
          <MenuRow icon="delete-outline" label="Clear All Data" onPress={() => {}} danger />
        </View>

        <SectionHeader label="About" />
        <View style={styles.card}>
          <MenuRow icon="info-outline" label="Version" value="1.0.0" onPress={() => {}} />
          <MenuRow icon="description" label="Privacy Policy" onPress={() => {}} />
          <MenuRow icon="gavel" label="Terms of Service" onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}

const SectionHeader = ({ label }: { label: string }) => (
  <Text style={styles.sectionHeader}>{label}</Text>
);

const MenuRow = ({ icon, label, value, onPress, danger, capitalize }: { icon: string; label: string; value?: string; onPress: () => void; danger?: boolean; capitalize?: boolean }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}>
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <MaterialIcons name={icon as any} size={18} color={danger ? Colors.error : Colors.primary} />
    </View>
    <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
    {value ? <Text style={[styles.menuValue, capitalize && { textTransform: 'capitalize' }]}>{value}</Text> : null}
    <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, gap: Spacing.md },
  sectionHeader: { fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginTop: Spacing.sm, marginLeft: Spacing.xs },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center' },
  menuIconDanger: { backgroundColor: Colors.errorSurface },
  menuLabel: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  menuLabelDanger: { color: Colors.error },
  menuValue: { fontSize: Typography.sm, color: Colors.textTertiary },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
});
