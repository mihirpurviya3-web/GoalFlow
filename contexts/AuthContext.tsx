// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { UserProfile } from '@/types';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await authService.getSession();
      const onboarded = await authService.checkOnboarding();
      setIsLoggedIn(session.isLoggedIn);
      setUser(session.user ?? null);
      setIsOnboarded(onboarded);
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setIsLoggedIn(true);
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    if (result.success && result.user) {
      setIsLoggedIn(true);
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  };

  const logout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsOnboarded(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  const completeOnboarding = async () => {
    await authService.completeOnboarding();
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, isLoading, user, isOnboarded,
      login, register, logout, updateProfile, completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
