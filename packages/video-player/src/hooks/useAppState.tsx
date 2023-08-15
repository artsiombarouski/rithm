import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export type UseAppStateReturn = {
  appState: string;
  isAppFocused: boolean;
};

export function useAppState(): UseAppStateReturn {
  const [appState, setAppState] = useState(AppState.currentState);
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  }, []);
  useEffect(() => {
    const AppStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      AppStateListener.remove();
    };
  }, []);

  return { appState: appState, isAppFocused: appState === 'active' };
}
