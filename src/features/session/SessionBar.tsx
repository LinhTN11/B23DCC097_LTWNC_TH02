import { memo, useEffect, useCallback } from 'react';
import { useSessionStore } from './useSessionStore';
import CountdownBar from './CountdownBar';

export const SessionBar = memo(function SessionBar() {
  const isRunning = useSessionStore((s) => s.isRunning);
  const queueLength = useSessionStore((s) => s.queue.length);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null,
  );

  // Interval timer running tick() every 1000ms while isRunning
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      useSessionStore.getState().tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  // Space-key shortcut toggling Bắt đầu / Tạm dừng
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      useSessionStore.getState().toggleRun();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePrev = useCallback(() => {
    useSessionStore.getState().prev();
  }, []);

  const handleToggle = useCallback(() => {
    useSessionStore.getState().toggleRun();
  }, []);

  const handleNext = useCallback(() => {
    useSessionStore.getState().next();
  }, []);

  return (
    <footer className="session-bar" role="region" aria-label="Thanh đồng hồ buổi tập">
      <div className="session-bar-content">
        <div className="session-info">
          {currentExercise ? (
            <span className="session-exercise-info">
              Đang tập: {currentExercise.name} – HLV {currentExercise.trainer}
            </span>
          ) : (
            <span className="session-exercise-info">Chưa bắt đầu buổi tập</span>
          )}
        </div>

        <CountdownBar />

        <div className="session-controls">
          <button
            type="button"
            className="btn btn-prev"
            onClick={handlePrev}
            disabled={queueLength === 0}
          >
            Trước
          </button>
          <button
            type="button"
            className="btn btn-toggle"
            onClick={handleToggle}
            disabled={queueLength === 0}
          >
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            type="button"
            className="btn btn-next"
            onClick={handleNext}
            disabled={queueLength === 0}
          >
            Sau
          </button>
        </div>

        <div className="session-queue-meta">
          <span className="session-count">Buổi tập: {queueLength} bài</span>
        </div>
      </div>
    </footer>
  );
});

export default SessionBar;
