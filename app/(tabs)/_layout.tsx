// Powered by OnSpace.AI
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { Colors, Typography, Radius, Shadow } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 68, android: insets.bottom + 68, default: 72 }),
    paddingTop: 10,
    paddingBottom: Platform.select({ ios: insets.bottom + 10, android: insets.bottom + 10, default: 10 }),
    paddingHorizontal: 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadow.md,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: Typography.semibold, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="track-changes" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.todayIcon, focused && styles.todayIconActive]}>
              <MaterialIcons name="check-circle" size={26} color={focused ? Colors.textInverse : color} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="insights" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  todayIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    ...Shadow.md,
  },
  todayIconActive: {
    backgroundColor: Colors.primary,
  },
});
