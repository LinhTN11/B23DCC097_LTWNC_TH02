import { memo } from 'react';
import { useSessionStore } from './useSessionStore';
import { formatDuration } from '../../utils/format';

export const CountdownBar = memo(function CountdownBar() {
  const elapsed = useSessionStore((s) => s.elapsed);
  const restRemaining = useSessionStore((s) => s.restRemaining);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null,
  );

  if (!currentExercise) {
    return null;
  }

  if (restRemaining > 0) {
    const restMax = 10;
    const restPercent = Math.min(
      100,
      Math.max(0, Math.round(((restMax - restRemaining) / restMax) * 100)),
    );

    return (
      <div className="countdown-bar resting">
        <span className="session-remaining session-rest">
          Nghỉ: {restRemaining} giây
        </span>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Thời gian nghỉ"
          aria-valuenow={restRemaining}
          aria-valuemin={0}
          aria-valuemax={restMax}
        >
          <div
            className="progress-fill resting"
            style={{ width: `${restPercent}%` }}
          />
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, currentExercise.duration - elapsed);
  const percent =
    currentExercise.duration > 0
      ? Math.min(100, Math.max(0, Math.round((elapsed / currentExercise.duration) * 100)))
      : 0;

  return (
    <div className="countdown-bar">
      <span className="session-remaining">Còn lại: {formatDuration(remaining)}</span>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Tiến độ bài tập"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
});

export default CountdownBar;
