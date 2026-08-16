// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Goal } from '@/types';
import { Colors, Typography, Spacing, Radius, Shadow, getCategoryColor, getStatusColor, getStatusLabel } from '@/constants/theme';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/Badge';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
  compact?: boolean;
}

export const GoalCard = React.memo(({ goal, onPress, compact = false }: GoalCardProps) => {
  const categoryColor = getCategoryColor(goal.category);
  const statusColor = getStatusColor(goal.progressStatus);
  const actionsLeft = goal.actions.filter(a => a.status === 'upcoming' || a.status === 'in_progress').length;

  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityLabel={goal.title}
    >
      {/* Category strip */}
      <View style={[styles.strip, { backgroundColor: categoryColor }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.category}>{goal.category}</Text>
            <Text style={styles.title} numberOfLines={2}>{goal.title}</Text>
          </View>
          <ProgressRing
            percent={goal.progressPercent}
            size={compact ? 52 : 64}
            strokeWidth={6}
            color={categoryColor}
            labelSize={Typography.xs}
          />
        </View>

        {!compact ? (
          <Text style={styles.description} numberOfLines={2}>{goal.description}</Text>
        ) : null}

        <View style={styles.footer}>
          <Badge
            label={getStatusLabel(goal.progressStatus)}
            color={statusColor}
            bgColor={statusColor + '18'}
            size="sm"
          />
          <View style={styles.meta}>
            {daysLeft > 0 ? (
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={12} color={Colors.textTertiary} />
                <Text style={styles.metaText}>{daysLeft}d left</Text>
              </View>
            ) : null}
            {actionsLeft > 0 ? (
              <View style={styles.metaItem}>
                <MaterialIcons name="check-circle-outline" size={12} color={Colors.textTertiary} />
                <Text style={styles.metaText}>{actionsLeft} actions</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadow.md,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  strip: { width: 4 },
  content: { flex: 1, padding: Spacing.base, gap: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1, marginRight: Spacing.md },
  category: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.medium, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary, marginTop: 2, lineHeight: Typography.md * Typography.tight },
  description: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * Typography.normal },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs },
  meta: { flexDirection: 'row', gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: Colors.textTertiary },
});
