import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style?: CSSProperties;
  onStart?: (exercise: Exercise) => void;
  onToggleSave?: (exercise: Exercise) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exercise: Exercise) => void;
  isSaved?: boolean;
  isRoutineDisabled?: boolean;
}

export const ExerciseRow = memo(function ExerciseRow({
  exercise,
  index,
  style,
  onStart,
  onToggleSave,
  onAddToSession,
  onAddToRoutine,
  isSaved = false,
  isRoutineDisabled = false,
}: ExerciseRowProps) {
  return (
    <div className="exercise-row" style={style}>
      <span className="exercise-index">#{index + 1}</span>
      <span className="exercise-name">{exercise.name}</span>
      <span className="exercise-trainer">HLV: {exercise.trainer}</span>
      <span className="exercise-group">{exercise.group}</span>
      <span className="exercise-duration">{formatDuration(exercise.duration)}</span>
      <div className="exercise-actions">
        <button
          type="button"
          className="btn btn-start"
          onClick={() => onStart?.(exercise)}
        >
          Bắt đầu
        </button>
        <button
          type="button"
          className="btn btn-save"
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}
          onClick={() => onToggleSave?.(exercise)}
        >
          {isSaved ? '★' : '☆'}
        </button>
        <button
          type="button"
          className="btn btn-session"
          onClick={() => onAddToSession?.(exercise)}
        >
          + Buổi tập
        </button>
        <button
          type="button"
          className="btn btn-routine"
          disabled={isRoutineDisabled}
          onClick={() => onAddToRoutine?.(exercise)}
        >
          + Giáo án
        </button>
      </div>
    </div>
  );
});

export default ExerciseRow;
