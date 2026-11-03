import { useMemo, useCallback } from 'react';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { ExerciseRow } from '../library/ExerciseRow';

export default function SavedPage() {
  const savedIds = useSavedStore((s) => s.ids);

  const exerciseMap = useMemo(() => {
    return new Map<string, Exercise>(EXERCISES.map((item) => [item.id, item]));
  }, []);

  const savedExercises = useMemo(() => {
    return savedIds
      .map((id) => exerciseMap.get(id))
      .filter((e): e is Exercise => e !== undefined);
  }, [savedIds, exerciseMap]);

  const handleStartAll = useCallback(() => {
    if (savedExercises.length > 0) {
      useSessionStore.getState().startSession(savedExercises, 0);
    }
  }, [savedExercises]);

  const handleStart = useCallback(
    (_exercise: Exercise, index: number) => {
      useSessionStore.getState().startSession(savedExercises, index);
    },
    [savedExercises],
  );

  const handleToggleSave = useCallback((exercise: Exercise) => {
    useSavedStore.getState().toggle(exercise.id);
  }, []);

  const handleAddToSession = useCallback((exercise: Exercise) => {
    useSessionStore.getState().addToSession(exercise);
  }, []);

  return (
    <div className="saved-page">
      <header className="page-header saved-header">
        <h1>Bài tập đã lưu</h1>
        {savedExercises.length > 0 && (
          <button
            type="button"
            className="btn btn-primary btn-start-all"
            onClick={handleStartAll}
          >
            Tập tất cả
          </button>
        )}
      </header>

      {savedExercises.length === 0 ? (
        <p className="no-saved-msg">Bạn chưa lưu bài tập nào</p>
      ) : (
        <div className="saved-list list-wrapper">
          {savedExercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              isSaved={true}
              onStart={(ex) => handleStart(ex, index)}
              onToggleSave={handleToggleSave}
              onAddToSession={handleAddToSession}
            />
          ))}
        </div>
      )}
    </div>
  );
}
