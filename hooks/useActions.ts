// Powered by OnSpace.AI
import { useContext } from 'react';
import { ActionsContext } from '@/contexts/ActionsContext';

export function useActions() {
  const context = useContext(ActionsContext);
  if (!context) throw new Error('useActions must be used within ActionsProvider');
  return context;
}
