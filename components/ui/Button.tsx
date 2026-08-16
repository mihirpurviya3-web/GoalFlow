// Powered by OnSpace.AI
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button = React.memo(({
  label, onPress, variant = 'primary', size = 'md',
  isLoading = false, disabled = false, style, textStyle, fullWidth = false,
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.textInverse : Colors.primary}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`], textStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Shadow.sm,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  size_sm: { height: 36, paddingHorizontal: Spacing.md },
  size_md: { height: 48, paddingHorizontal: Spacing.xl },
  size_lg: { height: 56, paddingHorizontal: Spacing['2xl'] },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  label: { fontWeight: Typography.semibold },
  label_primary: { color: Colors.textInverse },
  label_secondary: { color: Colors.primary },
  label_ghost: { color: Colors.primary },
  label_danger: { color: Colors.textInverse },
  labelSize_sm: { fontSize: Typography.sm },
  labelSize_md: { fontSize: Typography.base },
  labelSize_lg: { fontSize: Typography.md },
});
