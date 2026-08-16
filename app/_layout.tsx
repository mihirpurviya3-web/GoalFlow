// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoalsProvider } from '@/contexts/GoalsContext';
import { ActionsProvider } from '@/contexts/ActionsContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <GoalsProvider>
            <ActionsProvider>
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/register" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="goals/create" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="goals/[id]" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="goals/[id]/edit" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="goals/[id]/milestone/create" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="actions/create" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="actions/today" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="reflection/weekly" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="settings/index" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="settings/notifications" options={{ animation: 'slide_from_right' }} />
              </Stack>
            </ActionsProvider>
          </GoalsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
