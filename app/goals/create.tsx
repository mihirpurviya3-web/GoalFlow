// Powered by OnSpace.AI — Create Goal
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGoals } from '@/hooks/useGoals';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow, getCategoryColor } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { GoalCategory, Priority, WeekDay, FrequencyType } from '@/types';

const CATEGORIES: GoalCategory[] = ['Health', 'Learning', 'Career', 'Personal', 'Finance', 'Relationships', 'Productivity', 'Custom'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT: Record<WeekDay, string> = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
const FREQ_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

const TIMES = ['06:00','07:00','08:00','09:00','12:00','13:00','17:00','18:00','19:00','20:00','21:00','22:00'];

export default function CreateGoalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createGoal } = useGoals();
  const { showAlert } = useAlert();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('weekly');
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>(['Monday', 'Wednesday', 'Friday']);
  const [preferredTime, setPreferredTime] = useState('07:00');
  const [duration, setDuration] = useState('30');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDay = (day: WeekDay) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!title.trim()) e.title = 'Goal title is required';
      if (!description.trim()) e.description = 'Description is required';
    }
    if (step === 1) {
      if (!targetDate) e.targetDate = 'Target date is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const handleCreate = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    try {
      await createGoal({
        title: title.trim(),
        description: description.trim(),
        why: why.trim() || undefined,
        category,
        priority,
        startDate,
        targetDate: targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        routine: {
          frequencyType: frequency,
          preferredDays: selectedDays,
          preferredTime,
          durationMinutes: parseInt(duration) || 30,
        },
      });
      router.back();
    } catch {
      showAlert('Error', 'Failed to create goal. Please try again.');
    }
    setIsLoading(false);
  };

  const STEPS = ['Goal Details', 'Timeline & Priority', 'Routine Setup'];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title="Create Goal"
        showBack
        subtitle={`Step ${step + 1} of ${STEPS.length}`}
      />

      {/* Step progress */}
      <View style={styles.stepBar}>
        {STEPS.map((s, i) => (
          <View key={i} style={[styles.stepItem, i < step && styles.stepDone, i === step && styles.stepActive]}>
            <View style={[styles.stepCircle, i < step && styles.stepCircleDone, i === step && styles.stepCircleActive]}>
              {i < step ? (
                <MaterialIcons name="check" size={14} color={Colors.textInverse} />
              ) : (
                <Text style={[styles.stepNum, i === step && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]} numberOfLines={1}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What is your goal?</Text>
            <Input label="Goal title *" value={title} onChangeText={setTitle} placeholder="e.g. Improve physical fitness" error={errors.title} />
            <Input label="Description *" value={description} onChangeText={setDescription} placeholder="Describe what you want to achieve..." multiline numberOfLines={4} textAlignVertical="top" error={errors.description} />
            <Input label="Why does this matter to you?" value={why} onChangeText={setWhy} placeholder="Your motivation..." multiline numberOfLines={3} textAlignVertical="top" />

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.chipGrid}>
              {CATEGORIES.map(c => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.categoryChip, category === c && { backgroundColor: getCategoryColor(c), borderColor: getCategoryColor(c) }]}
                >
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(c) }]} />
                  <Text style={[styles.categoryLabel, category === c && styles.categoryLabelActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Timeline & Priority</Text>
            <Input
              label="Target date *"
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD (e.g. 2025-12-31)"
              keyboardType="numbers-and-punctuation"
              error={errors.targetDate}
              hint="Format: YYYY-MM-DD"
            />

            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map(p => {
                const colors = { low: Colors.success, medium: Colors.warning, high: Colors.error };
                const isSelected = priority === p;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[styles.priorityBtn, isSelected && { backgroundColor: colors[p], borderColor: colors[p] }]}
                  >
                    <MaterialIcons name="flag" size={18} color={isSelected ? Colors.textInverse : colors[p]} />
                    <Text style={[styles.priorityLabel, isSelected && styles.priorityLabelActive]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Set your routine</Text>

            <Text style={styles.fieldLabel}>Frequency</Text>
            <View style={styles.freqRow}>
              {FREQ_OPTIONS.map(f => (
                <Pressable
                  key={f.value}
                  onPress={() => setFrequency(f.value)}
                  style={[styles.freqBtn, frequency === f.value && styles.freqBtnActive]}
                >
                  <Text style={[styles.freqLabel, frequency === f.value && styles.freqLabelActive]}>{f.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Preferred Days</Text>
            <View style={styles.daysRow}>
              {DAYS.map(day => (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[styles.dayBtn, selectedDays.includes(day) && styles.dayBtnActive]}
                >
                  <Text style={[styles.dayBtnLabel, selectedDays.includes(day) && styles.dayBtnLabelActive]}>
                    {DAY_SHORT[day].slice(0, 2)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Preferred Time</Text>
            <View style={styles.timesGrid}>
              {TIMES.map(t => (
                <Pressable
                  key={t}
                  onPress={() => setPreferredTime(t)}
                  style={[styles.timeChip, preferredTime === t && styles.timeChipActive]}
                >
                  <Text style={[styles.timeChipLabel, preferredTime === t && styles.timeChipLabelActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>

            <Input
              label="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="number-pad"
              placeholder="30"
            />
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        {step > 0 ? (
          <Button label="Back" onPress={() => setStep(s => s - 1)} variant="secondary" style={styles.backBtn} />
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button label="Continue" onPress={handleNext} variant="primary" style={styles.continueBtn} />
        ) : (
          <Button label="Create Goal" onPress={handleCreate} isLoading={isLoading} variant="primary" style={styles.continueBtn} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  stepBar: { flexDirection: 'row', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.xs },
  stepItem: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  stepDone: {},
  stepActive: {},
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleDone: { backgroundColor: Colors.success },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepNum: { fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textTertiary },
  stepNumActive: { color: Colors.textInverse },
  stepLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  stepLabelActive: { color: Colors.primary, fontWeight: Typography.semibold },
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },
  stepContent: { gap: Spacing.base },
  stepTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  fieldLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryLabel: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  categoryLabelActive: { color: Colors.textInverse },
  priorityRow: { flexDirection: 'row', gap: Spacing.md },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  priorityLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  priorityLabelActive: { color: Colors.textInverse },
  freqRow: { flexDirection: 'row', gap: Spacing.md },
  freqBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center' },
  freqBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  freqLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  freqLabelActive: { color: Colors.textInverse },
  daysRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  dayBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayBtnLabel: { fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textSecondary },
  dayBtnLabelActive: { color: Colors.textInverse },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  timeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeChipLabel: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  timeChipLabelActive: { color: Colors.textInverse },
  footer: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingHorizontal: Spacing.base, paddingTop: Spacing.base, flexDirection: 'row', gap: Spacing.md },
  backBtn: { width: 100 },
  continueBtn: { flex: 1 },
});
