// Powered by OnSpace.AI — Profile
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useGoals } from '@/hooks/useGoals';
import { useActions } from '@/hooks/useActions';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { ProgressRing } from '@/components/ui/ProgressRing';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { goals } = useGoals();
  const { consistency } = useActions();
  const { showAlert } = useAlert();

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() ?? 'U';

  const handleLogout = () => {
    showAlert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await logout();
        router.replace('/auth/login');
      }},
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Pressable onPress={() => router.push('/settings/index')} style={styles.settingsBtn}>
          <MaterialIcons name="settings" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        {user?.mainObjective ? (
          <Text style={styles.objective}>"{user.mainObjective}"</Text>
        ) : null}
        <View style={styles.joinedRow}>
          <MaterialIcons name="calendar-today" size={14} color={Colors.textTertiary} />
          <Text style={styles.joinedText}>
            Joined {new Date(user?.joinedAt ?? '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard value={`${activeGoals}`} label="Active Goals" icon="track-changes" color={Colors.primary} />
        <StatCard value={`${completedGoals}`} label="Completed" icon="check-circle" color={Colors.success} />
        <StatCard value={`${consistency.currentStreak}d`} label="Streak" icon="whatshot" color={Colors.emphasis} />
        <StatCard value={`${consistency.totalActionsCompleted}`} label="Actions Done" icon="bolt" color={Colors.info} />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <PreferenceRow icon="schedule" label="Preferred time" value={user?.preferences.preferredTime ?? '-'} capitalize />
          <PreferenceRow icon="calendar-view-week" label="Active days" value={`${user?.preferences.preferredDays.length ?? 0} days/week`} />
          <PreferenceRow icon="track-changes" label="Weekly target" value={`${user?.preferences.weeklyTarget ?? 5} actions`} />
          <PreferenceRow icon="notifications" label="Reminders" value={user?.preferences.reminderEnabled ? `On · ${user?.preferences.reminderTime}` : 'Off'} />
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>
        <View style={styles.card}>
          <MenuRow icon="rate-review" label="Weekly Reflection" onPress={() => router.push('/reflection/weekly')} />
          <MenuRow icon="notifications-none" label="Notification Settings" onPress={() => router.push('/settings/notifications')} />
          <MenuRow icon="settings" label="App Settings" onPress={() => router.push('/settings/index')} />
        </View>
      </View>

      {/* Logout */}
      <Pressable onPress={handleLogout} style={styles.logoutBtn}>
        <MaterialIcons name="logout" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const StatCard = ({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>
      <MaterialIcons name={icon as any} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const PreferenceRow = ({ icon, label, value, capitalize }: { icon: string; label: string; value: string; capitalize?: boolean }) => (
  <View style={styles.prefRow}>
    <MaterialIcons name={icon as any} size={18} color={Colors.primary} />
    <Text style={styles.prefLabel}>{label}</Text>
    <Text style={[styles.prefValue, capitalize && { textTransform: 'capitalize' }]}>{value}</Text>
  </View>
);

const MenuRow = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}>
    <View style={styles.menuIcon}>
      <MaterialIcons name={icon as any} size={18} color={Colors.primary} />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, gap: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  settingsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm, ...Shadow.md },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  avatarText: { fontSize: Typography['2xl'], fontWeight: Typography.bold, color: Colors.textInverse },
  profileName: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary },
  profileEmail: { fontSize: Typography.sm, color: Colors.textTertiary },
  objective: { fontSize: Typography.sm, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center', paddingHorizontal: Spacing.md, lineHeight: Typography.sm * Typography.relaxed },
  joinedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  joinedText: { fontSize: Typography.xs, color: Colors.textTertiary },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: Spacing.xs, ...Shadow.sm },
  statIcon: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: Typography.lg, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  prefLabel: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  prefValue: { fontSize: Typography.sm, color: Colors.textSecondary },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, backgroundColor: Colors.errorSurface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm },
  logoutText: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.error },
});
