// Powered by OnSpace.AI
// Mock auth service — replace with OnSpace Cloud auth in V2

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';
import { MOCK_USER } from '@/constants/mockData';

const AUTH_KEY = '@goalflow_auth';
const PROFILE_KEY = '@goalflow_profile';

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    await new Promise(r => setTimeout(r, 800));
    if (!email || !password) {
      return { success: false, error: 'Please enter email and password.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const user = { ...MOCK_USER, email };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ isLoggedIn: true }));
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    await new Promise(r => setTimeout(r, 1000));
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const user: UserProfile = {
      ...MOCK_USER,
      id: `user-${Date.now()}`,
      name,
      email,
      streakDays: 0,
      joinedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ isLoggedIn: true }));
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  },

  async getSession(): Promise<{ isLoggedIn: boolean; user?: UserProfile }> {
    try {
      const auth = await AsyncStorage.getItem(AUTH_KEY);
      const profile = await AsyncStorage.getItem(PROFILE_KEY);
      if (auth && profile) {
        return { isLoggedIn: true, user: JSON.parse(profile) };
      }
    } catch {}
    return { isLoggedIn: false };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await AsyncStorage.getItem(PROFILE_KEY);
    const current = profile ? JSON.parse(profile) : MOCK_USER;
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },

  async checkOnboarding(): Promise<boolean> {
    const val = await AsyncStorage.getItem('@goalflow_onboarded');
    return val === 'true';
  },

  async completeOnboarding(): Promise<void> {
    await AsyncStorage.setItem('@goalflow_onboarded', 'true');
  },
};
