// Powered by OnSpace.AI — Create Action
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActions } from '@/hooks/useActions';
import { useGoals } from '@/hooks/useGoals';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Priority } from '@/types';

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: Colors.success },
  { value: 'medium', label: 'Medium', color: Colors.warning },
  { value: 'high', label: 'High', color: Colors.error },
];

export default function CreateActionScreen() {
  const { goalId: paramGoalId } = useLocalSearchParams<{ goalId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createAction } = useActions();
  const { goals } = useGoals();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState(paramGoalId ?? (goals[0]?.id ?? ''));
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [duration, setDuration] = useState('30');
  const [priority, setPriority] = useState<Priority>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!goalId) e.goalId = 'Please select a goal';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      await createAction({
        goalId,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        preferredTime,
        estimatedDurationMinutes: parseInt(duration) || undefined,
        priority,
      });
      router.back();
    } catch {
      showAlert('Error', 'Failed to create action.');
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader title="New Action" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]} keyboardShouldPersistTaps="handled">

        <Input label="Action title *" value={title} onChangeText={setTitle} placeholder="e.g. Complete 30-min workout" error={errors.title} autoFocus />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Optional details..." multiline numberOfLines={2} textAlignVertical="top" />

        <View style={styles.field}>
          <Text style={styles.label}>Goal *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.goalsList}>
            {goals.map(g => (
              <Pressable key={g.id} onPress={() => setGoalId(g.id)} style={[styles.goalChip, goalId === g.id && styles.goalChipActive]}>
                <Text style={[styles.goalChipText, goalId === g.id && styles.goalChipTextActive]} numberOfLines={1}>{g.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
          {errors.goalId ? <Text style={styles.errorText}>{errors.goalId}</Text> : null}
        </View>

        <Input label="Due date" value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD" />
        <Input label="Preferred time" value={preferredTime} onChangeText={setPreferredTime} placeholder="HH:MM (e.g. 07:00)" />
        <Input label="Duration (minutes)" value={duration} onChangeText={setDuration} keyboardType="number-pad" placeholder="30" />

        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => (
              <Pressable
                key={p.value}
                onPress={() => setPriority(p.value)}
                style={[styles.priorityBtn, priority === p.value && { backgroundColor: p.color, borderColor: p.color }]}
              >
                <MaterialIcons name="flag" size={16} color={priority === p.value ? Colors.textInverse : p.color} />
                <Text style={[styles.priorityLabel, priority === p.value && { color: Colors.textInverse }]}>{p.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button label="Create Action" onPress={handleCreate} isLoading={isLoading} fullWidth variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.base },
  field: { gap: Spacing.xs },
  label: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  goalsList: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  goalChip: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, maxWidth: 160 },
  goalChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  goalChipText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  goalChipTextActive: { color: Colors.textInverse },
  errorText: { fontSize: Typography.xs, color: Colors.error },
  priorityRow: { flexDirection: 'row', gap: Spacing.md },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  priorityLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  footer: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
});
