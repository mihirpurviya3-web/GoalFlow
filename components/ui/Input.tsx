// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.memo(({
  label, error, hint, containerStyle, leftIcon, rightIcon, style, ...props
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[
        styles.inputWrapper,
        focused && styles.inputFocused,
        error ? styles.inputError : null,
      ]}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeft : null, style]}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          {...props}
        />
        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    includeFontPadding: false,
  },
  inputWithLeft: { paddingLeft: Spacing.xs },
  iconLeft: { paddingLeft: Spacing.md },
  iconRight: { paddingRight: Spacing.md },
  error: { fontSize: Typography.xs, color: Colors.error },
  hint: { fontSize: Typography.xs, color: Colors.textTertiary },
});
