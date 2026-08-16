// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      showAlert('Login Failed', result.error ?? 'Something went wrong. Please try again.');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <MaterialIcons name="track-changes" size={36} color={Colors.textInverse} />
          </View>
          <Text style={styles.appName}>GoalFlow</Text>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.subtitleText}>Sign in to continue your journey</Text>
        </View>

        {/* Mock notice */}
        <View style={styles.mockNotice}>
          <MaterialIcons name="info-outline" size={14} color={Colors.info} />
          <Text style={styles.mockText}>Mock Login — use any email & password (6+ chars)</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            leftIcon={<MaterialIcons name="email" size={18} color={Colors.textTertiary} />}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry={!showPassword}
            error={errors.password}
            leftIcon={<MaterialIcons name="lock" size={18} color={Colors.textTertiary} />}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={18} color={Colors.textTertiary} />
              </Pressable>
            }
          />
          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>

        <Button label="Sign In" onPress={handleLogin} isLoading={isLoading} fullWidth size="lg" />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to GoalFlow?</Text>
          <Pressable onPress={() => router.push('/auth/register')}>
            <Text style={styles.signupLink}> Create account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing['2xl'], gap: Spacing.xl },
  header: { alignItems: 'center', gap: Spacing.sm },
  logoBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
  appName: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.textPrimary },
  welcomeText: { fontSize: Typography['2xl'], fontWeight: Typography.bold, color: Colors.textPrimary, marginTop: Spacing.md },
  subtitleText: { fontSize: Typography.md, color: Colors.textSecondary },
  mockNotice: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.infoSurface, borderRadius: Radius.md, padding: Spacing.md },
  mockText: { fontSize: Typography.xs, color: Colors.info, flex: 1 },
  form: { gap: Spacing.base },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: Typography.sm, color: Colors.textTertiary },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: Typography.base, color: Colors.textSecondary },
  signupLink: { fontSize: Typography.base, color: Colors.primary, fontWeight: Typography.bold },
});
