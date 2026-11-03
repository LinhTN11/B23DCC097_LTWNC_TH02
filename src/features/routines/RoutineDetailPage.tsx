import { useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';
import { useSessionStore } from '../session/useSessionStore';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  const routine = useMemo(
    () => routines.find((r) => r.id === id),
    [routines, id],
  );

  const exercises = useMemo<Exercise[]>(() => {
    if (!routine) return [];
    const map = new Map<string, Exercise>();
    for (const ex of EXERCISES) {
      map.set(ex.id, ex);
    }
    return routine.exerciseIds
      .map((exId) => map.get(exId))
      .filter((ex): ex is Exercise => ex !== undefined);
  }, [routine]);

  const totalDurationText = useMemo(() => {
    const totalSeconds = exercises.reduce((acc, ex) => acc + ex.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `Tổng thời gian: ${minutes} phút ${seconds} giây`;
  }, [exercises]);

  const handleRemoveExercise = useCallback(
    (exerciseId: string) => {
      if (!routine) return;
      dispatch({
        type: 'removeExercise',
        payload: { routineId: routine.id, exerciseId },
      });
    },
    [dispatch, routine],
  );

  const handleStartAll = useCallback(() => {
    if (exercises.length === 0) return;
    useSessionStore.getState().startSession(exercises, 0);
  }, [exercises]);

  if (!routine) {
    return (
      <div className="routine-detail-page">
        <p className="not-found-msg">Không tìm thấy giáo án</p>
        <Link to="/routines" className="btn btn-back">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="routine-detail-page">
      <header className="page-header detail-header">
        <div className="detail-header-left">
          <Link to="/routines" className="back-link">
            ← Danh sách giáo án
          </Link>
          <h1 className="routine-detail-title">{routine.name}</h1>
          <p className="routine-detail-duration">{totalDurationText}</p>
        </div>
        <button
          type="button"
          className="btn btn-start-all"
          onClick={handleStartAll}
          disabled={exercises.length === 0}
        >
          Tập tất cả
        </button>
      </header>

      <section className="routine-exercises-section">
        {exercises.length === 0 ? (
          <p className="no-exercises-msg">Chưa có bài tập nào trong giáo án này</p>
        ) : (
          <div className="saved-list">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-row">
                <span className="exercise-index">#{index + 1}</span>
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-trainer">HLV: {exercise.trainer}</span>
                <span className="exercise-group">{exercise.group}</span>
                <span className="exercise-duration">
                  {formatDuration(exercise.duration)}
                </span>
                <div className="exercise-actions">
                  <button
                    type="button"
                    className="btn btn-remove-exercise"
                    onClick={() => handleRemoveExercise(exercise.id)}
                  >
                    Bỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RoutineDetailPage;
