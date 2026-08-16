// Powered by OnSpace.AI — Weekly Reflection
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActions } from '@/hooks/useActions';
import { useGoals } from '@/hooks/useGoals';
import { reflectionService } from '@/services/reflectionService';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { WeeklyReflection } from '@/types';

export default function WeeklyReflectionScreen() {
  const insets = useSafeAreaInsets();
  const { actions } = useActions();
  const { goals } = useGoals();
  const { showAlert } = useAlert();

  const [wentWell, setWentWell] = useState('');
  const [challenges, setChallenges] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedReflection, setSavedReflection] = useState<WeeklyReflection | undefined>();

  useEffect(() => {
    reflectionService.getLatest().then(r => {
      if (r) {
        setSavedReflection(r);
        setWentWell(r.wentWell ?? '');
        setChallenges(r.challenges ?? '');
        setImprovements(r.improvements ?? '');
      }
    });
  }, []);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const weekActions = actions.filter(a => a.dueDate >= weekStartStr && a.dueDate <= now.toISOString().split('T')[0]);
  const weekCompleted = weekActions.filter(a => a.status === 'completed');
  const weekMissed = weekActions.filter(a => a.status === 'missed');
  const completionRate = weekActions.length > 0 ? Math.round((weekCompleted.length / weekActions.length) * 100) : 0;

  const goalsWorkedOn = new Set(weekCompleted.map(a => a.goalId));
  const strongestGoal = goals.find(g => goalsWorkedOn.has(g.id) && g.progressPercent === Math.max(...goals.filter(g2 => goalsWorkedOn.has(g2.id)).map(g2 => g2.progressPercent)));

  const handleSave = async () => {
    setIsSaving(true);
    await reflectionService.save({
      weekStart: weekStartStr,
      wentWell: wentWell || undefined,
      challenges: challenges || undefined,
      improvements: improvements || undefined,
    });
    setIsSaving(false);
    showAlert('Saved', 'Your weekly reflection has been saved.');
  };

  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenHeader title="Weekly Reflection" showBack subtitle={weekLabel} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Week Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Week's Summary</Text>
          <View style={styles.summaryGrid}>
            <SummaryItem icon="check-circle" label="Completed" value={`${weekCompleted.length}`} color={Colors.success} />
            <SummaryItem icon="cancel" label="Missed" value={`${weekMissed.length}`} color={Colors.error} />
            <SummaryItem icon="percent" label="Rate" value={`${completionRate}%`} color={Colors.primary} />
            <SummaryItem icon="track-changes" label="Goals Active" value={`${goalsWorkedOn.size}`} color={Colors.info} />
          </View>
          {strongestGoal ? (
            <View style={styles.strongestRow}>
              <MaterialIcons name="star" size={16} color={Colors.emphasis} />
              <Text style={styles.strongestLabel}>Strongest area:</Text>
              <Text style={styles.strongestValue}>{strongestGoal.title}</Text>
            </View>
          ) : null}
        </View>

        {/* Upcoming priorities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Priorities</Text>
          {goals.filter(g => g.status === 'active').slice(0, 3).map(goal => (
            <View key={goal.id} style={styles.priorityItem}>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
              <Text style={styles.priorityText}>{goal.title}</Text>
              <Text style={styles.priorityPct}>{goal.progressPercent}%</Text>
            </View>
          ))}
        </View>

        {/* Reflection prompts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Reflection</Text>
          <Text style={styles.sectionSubtitle}>Optional — write whatever feels useful</Text>

          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <MaterialIcons name="sentiment-very-satisfied" size={20} color={Colors.success} />
              <Text style={styles.promptLabel}>What went well this week?</Text>
            </View>
            <Input value={wentWell} onChangeText={setWentWell} placeholder="Wins, breakthroughs, good habits..." multiline numberOfLines={3} textAlignVertical="top" />
          </View>

          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <MaterialIcons name="sentiment-dissatisfied" size={20} color={Colors.warning} />
              <Text style={styles.promptLabel}>What made things difficult?</Text>
            </View>
            <Input value={challenges} onChangeText={setChallenges} placeholder="Obstacles, distractions, challenges..." multiline numberOfLines={3} textAlignVertical="top" />
          </View>

          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <MaterialIcons name="lightbulb" size={20} color={Colors.primary} />
              <Text style={styles.promptLabel}>What would you like to improve?</Text>
            </View>
            <Input value={improvements} onChangeText={setImprovements} placeholder="Intentions and adjustments for next week..." multiline numberOfLines={3} textAlignVertical="top" />
          </View>
        </View>

        <Button label="Save Reflection" onPress={handleSave} isLoading={isSaving} fullWidth variant="primary" size="lg" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const SummaryItem = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <View style={styles.summaryItem}>
    <View style={[styles.summaryIcon, { backgroundColor: color + '18' }]}>
      <MaterialIcons name={icon as any} size={20} color={color} />
    </View>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.xl },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, gap: Spacing.md, ...Shadow.md },
  summaryTitle: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  summaryGrid: { flexDirection: 'row', gap: Spacing.sm },
  summaryItem: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  summaryIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  summaryLabel: { fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  strongestRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.emphasisSurface, borderRadius: Radius.md, padding: Spacing.md },
  strongestLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  strongestValue: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.emphasisDark, flex: 1 },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  sectionSubtitle: { fontSize: Typography.sm, color: Colors.textTertiary, marginTop: -Spacing.sm },
  priorityItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, ...Shadow.sm },
  priorityText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  priorityPct: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  promptCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md, ...Shadow.sm },
  promptHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  promptLabel: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary, flex: 1 },
});
