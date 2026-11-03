import { describe, it } from 'vitest';
import { Profiler } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EXERCISES } from './data/exercises';
import { ExerciseRow } from './features/library/ExerciseRow';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoutineProvider } from './features/routines/RoutineContext';
import LibraryPage from './features/library/LibraryPage';

describe('Đo hiệu năng render (React Profiler benchmark)', () => {
  it('đo render với FixedSizeList vs render toàn bộ 10,000 rows', () => {
    let durationVirtualized = 0;
    let baseDurationVirtualized = 0;

    const onRenderVirtualized = (
      _id: string,
      _phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
    ) => {
      durationVirtualized = actualDuration;
      baseDurationVirtualized = baseDuration;
    };

    const { unmount: unmount1 } = render(
      <MemoryRouter>
        <ThemeProvider>
          <RoutineProvider>
            <Profiler id="virtualized" onRender={onRenderVirtualized}>
              <LibraryPage />
            </Profiler>
          </RoutineProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    unmount1();

    // Render toàn bộ 10.000 bài tập không ảo hoá
    let durationNonVirtualized = 0;
    let baseDurationNonVirtualized = 0;

    const onRenderNonVirtualized = (
      _id: string,
      _phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
    ) => {
      durationNonVirtualized = actualDuration;
      baseDurationNonVirtualized = baseDuration;
    };

    const NonVirtualizedList = () => {
      return (
        <div style={{ height: 560, overflowY: 'auto' }}>
          {EXERCISES.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              isSaved={false}
              isRoutineDisabled={true}
            />
          ))}
        </div>
      );
    };

    const { unmount: unmount2 } = render(
      <MemoryRouter>
        <ThemeProvider>
          <RoutineProvider>
            <Profiler id="non-virtualized" onRender={onRenderNonVirtualized}>
              <NonVirtualizedList />
            </Profiler>
          </RoutineProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    unmount2();

    console.log('--- KẾT QUẢ ĐO HIỆU NĂNG PROFILER ---');
    console.log(`1. Có ảo hoá (FixedSizeList): actualDuration = ${durationVirtualized.toFixed(2)} ms, baseDuration = ${baseDurationVirtualized.toFixed(2)} ms`);
    console.log(`2. Không ảo hoá (10.000 rows): actualDuration = ${durationNonVirtualized.toFixed(2)} ms, baseDuration = ${baseDurationNonVirtualized.toFixed(2)} ms`);
    console.log(`Tỉ lệ chênh lệch: ~${(durationNonVirtualized / Math.max(durationVirtualized, 0.01)).toFixed(1)}x`);
  });
});
