// Powered by OnSpace.AI
// Splash screen with auth routing
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading, isOnboarded } = useAuth();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (isLoggedIn && isOnboarded) {
        router.replace('/(tabs)');
      } else if (isLoggedIn && !isOnboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/auth/login');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isLoading, isLoggedIn, isOnboarded]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrapper, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logo}>
          <MaterialIcons name="track-changes" size={48} color={Colors.textInverse} />
        </View>
        <Text style={styles.appName}>GoalFlow</Text>
        <Text style={styles.tagline}>Turn intentions into actions</Text>
      </Animated.View>
      <Animated.View style={[styles.footer, { opacity }]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: { alignItems: 'center', gap: Spacing.md },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.textInverse,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: Typography.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: Colors.textInverse, width: 24, borderRadius: 4 },
});
