// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export const Badge = React.memo(({ label, color, bgColor, size = 'md' }: BadgeProps) => {
  const textColor = color ?? Colors.primary;
  const bg = bgColor ?? Colors.primarySurface;

  return (
    <View style={[styles.badge, size === 'sm' ? styles.sm : styles.md, { backgroundColor: bg }]}>
      <Text style={[styles.label, size === 'sm' ? styles.labelSm : styles.labelMd, { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  md: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  label: { fontWeight: Typography.semibold },
  labelSm: { fontSize: 10 },
  labelMd: { fontSize: Typography.xs },
});
