// Powered by OnSpace.AI — Today's Actions
import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActions } from '@/hooks/useActions';
import { useGoals } from '@/hooks/useGoals';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { ActionItem } from '@/components/feature/ActionItem';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ActionStatus } from '@/types';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { todayActions, updateStatus } = useActions();
  const { getGoalById } = useGoals();

  const pending = todayActions.filter(a => a.status === 'upcoming' || a.status === 'in_progress');
  const completed = todayActions.filter(a => a.status === 'completed');
  const skipped = todayActions.filter(a => a.status === 'skipped' || a.status === 'missed');
  const progress = todayActions.length > 0 ? Math.round((completed.length / todayActions.length) * 100) : 0;

  const sections = [
    ...(pending.length > 0 ? [{ title: 'To Do', data: pending }] : []),
    ...(completed.length > 0 ? [{ title: 'Completed', data: completed }] : []),
    ...(skipped.length > 0 ? [{ title: 'Skipped / Missed', data: skipped }] : []),
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.date}>{todayStr}</Text>
        </View>
        <Pressable onPress={() => router.push('/actions/create')} style={styles.addBtn}>
          <MaterialIcons name="add" size={22} color={Colors.textInverse} />
        </Pressable>
      </View>

      {/* Progress card */}
      <View style={styles.progressCard}>
        <View style={styles.progressLeft}>
          <Text style={styles.progressTitle}>
            {progress === 100 ? 'All done!' : progress > 0 ? 'In Progress' : 'Ready to start'}
          </Text>
          <Text style={styles.progressStats}>{completed.length} of {todayActions.length} actions</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <ProgressRing percent={progress} size={68} strokeWidth={7} color={Colors.success} />
      </View>

      {todayActions.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="check-circle-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No actions today</Text>
          <Text style={styles.emptySubtitle}>Your scheduled actions will appear here</Text>
          <Pressable style={styles.addAction} onPress={() => router.push('/actions/create')}>
            <MaterialIcons name="add" size={18} color={Colors.textInverse} />
            <Text style={styles.addActionText}>Add Action</Text>
          </Pressable>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ActionItem
              action={item}
              goalTitle={getGoalById(item.goalId)?.title}
              showGoal
              onComplete={() => updateStatus(item.id, 'completed')}
              onSkip={() => updateStatus(item.id, 'skipped')}
            />
          )}
          renderSectionHeader={({ section: { title, data } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionCount}>{data.length}</Text>
            </View>
          )}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          SectionSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  title: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  date: { fontSize: Typography.sm, color: Colors.textTertiary, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  progressCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: Radius.xl, marginHorizontal: Spacing.base, padding: Spacing.xl, marginBottom: Spacing.md, ...Shadow.md },
  progressLeft: { flex: 1, gap: Spacing.sm },
  progressTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  progressStats: { fontSize: Typography.sm, color: Colors.textSecondary },
  progressBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden', width: '80%' },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 3 },
  list: { paddingHorizontal: Spacing.base },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  sectionTitle: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCount: { fontSize: Typography.xs, color: Colors.textMuted, backgroundColor: Colors.border, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing['2xl'] },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center' },
  addAction: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, ...Shadow.md },
  addActionText: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },
});
