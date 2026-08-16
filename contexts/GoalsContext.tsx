// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Goal, Milestone, GoalCategory, Priority, Routine } from '@/types';
import { goalsService } from '@/services/goalsService';
import { AuthContext } from './AuthContext';

interface GoalsContextType {
  goals: Goal[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  createGoal: (data: {
    title: string;
    description: string;
    why?: string;
    category: GoalCategory;
    customCategory?: string;
    priority: Priority;
    startDate: string;
    targetDate: string;
    routine: Routine;
  }) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  pauseGoal: (id: string) => Promise<void>;
  resumeGoal: (id: string) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  addMilestone: (goalId: string, data: Omit<Milestone, 'id' | 'goalId' | 'actions' | 'createdAt'>) => Promise<Milestone>;
  getGoalById: (id: string) => Goal | undefined;
  activeGoals: Goal[];
}

export const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const auth = React.useContext(AuthContext);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await goalsService.getAll();
    setGoals(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (auth?.isLoggedIn) {
      refresh();
    }
  }, [auth?.isLoggedIn, refresh]);

  const createGoal = async (data: Parameters<typeof goalsService.create>[0]) => {
    const goal = await goalsService.create(data);
    setGoals(prev => [goal, ...prev]);
    return goal;
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    await goalsService.update(id, updates);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = async (id: string) => {
    await goalsService.delete(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const pauseGoal = async (id: string) => {
    await goalsService.pause(id);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: 'paused' } : g));
  };

  const resumeGoal = async (id: string) => {
    await goalsService.resume(id);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: 'active' } : g));
  };

  const completeGoal = async (id: string) => {
    await goalsService.complete(id);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: 'completed', progressPercent: 100 } : g));
  };

  const addMilestone = async (goalId: string, data: Omit<Milestone, 'id' | 'goalId' | 'actions' | 'createdAt'>) => {
    const ms = await goalsService.addMilestone(goalId, data);
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, milestones: [...g.milestones, ms] } : g));
    return ms;
  };

  const getGoalById = (id: string) => goals.find(g => g.id === id);
  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <GoalsContext.Provider value={{
      goals, isLoading, refresh,
      createGoal, updateGoal, deleteGoal,
      pauseGoal, resumeGoal, completeGoal,
      addMilestone, getGoalById, activeGoals,
    }}>
      {children}
    </GoalsContext.Provider>
  );
}
