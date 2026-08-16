// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: { icon: string; onPress: () => void; label?: string };
  rightText?: { label: string; onPress: () => void };
  transparent?: boolean;
}

export const ScreenHeader = React.memo(({
  title, subtitle, showBack = false, rightAction, rightText, transparent = false,
}: ScreenHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.header,
      { paddingTop: insets.top + Spacing.md },
      transparent && styles.transparent,
    ]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
        ) : <View style={styles.placeholder} />}

        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        {rightAction ? (
          <Pressable onPress={rightAction.onPress} style={styles.rightBtn} hitSlop={8}>
            <MaterialIcons name={rightAction.icon as any} size={24} color={Colors.primary} />
          </Pressable>
        ) : rightText ? (
          <Pressable onPress={rightText.onPress} style={styles.rightBtn} hitSlop={8}>
            <Text style={styles.rightText}>{rightText.label}</Text>
          </Pressable>
        ) : <View style={styles.placeholder} />}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  transparent: { backgroundColor: 'transparent', borderBottomWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', height: 44 },
  backBtn: { width: 40, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  placeholder: { width: 40 },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.xs, color: Colors.textTertiary },
  rightBtn: { width: 40, height: 44, alignItems: 'flex-end', justifyContent: 'center' },
  rightText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semibold },
});
