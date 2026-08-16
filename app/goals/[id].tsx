// Powered by OnSpace.AI — Goal Details
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGoals } from '@/hooks/useGoals';
import { useActions } from '@/hooks/useActions';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow, getCategoryColor, getStatusColor, getStatusLabel } from '@/constants/theme';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/Badge';
import { ActionItem } from '@/components/feature/ActionItem';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getGoalById, pauseGoal, resumeGoal, completeGoal, deleteGoal } = useGoals();
  const { actions, updateStatus } = useActions();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'actions'>('overview');

  const goal = getGoalById(id ?? '');
  if (!goal) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Goal not found</Text>
      </View>
    );
  }

  const categoryColor = getCategoryColor(goal.category);
  const goalActions = actions.filter(a => a.goalId === goal.id);
  const completedActions = goalActions.filter(a => a.status === 'completed');

  const handleStatusAction = () => {
    const options = goal.status === 'active'
      ? [
          { text: 'Pause Goal', onPress: () => pauseGoal(goal.id) },
          { text: 'Mark Complete', style: 'default' as const, onPress: () => completeGoal(goal.id) },
          { text: 'Delete Goal', style: 'destructive' as const, onPress: () => {
            showAlert('Delete Goal', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: async () => { await deleteGoal(goal.id); router.back(); } },
            ]);
          }},
          { text: 'Cancel', style: 'cancel' as const },
        ]
      : [
          { text: 'Resume Goal', onPress: () => resumeGoal(goal.id) },
          { text: 'Cancel', style: 'cancel' as const },
        ];
    showAlert('Goal Options', undefined, options);
  };

  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        title={goal.category}
        showBack
        rightAction={{ icon: 'more-vert', onPress: handleStatusAction }}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: categoryColor }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>{goal.title}</Text>
              <Badge label={getStatusLabel(goal.progressStatus)} color={Colors.textInverse} bgColor="rgba(255,255,255,0.25)" />
            </View>
            <ProgressRing percent={goal.progressPercent} size={80} strokeWidth={8} color="white" bgColor="rgba(255,255,255,0.3)" labelSize={Typography.base}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: Typography.lg, fontWeight: Typography.extrabold, color: Colors.textInverse }}>{goal.progressPercent}%</Text>
              </View>
            </ProgressRing>
          </View>
          <View style={styles.heroMeta}>
            <HeroMeta icon="schedule" value={daysLeft > 0 ? `${daysLeft} days left` : 'Past due'} />
            <HeroMeta icon="check-circle" value={`${completedActions.length}/${goalActions.length} done`} />
            <HeroMeta icon="flag" value={goal.priority} />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['overview', 'milestones', 'actions'] as const).map(tab => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.tabActive]}>
              <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'overview' && (
          <View style={styles.section}>
            <InfoCard label="Description" value={goal.description} />
            {goal.why ? <InfoCard label="Why it matters" value={goal.why} /> : null}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Timeline</Text>
              <View style={styles.timelineRow}>
                <TimelineItem icon="play-arrow" label="Start" value={goal.startDate} color={Colors.success} />
                <View style={[styles.timelineLine, { backgroundColor: categoryColor }]} />
                <TimelineItem icon="flag" label="Target" value={goal.targetDate} color={categoryColor} />
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Routine</Text>
              <View style={styles.routineGrid}>
                <RoutineItem icon="repeat" label="Frequency" value={goal.routine.frequencyType} />
                <RoutineItem icon="access-time" label="Time" value={goal.routine.preferredTime} />
                <RoutineItem icon="timer" label="Duration" value={`${goal.routine.durationMinutes}m`} />
                <RoutineItem icon="calendar-today" label="Days" value={`${goal.routine.preferredDays.length}/week`} />
              </View>
            </View>
          </View>
        )}

        {activeTab === 'milestones' && (
          <View style={styles.section}>
            <Pressable style={styles.addBtn} onPress={() => router.push(`/goals/${goal.id}/milestone/create`)}>
              <MaterialIcons name="add" size={18} color={Colors.primary} />
              <Text style={styles.addBtnText}>Add Milestone</Text>
            </Pressable>
            {goal.milestones.length === 0 ? (
              <View style={styles.empty}>
                <MaterialIcons name="timeline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No milestones yet</Text>
              </View>
            ) : (
              goal.milestones.map((ms, idx) => (
                <View key={ms.id} style={styles.milestoneItem}>
                  <View style={[styles.milestoneNumber, { backgroundColor: categoryColor }]}>
                    <Text style={styles.milestoneNumText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.milestoneContent}>
                    <View style={styles.milestoneHeader}>
                      <Text style={styles.milestoneTitle}>{ms.title}</Text>
                      <Badge
                        label={ms.status.replace('_', ' ')}
                        color={ms.status === 'completed' ? Colors.success : ms.status === 'in_progress' ? Colors.primary : Colors.textTertiary}
                        bgColor={ms.status === 'completed' ? Colors.successSurface : ms.status === 'in_progress' ? Colors.primarySurface : Colors.border}
                        size="sm"
                      />
                    </View>
                    {ms.description ? <Text style={styles.milestoneDesc}>{ms.description}</Text> : null}
                    {ms.targetDate ? <Text style={styles.milestoneMeta}>Target: {ms.targetDate}</Text> : null}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'actions' && (
          <View style={styles.section}>
            <Pressable style={styles.addBtn} onPress={() => router.push({ pathname: '/actions/create', params: { goalId: goal.id } })}>
              <MaterialIcons name="add" size={18} color={Colors.primary} />
              <Text style={styles.addBtnText}>Add Action</Text>
            </Pressable>
            {goalActions.length === 0 ? (
              <View style={styles.empty}>
                <MaterialIcons name="check-circle-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No actions yet</Text>
              </View>
            ) : (
              goalActions.map(action => (
                <ActionItem
                  key={action.id}
                  action={action}
                  onComplete={() => updateStatus(action.id, 'completed')}
                  onSkip={() => updateStatus(action.id, 'skipped')}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const HeroMeta = ({ icon, value }: { icon: string; value: string }) => (
  <View style={styles.heroMetaItem}>
    <MaterialIcons name={icon as any} size={14} color="rgba(255,255,255,0.7)" />
    <Text style={styles.heroMetaText}>{value}</Text>
  </View>
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{label}</Text>
    <Text style={styles.cardBody}>{value}</Text>
  </View>
);

const TimelineItem = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <View style={styles.timelineItem}>
    <View style={[styles.timelineIcon, { backgroundColor: color + '18' }]}>
      <MaterialIcons name={icon as any} size={16} color={color} />
    </View>
    <Text style={styles.timelineLabel}>{label}</Text>
    <Text style={styles.timelineValue}>{value}</Text>
  </View>
);

const RoutineItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.routineItem}>
    <MaterialIcons name={icon as any} size={16} color={Colors.primary} />
    <Text style={styles.routineLabel}>{label}</Text>
    <Text style={styles.routineValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, gap: Spacing.md },
  hero: { borderRadius: Radius.xl, padding: Spacing.xl, gap: Spacing.md, ...Shadow.lg },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.md },
  heroLeft: { flex: 1, gap: Spacing.sm },
  heroTitle: { fontSize: Typography['2xl'], fontWeight: Typography.extrabold, color: Colors.textInverse, lineHeight: Typography['2xl'] * Typography.tight },
  heroMeta: { flexDirection: 'row', gap: Spacing.xl },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  heroMetaText: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize' },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 4, ...Shadow.sm },
  tab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  tabLabelActive: { color: Colors.textInverse },
  section: { gap: Spacing.md, paddingBottom: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md, ...Shadow.sm },
  cardTitle: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardBody: { fontSize: Typography.base, color: Colors.textPrimary, lineHeight: Typography.base * Typography.relaxed },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  timelineItem: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  timelineIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  timelineLabel: { fontSize: Typography.xs, color: Colors.textTertiary },
  timelineValue: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  timelineLine: { flex: 1, height: 2, borderRadius: 1 },
  routineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  routineItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.background, borderRadius: Radius.md, padding: Spacing.md },
  routineLabel: { flex: 1, fontSize: Typography.xs, color: Colors.textTertiary },
  routineValue: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary, textTransform: 'capitalize' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primarySurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed' },
  addBtnText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semibold },
  milestoneItem: { flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm },
  milestoneNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  milestoneNumText: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textInverse },
  milestoneContent: { flex: 1, gap: Spacing.xs },
  milestoneHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  milestoneTitle: { flex: 1, fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  milestoneDesc: { fontSize: Typography.sm, color: Colors.textSecondary },
  milestoneMeta: { fontSize: Typography.xs, color: Colors.textTertiary },
  empty: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing['2xl'] },
  emptyText: { fontSize: Typography.md, color: Colors.textSecondary },
});
