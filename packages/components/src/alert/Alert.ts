import { AlertContextType } from './types';
import { createContext, useContext } from 'react';

export const AlertContext = createContext<AlertContextType>({} as any);

/**
 * Hook to access the context easily
 */
export function useAlert(): AlertContextType {
  return useContext(AlertContext);
}
