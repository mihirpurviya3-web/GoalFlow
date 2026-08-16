// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeeklyReflection } from '@/types';
import { MOCK_REFLECTIONS } from '@/constants/mockData';

const KEY = '@goalflow_reflections';

const init = async (): Promise<WeeklyReflection[]> => {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  await AsyncStorage.setItem(KEY, JSON.stringify(MOCK_REFLECTIONS));
  return MOCK_REFLECTIONS;
};

export const reflectionService = {
  async getAll(): Promise<WeeklyReflection[]> {
    return init();
  },

  async getLatest(): Promise<WeeklyReflection | undefined> {
    const all = await init();
    return all.sort((a, b) => b.weekStart.localeCompare(a.weekStart))[0];
  },

  async save(data: Omit<WeeklyReflection, 'id' | 'userId' | 'createdAt'>): Promise<WeeklyReflection> {
    const all = await init();
    const reflection: WeeklyReflection = {
      id: `ref-${Date.now()}`,
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      ...data,
    };
    await AsyncStorage.setItem(KEY, JSON.stringify([reflection, ...all]));
    return reflection;
  },
};
