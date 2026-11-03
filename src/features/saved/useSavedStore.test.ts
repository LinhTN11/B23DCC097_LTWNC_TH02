import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('useSavedStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
  });

  it('toggle thêm id bài tập khi chưa được lưu', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);

    useSavedStore.getState().toggle('e2');
    expect(useSavedStore.getState().ids).toEqual(['e1', 'e2']);
  });

  it('toggle xóa id bài tập khi đã được lưu', () => {
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e2']);

    useSavedStore.getState().toggle('e2');
    expect(useSavedStore.getState().ids).toEqual([]);
  });

  it('dữ liệu được lưu vào localStorage với key workout-saved', () => {
    useSavedStore.getState().toggle('e1');

    const stored = localStorage.getItem('workout-saved');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).state.ids).toContain('e1');
  });
});
