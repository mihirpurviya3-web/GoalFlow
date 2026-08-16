// Powered by OnSpace.AI — Home Dashboard
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useGoals } from '@/hooks/useGoals';
import { useActions } from '@/hooks/useActions';
import { Colors, Typography, Spacing, Radius, Shadow, getStatusColor, getStatusLabel, getCategoryColor } from '@/constants/theme';
import { GoalCard } from '@/components/feature/GoalCard';
import { ActionItem } from '@/components/feature/ActionItem';
import { ConsistencyWidget } from '@/components/feature/ConsistencyWidget';
import { ProgressRing } from '@/components/ui/ProgressRing';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { activeGoals, isLoading: goalsLoading } = useGoals();
  const { todayActions, updateStatus, consistency } = useActions();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const pendingToday = todayActions.filter(a => a.status === 'upcoming' || a.status === 'in_progress');
  const completedToday = todayActions.filter(a => a.status === 'completed');
  const todayProgress = todayActions.length > 0 ? Math.round((completedToday.length / todayActions.length) * 100) : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0] ?? 'Friend'} 👋</Text>
            <Text style={styles.date}>{todayDate}</Text>
          </View>
          <Pressable onPress={() => router.push('/settings/notifications')} style={styles.notifBtn}>
            <MaterialIcons name="notifications-none" size={24} color={Colors.textSecondary} />
          </Pressable>
        </View>

        {/* Today summary card */}
        <View style={styles.todaySummary}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Today's Focus</Text>
            <Text style={styles.summaryCount}>
              {pendingToday.length > 0
                ? `${pendingToday.length} action${pendingToday.length > 1 ? 's' : ''} pending`
                : completedToday.length > 0
                ? 'All done for today!'
                : 'No actions scheduled'}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${todayProgress}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{completedToday.length}/{todayActions.length} completed</Text>
          </View>
          <ProgressRing
            percent={todayProgress}
            size={72}
            strokeWidth={7}
            color={Colors.emphasis}
            bgColor={Colors.emphasisLight}
          />
        </View>
      </View>

      {/* Streak Banner */}
      {consistency.currentStreak > 0 ? (
        <View style={styles.streakBanner}>
          <MaterialIcons name="local-fire-department" size={20} color={Colors.emphasis} />
          <Text style={styles.streakText}>
            <Text style={styles.streakNumber}>{consistency.currentStreak} day streak</Text>
            {' '}— Keep it up!
          </Text>
        </View>
      ) : null}

      {/* Today's Actions */}
      {pendingToday.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Actions</Text>
            <Pressable onPress={() => router.push('/(tabs)/today')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {pendingToday.slice(0, 3).map(action => (
            <ActionItem
              key={action.id}
              action={action}
              showGoal
              onComplete={() => updateStatus(action.id, 'completed')}
              onSkip={() => updateStatus(action.id, 'skipped')}
            />
          ))}
        </View>
      ) : null}

      {/* Active Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <Pressable onPress={() => router.push('/(tabs)/goals')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        {activeGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="track-changes" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No active goals</Text>
            <Text style={styles.emptySubtitle}>Create your first goal to get started</Text>
            <Pressable style={styles.emptyAction} onPress={() => router.push('/goals/create')}>
              <Text style={styles.emptyActionText}>Create a Goal</Text>
            </Pressable>
          </View>
        ) : (
          activeGoals.slice(0, 2).map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onPress={() => router.push(`/goals/${goal.id}`)}
            />
          ))
        )}
      </View>

      {/* Consistency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Consistency</Text>
        <ConsistencyWidget stats={consistency} />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <QuickActionBtn icon="add-circle-outline" label="New Goal" color={Colors.primary} onPress={() => router.push('/goals/create')} />
          <QuickActionBtn icon="event" label="Calendar" color={Colors.info} onPress={() => router.push('/(tabs)/progress')} />
          <QuickActionBtn icon="bar-chart" label="Progress" color={Colors.success} onPress={() => router.push('/(tabs)/progress')} />
          <QuickActionBtn icon="rate-review" label="Reflect" color={Colors.emphasis} onPress={() => router.push('/reflection/weekly')} />
        </View>
      </View>
    </ScrollView>
  );
}

const QuickActionBtn = ({ icon, label, color, onPress }: { icon: string; label: string; color: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.8 }]}>
    <View style={[styles.quickIcon, { backgroundColor: color + '18' }]}>
      <MaterialIcons name={icon as any} size={24} color={color} />
    </View>
    <Text style={styles.quickLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, gap: Spacing.xl },
  hero: { gap: Spacing.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary },
  date: { fontSize: Typography.sm, color: Colors.textTertiary, marginTop: 2 },
  notifBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.sm },
  todaySummary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.lg,
  },
  summaryLeft: { flex: 1, gap: Spacing.sm },
  summaryTitle: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)', fontWeight: Typography.medium },
  summaryCount: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textInverse },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', width: '80%' },
  progressFill: { height: '100%', backgroundColor: Colors.emphasis, borderRadius: 3 },
  progressLabel: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.6)' },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.emphasisSurface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.emphasis,
  },
  streakText: { fontSize: Typography.sm, color: Colors.textSecondary },
  streakNumber: { fontWeight: Typography.bold, color: Colors.emphasisDark },
  section: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  seeAll: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },
  emptyState: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing['2xl'], alignItems: 'center', gap: Spacing.md, ...Shadow.sm },
  emptyTitle: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center' },
  emptyAction: { backgroundColor: Colors.primarySurface, borderRadius: Radius.full, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  emptyActionText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semibold },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  quickBtn: { flex: 1, minWidth: '44%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', gap: Spacing.sm, ...Shadow.sm },
  quickIcon: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
});
