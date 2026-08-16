// Powered by OnSpace.AI — Create Milestone
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGoals } from '@/hooks/useGoals';
import { useAlert } from '@/template';
import { Colors, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

export default function CreateMilestoneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addMilestone } = useGoals();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return; }
    setIsLoading(true);
    try {
      await addMilestone(id ?? '', {
        title: title.trim(),
        description: description.trim() || undefined,
        targetDate: targetDate || undefined,
        status: 'pending',
      });
      router.back();
    } catch {
      showAlert('Error', 'Failed to create milestone.');
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader title="Add Milestone" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]} keyboardShouldPersistTaps="handled">
        <Input label="Milestone title *" value={title} onChangeText={setTitle} placeholder="e.g. Build basic vocabulary" error={errors.title} autoFocus />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="What will you achieve?" multiline numberOfLines={3} textAlignVertical="top" />
        <Input label="Target date" value={targetDate} onChangeText={setTargetDate} placeholder="YYYY-MM-DD" hint="Optional target completion date" />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button label="Add Milestone" onPress={handleCreate} isLoading={isLoading} fullWidth variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.base },
  footer: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
});
