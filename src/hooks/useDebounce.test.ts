import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('giữ giá trị cũ trước 300ms và cập nhật giá trị mới sau khi advanceTimersByTime(300)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'khoi dau', delay: 300 },
      },
    );

    expect(result.current).toBe('khoi dau');

    rerender({ value: 'gia tri moi', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('khoi dau');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('gia tri moi');
  });
});
