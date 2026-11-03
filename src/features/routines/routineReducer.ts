export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export type RoutineAction =
  | {
      type: 'create';
      payload: {
        id: string;
        name: string;
        exerciseIds?: string[];
      };
    }
  | {
      type: 'rename';
      payload: {
        id: string;
        name: string;
      };
    }
  | {
      type: 'remove';
      payload: {
        id: string;
      };
    }
  | {
      type: 'addExercise';
      payload: {
        routineId: string;
        exerciseId: string;
      };
    }
  | {
      type: 'removeExercise';
      payload: {
        routineId: string;
        exerciseId: string;
      };
    };

export const initialRoutines: Routine[] = [];

export function routineReducer(
  state: Routine[] = initialRoutines,
  action: RoutineAction,
): Routine[] {
  switch (action.type) {
    case 'create': {
      const { id, name, exerciseIds } = action.payload;
      const newRoutine: Routine = {
        id,
        name,
        exerciseIds: exerciseIds ? [...exerciseIds] : [],
      };
      return [...state, newRoutine];
    }

    case 'rename': {
      const { id, name } = action.payload;
      const target = state.find((r) => r.id === id);
      if (!target || target.name === name) {
        return state;
      }
      return state.map((routine) =>
        routine.id === id ? { ...routine, name } : routine,
      );
    }

    case 'remove': {
      const { id } = action.payload;
      const exists = state.some((r) => r.id === id);
      if (!exists) {
        return state;
      }
      return state.filter((routine) => routine.id !== id);
    }

    case 'addExercise': {
      const { routineId, exerciseId } = action.payload;
      const target = state.find((r) => r.id === routineId);
      if (!target) {
        return state;
      }
      if (target.exerciseIds.includes(exerciseId)) {
        return state;
      }
      return state.map((routine) =>
        routine.id === routineId
          ? { ...routine, exerciseIds: [...routine.exerciseIds, exerciseId] }
          : routine,
      );
    }

    case 'removeExercise': {
      const { routineId, exerciseId } = action.payload;
      const target = state.find((r) => r.id === routineId);
      if (!target) {
        return state;
      }
      if (!target.exerciseIds.includes(exerciseId)) {
        return state;
      }
      return state.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              exerciseIds: routine.exerciseIds.filter((id) => id !== exerciseId),
            }
          : routine,
      );
    }

    default:
      return state;
  }
}
