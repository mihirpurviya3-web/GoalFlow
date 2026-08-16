// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Action, ActionStatus, Priority, FrequencyType } from '@/types';
import { actionsService } from '@/services/actionsService';
import { ConsistencyStats } from '@/types';
import { AuthContext } from './AuthContext';

interface ActionsContextType {
  actions: Action[];
  todayActions: Action[];
  isLoading: boolean;
  consistency: ConsistencyStats;
  refresh: () => Promise<void>;
  createAction: (data: {
    goalId: string;
    milestoneId?: string;
    title: string;
    description?: string;
    dueDate: string;
    preferredTime?: string;
    estimatedDurationMinutes?: number;
    frequency?: FrequencyType;
    priority: Priority;
  }) => Promise<Action>;
  updateStatus: (id: string, status: ActionStatus) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}

export const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export function ActionsProvider({ children }: { children: ReactNode }) {
  const auth = React.useContext(AuthContext);
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await actionsService.getAll();
    setActions(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (auth?.isLoggedIn) refresh();
  }, [auth?.isLoggedIn, refresh]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActions = actions.filter(a => a.dueDate === todayStr);
  const consistency = actionsService.getConsistencyStats(actions);

  const createAction = async (data: Parameters<typeof actionsService.create>[0]) => {
    const action = await actionsService.create(data);
    setActions(prev => [...prev, action]);
    return action;
  };

  const updateStatus = async (id: string, status: ActionStatus) => {
    await actionsService.updateStatus(id, status);
    setActions(prev => prev.map(a =>
      a.id === id ? {
        ...a,
        status,
        updatedAt: new Date().toISOString(),
        completedAt: status === 'completed' ? new Date().toISOString() : a.completedAt,
      } : a
    ));
  };

  const deleteAction = async (id: string) => {
    await actionsService.delete(id);
    setActions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ActionsContext.Provider value={{
      actions, todayActions, isLoading, consistency,
      refresh, createAction, updateStatus, deleteAction,
    }}>
      {children}
    </ActionsContext.Provider>
  );
}
