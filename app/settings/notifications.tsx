// Powered by OnSpace.AI — Notification Preferences
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';

const REMINDER_TIMES = ['06:00', '07:00', '08:00', '09:00', '12:00', '18:00', '19:00', '20:00', '21:00'];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();

  const [reminders, setReminders] = useState(user?.preferences.reminderEnabled ?? true);
  const [reminderTime, setReminderTime] = useState(user?.preferences.reminderTime ?? '08:00');
  const [dailySummary, setDailySummary] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      preferences: {
        ...user!.preferences,
        reminderEnabled: reminders,
        reminderTime,
      },
    });
    setIsSaving(false);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader title="Notifications" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reminders</Text>
          <ToggleRow icon="alarm" label="Daily Reminders" sublabel="Get notified about upcoming actions" value={reminders} onChange={setReminders} />
          {reminders ? (
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Reminder Time</Text>
              <View style={styles.timesGrid}>
                {REMINDER_TIMES.map(t => (
                  <Pressable key={t} onPress={() => setReminderTime(t)} style={[styles.timeChip, reminderTime === t && styles.timeChipActive]}>
                    <Text style={[styles.timeText, reminderTime === t && styles.timeTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summaries</Text>
          <ToggleRow icon="today" label="Daily Summary" sublabel="End-of-day progress overview" value={dailySummary} onChange={setDailySummary} />
          <ToggleRow icon="view-week" label="Weekly Report" sublabel="Sunday evening progress recap" value={weeklyReport} onChange={setWeeklyReport} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Goal Updates</Text>
          <ToggleRow icon="emoji-events" label="Milestone Reached" sublabel="Celebrate when you hit milestones" value={milestoneAlerts} onChange={setMilestoneAlerts} />
        </View>

        <Button label="Save Preferences" onPress={handleSave} isLoading={isSaving} fullWidth variant="primary" size="lg" />
      </ScrollView>
    </View>
  );
}

const ToggleRow = ({ icon, label, sublabel, value, onChange }: { icon: string; label: string; sublabel: string; value: boolean; onChange: (v: boolean) => void }) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleIcon}>
      <MaterialIcons name={icon as any} size={18} color={Colors.primary} />
    </View>
    <View style={styles.toggleText}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleSub}>{sublabel}</Text>
    </View>
    <Switch value={value} onValueChange={onChange} trackColor={{ true: Colors.primary }} thumbColor={Colors.textInverse} />
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md, ...Shadow.sm },
  cardTitle: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleIcon: { width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center' },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontSize: Typography.base, fontWeight: Typography.medium, color: Colors.textPrimary },
  toggleSub: { fontSize: Typography.xs, color: Colors.textTertiary },
  timeSection: { gap: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  timeLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  timeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  timeTextActive: { color: Colors.textInverse },
});
