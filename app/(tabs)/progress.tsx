// Powered by OnSpace.AI — Progress & Calendar
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGoals } from '@/hooks/useGoals';
import { useActions } from '@/hooks/useActions';
import { Colors, Typography, Spacing, Radius, Shadow, getCategoryColor } from '@/constants/theme';
import { ProgressRing } from '@/components/ui/ProgressRing';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEK_DAYS = ['M','T','W','T','F','S','S'];

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { goals, activeGoals } = useGoals();
  const { actions, consistency } = useActions();

  const [calendarDate, setCalendarDate] = useState(new Date());

  const overallProgress = useMemo(() => {
    if (activeGoals.length === 0) return 0;
    return Math.round(activeGoals.reduce((s, g) => s + g.progressPercent, 0) / activeGoals.length);
  }, [activeGoals]);

  // Build calendar grid
  const calendarData = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const completedDates = new Set(
      actions.filter(a => a.status === 'completed' && a.completedAt).map(a => a.completedAt!.split('T')[0])
    );
    const plannedDates = new Set(actions.map(a => a.dueDate));

    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        dateStr,
        hasCompleted: completedDates.has(dateStr),
        hasPlanned: plannedDates.has(dateStr),
        isToday: dateStr === new Date().toISOString().split('T')[0],
      });
    }
    return cells;
  }, [calendarDate, actions]);

  const prevMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Pressable onPress={() => router.push('/reflection/weekly')} style={styles.reflectBtn}>
          <MaterialIcons name="rate-review" size={18} color={Colors.primary} />
          <Text style={styles.reflectLabel}>Reflect</Text>
        </Pressable>
      </View>

      {/* Overall progress */}
      <View style={styles.overallCard}>
        <ProgressRing percent={overallProgress} size={100} strokeWidth={10} color={Colors.primary}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary }}>{overallProgress}%</Text>
            <Text style={{ fontSize: 10, color: Colors.textTertiary }}>overall</Text>
          </View>
        </ProgressRing>
        <View style={styles.overallStats}>
          <StatRow label="Active Goals" value={`${activeGoals.length}`} color={Colors.primary} />
          <StatRow label="Streak" value={`${consistency.currentStreak}d`} color={Colors.emphasis} />
          <StatRow label="This Week" value={`${consistency.thisWeekCompleted}/${consistency.thisWeekPlanned}`} color={Colors.success} />
          <StatRow label="Monthly Rate" value={`${consistency.monthlyCompletionRate}%`} color={Colors.info} />
        </View>
      </View>

      {/* Goal Progress Bars */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal Progress</Text>
        {activeGoals.map(goal => (
          <Pressable
            key={goal.id}
            style={styles.goalProgressItem}
            onPress={() => router.push(`/goals/${goal.id}`)}
          >
            <View style={[styles.goalStrip, { backgroundColor: getCategoryColor(goal.category) }]} />
            <View style={styles.goalProgressContent}>
              <View style={styles.goalProgressHeader}>
                <Text style={styles.goalProgressTitle} numberOfLines={1}>{goal.title}</Text>
                <Text style={styles.goalProgressPct}>{goal.progressPercent}%</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${goal.progressPercent}%`, backgroundColor: getCategoryColor(goal.category) }]} />
              </View>
              <Text style={styles.goalMilestoneCount}>
                {goal.milestones.filter(m => m.status === 'completed').length}/{goal.milestones.length} milestones
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <View style={styles.calHeader}>
          <Pressable onPress={prevMonth} style={styles.calNavBtn}>
            <MaterialIcons name="chevron-left" size={24} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.calMonthYear}>
            {MONTHS[calendarDate.getMonth()]} {calendarDate.getFullYear()}
          </Text>
          <Pressable onPress={nextMonth} style={styles.calNavBtn}>
            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.calGrid}>
          {WEEK_DAYS.map((d, i) => (
            <Text key={i} style={styles.calWeekDay}>{d}</Text>
          ))}
          {calendarData.map((cell, i) => {
            if (!cell) return <View key={`empty-${i}`} style={styles.calCell} />;
            return (
              <View key={cell.dateStr} style={[
                styles.calCell,
                cell.isToday && styles.calCellToday,
                cell.hasCompleted && styles.calCellCompleted,
              ]}>
                <Text style={[
                  styles.calDayText,
                  cell.isToday && styles.calDayToday,
                  cell.hasCompleted && styles.calDayCompleted,
                ]}>
                  {cell.day}
                </Text>
                {cell.hasPlanned && !cell.hasCompleted ? <View style={styles.calDot} /> : null}
              </View>
            );
          })}
        </View>

        <View style={styles.calLegend}>
          <LegendItem color={Colors.primary} label="Completed" />
          <LegendItem color={Colors.border} label="Planned" dot />
          <LegendItem color={Colors.emphasis} label="Today" />
        </View>
      </View>

      {/* Weekly summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <Pressable onPress={() => router.push('/reflection/weekly')}>
            <Text style={styles.seeAll}>View Reflection</Text>
          </Pressable>
        </View>
        <View style={styles.weekRow}>
          {[0,1,2,3,4,5,6].map(i => {
            const d = new Date();
            d.setDate(d.getDate() - d.getDay() + i + 1);
            const dateStr = d.toISOString().split('T')[0];
            const dayActions = actions.filter(a => a.dueDate === dateStr);
            const dayCompleted = dayActions.filter(a => a.status === 'completed').length;
            const fillPct = dayActions.length > 0 ? dayCompleted / dayActions.length : 0;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            return (
              <View key={i} style={styles.weekDay}>
                <Text style={[styles.weekDayLabel, isToday && styles.weekDayToday]}>
                  {['M','T','W','T','F','S','S'][i]}
                </Text>
                <View style={styles.weekBar}>
                  <View style={[styles.weekBarFill, { height: `${fillPct * 100}%` }]} />
                </View>
                <Text style={styles.weekDayNum}>{dayCompleted}/{dayActions.length}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const StatRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={styles.statRow}>
    <View style={[styles.statDot, { backgroundColor: color }]} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

const LegendItem = ({ color, label, dot }: { color: string; label: string; dot?: boolean }) => (
  <View style={styles.legendItem}>
    {dot ? <View style={[styles.legendDot, { backgroundColor: color }]} /> : <View style={[styles.legendBox, { backgroundColor: color }]} />}
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, gap: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  reflectBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.primarySurface, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  reflectLabel: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semibold },
  overallCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, ...Shadow.md },
  overallStats: { flex: 1, gap: Spacing.md },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statLabel: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
  statValue: { fontSize: Typography.sm, fontWeight: Typography.bold },
  section: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  seeAll: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },
  goalProgressItem: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  goalStrip: { width: 4 },
  goalProgressContent: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
  goalProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalProgressTitle: { flex: 1, fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  goalProgressPct: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.primary },
  barBg: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  goalMilestoneCount: { fontSize: Typography.xs, color: Colors.textTertiary },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calNavBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  calMonthYear: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, ...Shadow.sm },
  calWeekDay: { width: '14.28%', textAlign: 'center', fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.bold, paddingVertical: Spacing.sm },
  calCell: { width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.sm },
  calCellToday: { backgroundColor: Colors.emphasisSurface },
  calCellCompleted: { backgroundColor: Colors.primarySurface },
  calDayText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  calDayToday: { color: Colors.emphasisDark, fontWeight: Typography.bold },
  calDayCompleted: { color: Colors.primary, fontWeight: Typography.bold },
  calDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 2 },
  calLegend: { flexDirection: 'row', gap: Spacing.xl, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  legendBox: { width: 12, height: 12, borderRadius: 3 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendLabel: { fontSize: Typography.xs, color: Colors.textSecondary },
  weekRow: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm },
  weekDay: { flex: 1, alignItems: 'center', gap: Spacing.sm },
  weekDayLabel: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.bold },
  weekDayToday: { color: Colors.primary },
  weekBar: { width: 28, height: 60, backgroundColor: Colors.border, borderRadius: Radius.sm, overflow: 'hidden', justifyContent: 'flex-end' },
  weekBarFill: { width: '100%', backgroundColor: Colors.success, borderRadius: Radius.sm },
  weekDayNum: { fontSize: 10, color: Colors.textMuted },
});
