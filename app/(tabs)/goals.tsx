// Powered by OnSpace.AI — Goals List
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGoals } from '@/hooks/useGoals';
import { Colors, Typography, Spacing, Radius, Shadow, getCategoryColor } from '@/constants/theme';
import { GoalCard } from '@/components/feature/GoalCard';
import { GoalStatus } from '@/types';

const FILTERS: { label: string; value: GoalStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { goals, isLoading } = useGoals();
  const [filter, setFilter] = useState<GoalStatus | 'all'>('all');

  const filtered = filter === 'all' ? goals : goals.filter(g => g.status === filter);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Goals</Text>
          <Text style={styles.subtitle}>{goals.length} goal{goals.length !== 1 ? 's' : ''} total</Text>
        </View>
        <Pressable onPress={() => router.push('/goals/create')} style={styles.createBtn}>
          <MaterialIcons name="add" size={22} color={Colors.textInverse} />
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTERS.map(f => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
            >
              <Text style={[styles.filterLabel, filter === f.value && styles.filterLabelActive]}>
                {f.label}
              </Text>
              {f.value !== 'all' ? (
                <Text style={[styles.filterCount, filter === f.value && styles.filterCountActive]}>
                  {goals.filter(g => g.status === f.value).length}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Goals list */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="track-changes" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>
            {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'all' ? 'Tap + to create your first goal' : 'Goals with this status will appear here'}
          </Text>
          {filter === 'all' ? (
            <Pressable style={styles.createCta} onPress={() => router.push('/goals/create')}>
              <MaterialIcons name="add" size={18} color={Colors.textInverse} />
              <Text style={styles.createCtaText}>Create Goal</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GoalCard
              goal={item}
              onPress={() => router.push(`/goals/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  title: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.sm, color: Colors.textTertiary, marginTop: 2 },
  createBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  filterBar: { marginBottom: Spacing.md },
  filterContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.base, height: 36, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  filterLabelActive: { color: Colors.textInverse },
  filterCount: { fontSize: 11, fontWeight: Typography.bold, color: Colors.textTertiary, backgroundColor: Colors.border, width: 18, height: 18, borderRadius: 9, textAlign: 'center', lineHeight: 18 },
  filterCountActive: { color: Colors.primary, backgroundColor: 'rgba(255,255,255,0.3)' },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing['2xl'] },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: Typography.sm * Typography.relaxed },
  createCta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, ...Shadow.md },
  createCtaText: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },
});
