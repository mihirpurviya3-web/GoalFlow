// Powered by OnSpace.AI
// Goals CRUD service (mocked with AsyncStorage for V1)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, Milestone, GoalCategory, Priority, Routine, GoalProgressStatus } from '@/types';
import { MOCK_GOALS } from '@/constants/mockData';

const GOALS_KEY = '@goalflow_goals';

const initGoals = async (): Promise<Goal[]> => {
  const raw = await AsyncStorage.getItem(GOALS_KEY);
  if (raw) return JSON.parse(raw);
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(MOCK_GOALS));
  return MOCK_GOALS;
};

const saveGoals = async (goals: Goal[]) => {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const calculateProgressStatus = (goal: Goal): GoalProgressStatus => {
  const now = new Date();
  const start = new Date(goal.startDate);
  const target = new Date(goal.targetDate);
  const totalDays = (target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const expectedPercent = Math.min(100, (elapsedDays / totalDays) * 100);

  if (goal.status === 'completed') return 'completed';
  const diff = goal.progressPercent - expectedPercent;
  if (diff >= 10) return 'ahead';
  if (diff >= -5) return 'on_track';
  if (diff >= -20) return 'needs_attention';
  return 'behind';
};

export const goalsService = {
  async getAll(): Promise<Goal[]> {
    return initGoals();
  },

  async getById(id: string): Promise<Goal | undefined> {
    const goals = await initGoals();
    return goals.find(g => g.id === id);
  },

  async create(data: {
    title: string;
    description: string;
    why?: string;
    category: GoalCategory;
    customCategory?: string;
    priority: Priority;
    startDate: string;
    targetDate: string;
    routine: Routine;
  }): Promise<Goal> {
    const goals = await initGoals();
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: 'user-1',
      ...data,
      status: 'active',
      progressStatus: 'on_track',
      milestones: [],
      actions: [],
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveGoals([newGoal, ...goals]);
    return newGoal;
  },

  async update(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goals = await initGoals();
    const idx = goals.findIndex(g => g.id === id);
    if (idx === -1) return undefined;
    goals[idx] = { ...goals[idx], ...updates, updatedAt: new Date().toISOString() };
    goals[idx].progressStatus = calculateProgressStatus(goals[idx]);
    await saveGoals(goals);
    return goals[idx];
  },

  async addMilestone(goalId: string, milestone: Omit<Milestone, 'id' | 'goalId' | 'actions' | 'createdAt'>): Promise<Milestone> {
    const goals = await initGoals();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) throw new Error('Goal not found');
    const newMilestone: Milestone = {
      id: `ms-${Date.now()}`,
      goalId,
      actions: [],
      createdAt: new Date().toISOString(),
      ...milestone,
    };
    goal.milestones.push(newMilestone);
    goal.updatedAt = new Date().toISOString();
    await saveGoals(goals);
    return newMilestone;
  },

  async updateMilestone(goalId: string, milestoneId: string, updates: Partial<Milestone>): Promise<void> {
    const goals = await initGoals();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const ms = goal.milestones.find(m => m.id === milestoneId);
    if (!ms) return;
    Object.assign(ms, updates);
    await saveGoals(goals);
  },

  async delete(id: string): Promise<void> {
    const goals = await initGoals();
    await saveGoals(goals.filter(g => g.id !== id));
  },

  async pause(id: string): Promise<void> {
    await goalsService.update(id, { status: 'paused' });
  },

  async resume(id: string): Promise<void> {
    await goalsService.update(id, { status: 'active' });
  },

  async complete(id: string): Promise<void> {
    await goalsService.update(id, { status: 'completed', progressStatus: 'completed', progressPercent: 100 });
  },
};
