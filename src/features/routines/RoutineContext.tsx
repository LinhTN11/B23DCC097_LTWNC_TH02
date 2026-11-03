/* oxlint-disable react/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { Routine, RoutineAction } from './routineReducer';
import { routineReducer } from './routineReducer';
import { withLogger } from './withLogger';

export const ROUTINES_STORAGE_KEY = 'workout-routines';

export const RoutineStateContext = createContext<Routine[] | null>(null);
export const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | null>(null);

const loggedRoutineReducer = withLogger(routineReducer);

export function getStoredRoutines(): Routine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROUTINES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as Routine[];
      }
    }
  } catch (err) {
    console.error('Failed to load routines from localStorage:', err);
  }
  return [];
}

export interface RoutineProviderProps {
  children: ReactNode;
  initialRoutines?: Routine[];
}

export function RoutineProvider({
  children,
  initialRoutines,
}: RoutineProviderProps) {
  const [state, dispatch] = useReducer(
    loggedRoutineReducer,
    undefined,
    () => initialRoutines ?? getStoredRoutines(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save routines to localStorage:', err);
    }
  }, [state]);

  const stateValue = useMemo(() => state, [state]);
  const dispatchValue = useMemo(() => dispatch, [dispatch]);

  return (
    <RoutineStateContext.Provider value={stateValue}>
      <RoutineDispatchContext.Provider value={dispatchValue}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineStateContext.Provider>
  );
}

export function useRoutines(): Routine[] {
  const context = useContext(RoutineStateContext);
  if (context === null) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
}

export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const context = useContext(RoutineDispatchContext);
  if (context === null) {
    throw new Error('useRoutineDispatch must be used within a RoutineProvider');
  }
  return context;
}
