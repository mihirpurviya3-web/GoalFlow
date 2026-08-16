// Powered by OnSpace.AI
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated,
  Dimensions, Platform, KeyboardAvoidingView, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WeekDay } from '@/types';

const { width } = Dimensions.get('window');

const DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_LABELS: Record<WeekDay, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};
const TIMES = ['morning', 'afternoon', 'evening'] as const;
const TIME_ICONS: Record<string, string> = { morning: 'wb-sunny', afternoon: 'wb-cloudy', evening: 'nights-stay' };

const STEPS = [
  {
    image: require('@/assets/images/onboarding1.png'),
    title: 'Set Goals That Matter',
    subtitle: 'Define what you want to achieve and understand the why behind each goal.',
  },
  {
    image: require('@/assets/images/onboarding2.png'),
    title: 'Break It Down',
    subtitle: 'Divide big goals into milestones and daily actions you can act on.',
  },
  {
    image: require('@/assets/images/onboarding3.png'),
    title: 'Track & Improve',
    subtitle: 'Understand your progress and build consistency over time.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateProfile, completeOnboarding } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState(0); // 0-2: onboarding slides, 3-6: setup steps
  const [name, setName] = useState(user?.name ?? '');
  const [objective, setObjective] = useState('');
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>(['Monday', 'Wednesday', 'Friday']);
  const [weeklyTarget, setWeeklyTarget] = useState('5');
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day: WeekDay) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      scrollRef.current?.scrollTo({ x: (step + 1) * width, animated: true });
      setStep(step + 1);
    } else {
      setStep(STEPS.length);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    await updateProfile({
      name: name || user?.name || 'Friend',
      mainObjective: objective,
      preferences: {
        preferredTime,
        preferredDays: selectedDays,
        progressStyle: 'detailed',
        weeklyTarget: parseInt(weeklyTarget) || 5,
        reminderEnabled: true,
        reminderTime: preferredTime === 'morning' ? '08:00' : preferredTime === 'afternoon' ? '13:00' : '20:00',
      },
    });
    await completeOnboarding();
    setIsSaving(false);
    router.replace('/(tabs)');
  };

  const isSetupStep = step >= STEPS.length;
  const setupStep = step - STEPS.length;

  if (isSetupStep) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.setupContainer, { paddingTop: insets.top + Spacing.xl }]}>
          {/* Progress */}
          <View style={styles.setupProgress}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.setupDot, i <= setupStep && styles.setupDotActive]} />
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.setupContent}>
            {setupStep === 0 && (
              <View style={styles.setupStep}>
                <Text style={styles.setupTitle}>What should we call you?</Text>
                <Text style={styles.setupSubtitle}>Personalize your experience</Text>
                <Input
                  label="Your name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  autoFocus
                />
                <View style={styles.spacer} />
                <Input
                  label="Main objective (optional)"
                  value={objective}
                  onChangeText={setObjective}
                  placeholder="e.g. Build a healthier lifestyle"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            )}

            {setupStep === 1 && (
              <View style={styles.setupStep}>
                <Text style={styles.setupTitle}>When do you prefer to work?</Text>
                <Text style={styles.setupSubtitle}>We will schedule actions around your preference</Text>
                <View style={styles.timeOptions}>
                  {TIMES.map(t => (
                    <Pressable
                      key={t}
                      onPress={() => setPreferredTime(t)}
                      style={[styles.timeOption, preferredTime === t && styles.timeOptionSelected]}
                    >
                      <MaterialIcons
                        name={TIME_ICONS[t] as any}
                        size={28}
                        color={preferredTime === t ? Colors.textInverse : Colors.primary}
                      />
                      <Text style={[styles.timeLabel, preferredTime === t && styles.timeLabelSelected]}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {setupStep === 2 && (
              <View style={styles.setupStep}>
                <Text style={styles.setupTitle}>Preferred days?</Text>
                <Text style={styles.setupSubtitle}>Choose the days you plan to work on your goals</Text>
                <View style={styles.daysGrid}>
                  {DAYS.map(day => (
                    <Pressable
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={[styles.dayChip, selectedDays.includes(day) && styles.dayChipSelected]}
                    >
                      <Text style={[styles.dayLabel, selectedDays.includes(day) && styles.dayLabelSelected]}>
                        {DAY_LABELS[day]}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.spacer} />
                <Input
                  label="Weekly target (actions per week)"
                  value={weeklyTarget}
                  onChangeText={setWeeklyTarget}
                  keyboardType="number-pad"
                  placeholder="5"
                />
              </View>
            )}

            {setupStep === 3 && (
              <View style={styles.setupStep}>
                <View style={styles.readyIcon}>
                  <MaterialIcons name="rocket-launch" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.setupTitle}>You are ready!</Text>
                <Text style={styles.setupSubtitle}>
                  Your personalized goal journey starts now. Create your first goal and start building momentum.
                </Text>
                <View style={styles.summaryCard}>
                  <SummaryRow icon="person" label="Name" value={name || 'Friend'} />
                  <SummaryRow icon={TIME_ICONS[preferredTime] as string} label="Preferred time" value={preferredTime} />
                  <SummaryRow icon="calendar-today" label="Active days" value={`${selectedDays.length} days/week`} />
                  <SummaryRow icon="track-changes" label="Weekly target" value={`${weeklyTarget} actions`} />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={[styles.setupFooter, { paddingBottom: insets.bottom + Spacing.base }]}>
            {setupStep < 3 ? (
              <View style={styles.setupButtons}>
                {setupStep > 0 ? (
                  <Button label="Back" onPress={() => setStep(step - 1)} variant="ghost" style={styles.backBtn} />
                ) : null}
                <Button
                  label="Continue"
                  onPress={() => setStep(step + 1)}
                  variant="primary"
                  fullWidth={setupStep === 0}
                  style={setupStep > 0 ? styles.continueBtn : undefined}
                />
              </View>
            ) : (
              <Button
                label="Start My Journey"
                onPress={handleFinish}
                isLoading={isSaving}
                variant="primary"
                fullWidth
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Onboarding slides
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setStep(idx);
        }}
      >
        {STEPS.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Image source={s.image} style={styles.slideImage} contentFit="cover" />
            <View style={styles.slideContent}>
              <Text style={styles.slideTitle}>{s.title}</Text>
              <Text style={styles.slideSubtitle}>{s.subtitle}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={[styles.dotItem, { width: dotWidth, opacity }]} />
          );
        })}
      </View>

      {/* Footer */}
      <View style={[styles.slideFooter, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Pressable onPress={() => { setStep(STEPS.length); }}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <Button label={step === STEPS.length - 1 ? "Get Started" : "Next"} onPress={nextStep} variant="primary" size="lg" />
      </View>
    </View>
  );
}

const SummaryRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.summaryRow}>
    <MaterialIcons name={icon as any} size={18} color={Colors.primary} />
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.textPrimary },
  slide: { flex: 1 },
  slideImage: { flex: 1, width: '100%' },
  slideContent: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.md,
  },
  slideTitle: { fontSize: Typography['3xl'], fontWeight: Typography.extrabold, color: Colors.textInverse, lineHeight: Typography['3xl'] * Typography.tight },
  slideSubtitle: { fontSize: Typography.md, color: 'rgba(255,255,255,0.75)', lineHeight: Typography.md * Typography.relaxed },
  dots: { position: 'absolute', bottom: 120, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs },
  dotItem: { height: 8, borderRadius: 4, backgroundColor: Colors.textInverse },
  slideFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing['2xl'] },
  skipText: { fontSize: Typography.base, color: 'rgba(255,255,255,0.6)', fontWeight: Typography.medium },
  setupContainer: { flex: 1, backgroundColor: Colors.background },
  setupProgress: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing['2xl'], marginBottom: Spacing.xl },
  setupDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  setupDotActive: { backgroundColor: Colors.primary },
  setupContent: { paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing['2xl'] },
  setupStep: { gap: Spacing.xl },
  setupTitle: { fontSize: Typography['2xl'], fontWeight: Typography.extrabold, color: Colors.textPrimary },
  setupSubtitle: { fontSize: Typography.md, color: Colors.textSecondary, lineHeight: Typography.md * Typography.relaxed, marginTop: -Spacing.md },
  timeOptions: { flexDirection: 'row', gap: Spacing.md },
  timeOption: { flex: 1, backgroundColor: Colors.primarySurface, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', gap: Spacing.sm, borderWidth: 2, borderColor: 'transparent' },
  timeOptionSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.primary },
  timeLabelSelected: { color: Colors.textInverse },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dayChip: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  dayChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.primary },
  dayLabelSelected: { color: Colors.textInverse },
  spacer: { height: Spacing.sm },
  setupFooter: { paddingHorizontal: Spacing['2xl'], paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  setupButtons: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  backBtn: { paddingHorizontal: Spacing.base },
  continueBtn: { flex: 1 },
  readyIcon: { width: 96, height: 96, borderRadius: Radius['2xl'], backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md, ...Shadow.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  summaryLabel: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
  summaryValue: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary, textTransform: 'capitalize' },
});
