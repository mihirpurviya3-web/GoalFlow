// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Action, ActionStatus } from '@/types';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface ActionItemProps {
  action: Action;
  goalTitle?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  onPress?: () => void;
  showGoal?: boolean;
}

const STATUS_CONFIG: Record<ActionStatus, { icon: string; color: string; bg: string }> = {
  upcoming: { icon: 'radio-button-unchecked', color: Colors.textTertiary, bg: Colors.border },
  in_progress: { icon: 'radio-button-checked', color: Colors.primary, bg: Colors.primarySurface },
  completed: { icon: 'check-circle', color: Colors.success, bg: Colors.successSurface },
  missed: { icon: 'cancel', color: Colors.error, bg: Colors.errorSurface },
  skipped: { icon: 'skip-next', color: Colors.textTertiary, bg: Colors.border },
};

export const ActionItem = React.memo(({
  action, goalTitle, onComplete, onSkip, onPress, showGoal = false,
}: ActionItemProps) => {
  const config = STATUS_CONFIG[action.status];
  const isActionable = action.status === 'upcoming' || action.status === 'in_progress';
  const isCompleted = action.status === 'completed';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <Pressable
        onPress={isActionable ? onComplete : undefined}
        style={[styles.checkbox, { backgroundColor: config.bg }]}
        hitSlop={8}
      >
        <MaterialIcons name={config.icon as any} size={22} color={config.color} />
      </Pressable>

      <View style={styles.body}>
        {showGoal && goalTitle ? (
          <Text style={styles.goalLabel} numberOfLines={1}>{goalTitle}</Text>
        ) : null}
        <Text style={[styles.title, isCompleted && styles.completedTitle]} numberOfLines={2}>
          {action.title}
        </Text>
        <View style={styles.meta}>
          {action.preferredTime ? (
            <View style={styles.metaItem}>
              <MaterialIcons name="access-time" size={11} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{action.preferredTime}</Text>
            </View>
          ) : null}
          {action.estimatedDurationMinutes ? (
            <View style={styles.metaItem}>
              <MaterialIcons name="timer" size={11} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{action.estimatedDurationMinutes}m</Text>
            </View>
          ) : null}
          <View style={[styles.priorityDot, { backgroundColor: action.priority === 'high' ? Colors.error : action.priority === 'medium' ? Colors.warning : Colors.success }]} />
        </View>
      </View>

      {isActionable && onSkip ? (
        <Pressable onPress={onSkip} style={styles.skipBtn} hitSlop={8}>
          <MaterialIcons name="skip-next" size={18} color={Colors.textMuted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  pressed: { opacity: 0.85 },
  checkbox: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 3 },
  goalLabel: { fontSize: 10, color: Colors.primary, fontWeight: Typography.semibold, textTransform: 'uppercase', letterSpacing: 0.4 },
  title: { fontSize: Typography.base, fontWeight: Typography.medium, color: Colors.textPrimary, lineHeight: Typography.base * Typography.normal },
  completedTitle: { color: Colors.textTertiary, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: Colors.textTertiary },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  skipBtn: { padding: Spacing.xs },
});
