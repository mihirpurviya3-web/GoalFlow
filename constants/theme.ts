// Powered by OnSpace.AI
// Design tokens for GoalFlow

export const Colors = {
  // Brand
  primary: '#7C5CBF',
  primaryLight: '#9B7DD4',
  primaryDark: '#5A3D9A',
  primarySurface: '#F0EBF9',

  // Emphasis / Accent
  emphasis: '#F59E0B',
  emphasisLight: '#FDE68A',
  emphasisDark: '#D97706',
  emphasisSurface: '#FFFBEB',

  // Semantic
  success: '#10B981',
  successSurface: '#ECFDF5',
  warning: '#F59E0B',
  warningSurface: '#FFFBEB',
  error: '#EF4444',
  errorSurface: '#FEF2F2',
  info: '#3B82F6',
  infoSurface: '#EFF6FF',

  // Base surfaces
  background: '#F7F6FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FDFCFF',
  surfaceSecondary: '#F0EDF7',
  border: '#E8E2F5',
  borderLight: '#F0EBF9',

  // Text
  textPrimary: '#1A0F3C',
  textSecondary: '#6B5A8E',
  textTertiary: '#9B8BB5',
  textInverse: '#FFFFFF',
  textMuted: '#C4B8D9',

  // Category colors
  categoryHealth: '#10B981',
  categoryLearning: '#3B82F6',
  categoryCareer: '#8B5CF6',
  categoryPersonal: '#EC4899',
  categoryFinance: '#F59E0B',
  categoryRelationships: '#EF4444',
  categoryProductivity: '#6366F1',
  categoryCustom: '#14B8A6',

  // Status colors
  onTrack: '#10B981',
  needsAttention: '#F59E0B',
  behind: '#EF4444',
  ahead: '#3B82F6',
  completed: '#8B5CF6',

  // Dark overlay
  overlay: 'rgba(26, 15, 60, 0.5)',
  overlayLight: 'rgba(26, 15, 60, 0.1)',
};

export const Typography = {
  // Sizes (based on 16px scale 1.25)
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 22,
  '2xl': 26,
  '3xl': 32,
  '4xl': 40,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.8,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#7C5CBF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const getCategoryColor = (category: string): string => {
  const map: Record<string, string> = {
    Health: Colors.categoryHealth,
    Learning: Colors.categoryLearning,
    Career: Colors.categoryCareer,
    Personal: Colors.categoryPersonal,
    Finance: Colors.categoryFinance,
    Relationships: Colors.categoryRelationships,
    Productivity: Colors.categoryProductivity,
    Custom: Colors.categoryCustom,
  };
  return map[category] ?? Colors.categoryCustom;
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    on_track: Colors.onTrack,
    needs_attention: Colors.needsAttention,
    behind: Colors.behind,
    ahead: Colors.ahead,
    completed: Colors.completed,
  };
  return map[status] ?? Colors.textSecondary;
};

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    on_track: 'On Track',
    needs_attention: 'Needs Attention',
    behind: 'Behind',
    ahead: 'Ahead',
    completed: 'Completed',
  };
  return map[status] ?? status;
};
