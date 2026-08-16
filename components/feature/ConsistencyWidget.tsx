// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ConsistencyStats } from '@/types';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface ConsistencyWidgetProps {
  stats: ConsistencyStats;
}

export const ConsistencyWidget = React.memo(({ stats }: ConsistencyWidgetProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name="local-fire-department" size={20} color={Colors.emphasis} />
        <Text style={styles.headerText}>Consistency</Text>
      </View>
      <View style={styles.grid}>
        <StatItem
          label="Current Streak"
          value={`${stats.currentStreak}d`}
          icon="whatshot"
          color={Colors.emphasis}
        />
        <StatItem
          label="This Week"
          value={`${stats.thisWeekCompleted}/${stats.thisWeekPlanned}`}
          icon="calendar-view-week"
          color={Colors.primary}
        />
        <StatItem
          label="Monthly"
          value={`${stats.monthlyCompletionRate}%`}
          icon="trending-up"
          color={Colors.success}
        />
        <StatItem
          label="Total Done"
          value={`${stats.totalActionsCompleted}`}
          icon="check-circle"
          color={Colors.info}
        />
      </View>
    </View>
  );
});

const StatItem = ({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>
      <MaterialIcons name={icon as any} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  headerText: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statItem: { flex: 1, minWidth: '45%', backgroundColor: Colors.background, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.xs, alignItems: 'flex-start' },
  statIcon: { width: 32, height: 32, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  statLabel: { fontSize: Typography.xs, color: Colors.textTertiary, lineHeight: Typography.xs * Typography.normal },
});
