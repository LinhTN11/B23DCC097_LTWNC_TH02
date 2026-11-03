import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Exercise } from '../../types';

export const DEFAULT_REST_SECONDS = 10;
export let REST_SECONDS = DEFAULT_REST_SECONDS;

export const setRestSeconds = (seconds: number): void => {
  REST_SECONDS = seconds;
};

export const resetRestSeconds = (): void => {
  REST_SECONDS = DEFAULT_REST_SECONDS;
};

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  restRemaining: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      restRemaining: 0,

      startSession: (exercises: Exercise[], startIndex: number) => {
        if (!exercises || exercises.length === 0 || startIndex < 0 || startIndex >= exercises.length) {
          set({
            queue: exercises ?? [],
            currentIndex: -1,
            isRunning: false,
            elapsed: 0,
            restRemaining: 0,
          });
          return;
        }

        set({
          queue: exercises,
          currentIndex: startIndex,
          isRunning: true,
          elapsed: 0,
          restRemaining: 0,
        });
      },

      toggleRun: () => {
        const { queue, currentIndex, isRunning } = get();
        if (queue.length === 0) return;

        if (currentIndex === -1) {
          set({
            currentIndex: 0,
            isRunning: true,
            elapsed: 0,
            restRemaining: 0,
          });
        } else {
          set({ isRunning: !isRunning });
        }
      },

      next: () => {
        const { queue, currentIndex } = get();
        if (currentIndex >= queue.length - 1) {
          set({ isRunning: false, restRemaining: 0 });
        } else {
          set({
            currentIndex: currentIndex + 1,
            elapsed: 0,
            restRemaining: 0,
          });
        }
      },

      prev: () => {
        const { currentIndex, elapsed } = get();
        if (currentIndex < 0) return;

        if (elapsed > 3) {
          set({ elapsed: 0, restRemaining: 0 });
        } else if (currentIndex > 0) {
          set({
            currentIndex: currentIndex - 1,
            elapsed: 0,
            restRemaining: 0,
          });
        } else {
          set({ elapsed: 0, restRemaining: 0 });
        }
      },

      addToSession: (exercise: Exercise) => {
        const { queue } = get();
        if (queue.some((e) => e.id === exercise.id)) {
          return;
        }
        set({ queue: [...queue, exercise] });
      },

      tick: () => {
        const { queue, currentIndex, isRunning, elapsed, restRemaining } = get();
        if (!isRunning || currentIndex < 0 || currentIndex >= queue.length) {
          return;
        }

        if (restRemaining > 0) {
          set({ restRemaining: restRemaining - 1 });
          return;
        }

        const current = queue[currentIndex];
        if (elapsed + 1 >= current.duration) {
          if (currentIndex < queue.length - 1) {
            set({
              currentIndex: currentIndex + 1,
              elapsed: 0,
              restRemaining: REST_SECONDS,
            });
          } else {
            get().next();
          }
        } else {
          set({ elapsed: elapsed + 1 });
        }
      },
    }),
    { name: 'workout-session' },
  ),
);
