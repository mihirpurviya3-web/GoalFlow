// Powered by OnSpace.AI
// Actions CRUD service (mocked with AsyncStorage for V1)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action, ActionStatus, Priority, FrequencyType } from '@/types';
import { MOCK_GOALS } from '@/constants/mockData';
import { goalsService } from './goalsService';

const ACTIONS_KEY = '@goalflow_actions';

const getInitialActions = (): Action[] => {
  const actions: Action[] = [];
  MOCK_GOALS.forEach(g => {
    actions.push(...g.actions);
    g.milestones.forEach(m => actions.push(...m.actions));
  });
  return actions;
};

const initActions = async (): Promise<Action[]> => {
  const raw = await AsyncStorage.getItem(ACTIONS_KEY);
  if (raw) return JSON.parse(raw);
  const initial = getInitialActions();
  await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(initial));
  return initial;
};

const saveActions = async (actions: Action[]) => {
  await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
};

export const actionsService = {
  async getAll(): Promise<Action[]> {
    return initActions();
  },

  async getByGoal(goalId: string): Promise<Action[]> {
    const actions = await initActions();
    return actions.filter(a => a.goalId === goalId);
  },

  async getToday(): Promise<Action[]> {
    const actions = await initActions();
    const todayStr = new Date().toISOString().split('T')[0];
    return actions.filter(a => a.dueDate === todayStr);
  },

  async getByDateRange(start: string, end: string): Promise<Action[]> {
    const actions = await initActions();
    return actions.filter(a => a.dueDate >= start && a.dueDate <= end);
  },

  async create(data: {
    goalId: string;
    milestoneId?: string;
    title: string;
    description?: string;
    dueDate: string;
    preferredTime?: string;
    estimatedDurationMinutes?: number;
    frequency?: FrequencyType;
    priority: Priority;
  }): Promise<Action> {
    const actions = await initActions();
    const newAction: Action = {
      id: `act-${Date.now()}`,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    await saveActions([...actions, newAction]);

    // Also add to goal's actions list
    const goal = await goalsService.getById(data.goalId);
    if (goal) {
      if (data.milestoneId) {
        const ms = goal.milestones.find(m => m.id === data.milestoneId);
        if (ms) ms.actions.push(newAction);
      } else {
        goal.actions.push(newAction);
      }
      await goalsService.update(data.goalId, {
        milestones: goal.milestones,
        actions: goal.actions,
      });
    }

    return newAction;
  },

  async updateStatus(id: string, status: ActionStatus): Promise<void> {
    const actions = await initActions();
    const action = actions.find(a => a.id === id);
    if (!action) return;
    action.status = status;
    action.updatedAt = new Date().toISOString();
    if (status === 'completed') {
      action.completedAt = new Date().toISOString();
    }
    await saveActions(actions);

    // Update goal progress
    const goalActions = actions.filter(a => a.goalId === action.goalId);
    const completed = goalActions.filter(a => a.status === 'completed').length;
    const progressPercent = Math.round((completed / goalActions.length) * 100);
    await goalsService.update(action.goalId, { progressPercent });
  },

  async delete(id: string): Promise<void> {
    const actions = await initActions();
    await saveActions(actions.filter(a => a.id !== id));
  },

  getConsistencyStats(actions: Action[]) {
    const completed = actions.filter(a => a.status === 'completed');
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    const thisWeekAll = actions.filter(a => a.dueDate >= weekStartStr && a.dueDate <= todayStr);
    const thisWeekCompleted = thisWeekAll.filter(a => a.status === 'completed').length;
    const thisWeekPlanned = thisWeekAll.length;

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthActions = actions.filter(a => a.dueDate >= monthStart && a.dueDate <= todayStr);
    const monthCompleted = monthActions.filter(a => a.status === 'completed').length;
    const monthlyCompletionRate = monthActions.length > 0
      ? Math.round((monthCompleted / monthActions.length) * 100)
      : 0;

    // Simple streak: consecutive days with at least one completed action
    let streak = 0;
    const checkDate = new Date(now);
    while (streak < 365) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayCompleted = completed.some(a => a.completedAt?.startsWith(dateStr));
      if (!dayCompleted) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      currentStreak: streak,
      longestStreak: Math.max(streak, 12),
      thisWeekCompleted,
      thisWeekPlanned,
      monthlyCompletionRate,
      totalActionsCompleted: completed.length,
    };
  },
};
