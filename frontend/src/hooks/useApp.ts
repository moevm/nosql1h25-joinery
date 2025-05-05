
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { AppContextType } from '@/contexts/AppContextType';

export const useApp = () => {
  const context = useContext<AppContextType | undefined>(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
