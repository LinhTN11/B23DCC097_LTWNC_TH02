import { describe, it, expect } from 'vitest';
import { routineReducer } from './routineReducer';
import type { Routine } from './routineReducer';

describe('routineReducer', () => {
  it('tạo giáo án mới và thêm vào danh sách', () => {
    const initialState: Routine[] = [];
    const action = {
      type: 'create' as const,
      payload: {
        id: 'r1',
        name: 'Ngày ngực',
      },
    };

    const nextState = routineReducer(initialState, action);

    expect(nextState).toHaveLength(1);
    expect(nextState[0]).toEqual({
      id: 'r1',
      name: 'Ngày ngực',
      exerciseIds: [],
    });
  });

  it('addExercise thêm bài tập vào giáo án và không thêm trùng', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
    ];

    // Thêm bài mới
    const addAction = {
      type: 'addExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e2' },
    };
    const stateAfterAdd = routineReducer(initialState, addAction);
    expect(stateAfterAdd[0].exerciseIds).toEqual(['e1', 'e2']);

    // Thêm lại bài đã có (trùng e1)
    const duplicateAction = {
      type: 'addExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e1' },
    };
    const stateAfterDuplicate = routineReducer(stateAfterAdd, duplicateAction);
    expect(stateAfterDuplicate[0].exerciseIds).toEqual(['e1', 'e2']);
    // State giữ nguyên tham chiếu khi không có thay đổi
    expect(stateAfterDuplicate).toBe(stateAfterAdd);
  });

  it('removeExercise loại bỏ bài tập khỏi giáo án', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2', 'e3'] },
    ];

    const action = {
      type: 'removeExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e2' },
    };

    const nextState = routineReducer(initialState, action);
    expect(nextState[0].exerciseIds).toEqual(['e1', 'e3']);
  });

  it('xóa giáo án không tồn tại thì state giữ nguyên (toEqual và toBe)', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
    ];

    const action = {
      type: 'remove' as const,
      payload: { id: 'r-non-existent' },
    };

    const nextState = routineReducer(initialState, action);

    expect(nextState).toEqual(initialState);
    expect(nextState).toBe(initialState);
  });

  it('xóa giáo án tồn tại thì xóa khỏi danh sách', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
      { id: 'r2', name: 'Ngày lưng', exerciseIds: [] },
    ];

    const action = {
      type: 'remove' as const,
      payload: { id: 'r1' },
    };

    const nextState = routineReducer(initialState, action);
    expect(nextState).toHaveLength(1);
    expect(nextState[0].id).toBe('r2');
  });

  it('rename đổi tên giáo án', () => {
    const initialState: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: [] },
    ];

    const action = {
      type: 'rename' as const,
      payload: { id: 'r1', name: 'Ngày ngực & tay sau' },
    };

    const nextState = routineReducer(initialState, action);
    expect(nextState[0].name).toBe('Ngày ngực & tay sau');
  });
});
