// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.agreed = 'Please accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setIsLoading(false);
    if (result.success) {
      router.replace('/onboarding');
    } else {
      showAlert('Registration Failed', result.error ?? 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your goal journey today</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Alex Carter"
            autoCapitalize="words"
            error={errors.name}
            leftIcon={<MaterialIcons name="person" size={18} color={Colors.textTertiary} />}
          />
          <Input
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<MaterialIcons name="email" size={18} color={Colors.textTertiary} />}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry={!showPassword}
            error={errors.password}
            leftIcon={<MaterialIcons name="lock" size={18} color={Colors.textTertiary} />}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={18} color={Colors.textTertiary} />
              </Pressable>
            }
          />
          <Input
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat password"
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            leftIcon={<MaterialIcons name="lock-outline" size={18} color={Colors.textTertiary} />}
          />
        </View>

        <Pressable onPress={() => setAgreed(!agreed)} style={styles.agreeRow}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed ? <MaterialIcons name="check" size={14} color={Colors.textInverse} /> : null}
          </View>
          <Text style={styles.agreeText}>
            I agree to the{' '}
            <Text style={styles.agreeLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.agreeLink}>Privacy Policy</Text>
          </Text>
        </Pressable>
        {errors.agreed ? <Text style={styles.errorText}>{errors.agreed}</Text> : null}

        <Button label="Create Account" onPress={handleRegister} isLoading={isLoading} fullWidth size="lg" />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.loginLink}> Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing['2xl'], gap: Spacing.lg },
  header: { gap: Spacing.sm },
  backBtn: { marginBottom: Spacing.sm, alignSelf: 'flex-start' },
  title: { fontSize: Typography['2xl'], fontWeight: Typography.extrabold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.md, color: Colors.textSecondary },
  form: { gap: Spacing.base },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  checkbox: { width: 20, height: 20, borderRadius: Radius.sm, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  agreeText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * Typography.relaxed },
  agreeLink: { color: Colors.primary, fontWeight: Typography.semibold },
  errorText: { fontSize: Typography.xs, color: Colors.error, marginTop: -Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: Typography.base, color: Colors.textSecondary },
  loginLink: { fontSize: Typography.base, color: Colors.primary, fontWeight: Typography.bold },
});
