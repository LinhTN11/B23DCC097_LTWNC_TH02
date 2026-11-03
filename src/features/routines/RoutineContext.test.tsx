import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  RoutineProvider,
  useRoutines,
  useRoutineDispatch,
  ROUTINES_STORAGE_KEY,
} from './RoutineContext';
import type { Routine } from './routineReducer';

describe('RoutineContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('useRoutines ném lỗi rõ ràng nếu dùng ngoài RoutineProvider', () => {
    expect(() => {
      renderHook(() => useRoutines());
    }).toThrow('useRoutines must be used within a RoutineProvider');
  });

  it('useRoutineDispatch ném lỗi rõ ràng nếu dùng ngoài RoutineProvider', () => {
    expect(() => {
      renderHook(() => useRoutineDispatch());
    }).toThrow('useRoutineDispatch must be used within a RoutineProvider');
  });

  it('RoutineProvider nạp danh sách ban đầu từ localStorage và cung cấp cho useRoutines', () => {
    const savedRoutines: Routine[] = [
      { id: 'r1', name: 'Giáo án mẫu', exerciseIds: ['e1'] },
    ];
    localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(savedRoutines));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoutineProvider>{children}</RoutineProvider>
    );

    const { result } = renderHook(() => useRoutines(), { wrapper });

    expect(result.current).toEqual(savedRoutines);
  });

  it('dispatch action cập nhật state và ghi nhớ vào localStorage', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoutineProvider>{children}</RoutineProvider>
    );

    const { result } = renderHook(
      () => ({
        routines: useRoutines(),
        dispatch: useRoutineDispatch(),
      }),
      { wrapper },
    );

    expect(result.current.routines).toEqual([]);

    act(() => {
      result.current.dispatch({
        type: 'create',
        payload: {
          id: 'r100',
          name: 'Giáo án toàn thân',
        },
      });
    });

    const stored = localStorage.getItem(ROUTINES_STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored || '[]');
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('Giáo án toàn thân');
  });

  it('xử lý an toàn khi localStorage chứa dữ liệu JSON lỗi', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(ROUTINES_STORAGE_KEY, 'invalid-json{');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoutineProvider>{children}</RoutineProvider>
    );

    const { result } = renderHook(() => useRoutines(), { wrapper });
    expect(result.current).toEqual([]);
    errorSpy.mockRestore();
  });
});
