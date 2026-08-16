// Powered by OnSpace.AI
// Core type definitions for the GoalFlow app

export type GoalCategory =
  | 'Health'
  | 'Learning'
  | 'Career'
  | 'Personal'
  | 'Finance'
  | 'Relationships'
  | 'Productivity'
  | 'Custom';

export type GoalStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived';

export type GoalProgressStatus =
  | 'on_track'
  | 'needs_attention'
  | 'behind'
  | 'ahead'
  | 'completed';

export type ActionStatus =
  | 'upcoming'
  | 'in_progress'
  | 'completed'
  | 'missed'
  | 'skipped';

export type Priority = 'low' | 'medium' | 'high';

export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface Routine {
  frequencyType: FrequencyType;
  daysPerWeek?: number;
  preferredDays: WeekDay[];
  preferredTime: string; // "HH:mm"
  durationMinutes: number;
}

export interface Action {
  id: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  preferredTime?: string;
  estimatedDurationMinutes?: number;
  frequency?: FrequencyType;
  priority: Priority;
  status: ActionStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  targetDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  actions: Action[];
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  why?: string;
  category: GoalCategory;
  customCategory?: string;
  priority: Priority;
  status: GoalStatus;
  progressStatus: GoalProgressStatus;
  startDate: string;
  targetDate: string;
  routine: Routine;
  milestones: Milestone[];
  actions: Action[];
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReflection {
  id: string;
  userId: string;
  weekStart: string;
  wentWell?: string;
  challenges?: string;
  improvements?: string;
  createdAt: string;
}

export interface UserPreferences {
  preferredTime: 'morning' | 'afternoon' | 'evening';
  preferredDays: WeekDay[];
  progressStyle: 'detailed' | 'simple';
  weeklyTarget: number;
  reminderEnabled: boolean;
  reminderTime?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUri?: string;
  mainObjective?: string;
  preferences: UserPreferences;
  streakDays: number;
  joinedAt: string;
}

export interface ConsistencyStats {
  currentStreak: number;
  longestStreak: number;
  thisWeekCompleted: number;
  thisWeekPlanned: number;
  monthlyCompletionRate: number;
  totalActionsCompleted: number;
}
