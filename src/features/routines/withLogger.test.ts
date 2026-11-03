import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withLogger } from './withLogger';

describe('withLogger', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('gọi reducer gốc, trả về kết quả chính xác và ghi log khi DEV', () => {
    type TestState = { count: number };
    type TestAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };

    const mockReducer = (state: TestState, action: TestAction): TestState => {
      switch (action.type) {
        case 'INCREMENT':
          return { count: state.count + 1 };
        case 'DECREMENT':
          return { count: state.count - 1 };
        default:
          return state;
      }
    };

    const loggedReducer = withLogger(mockReducer);
    const prevState = { count: 0 };
    const action: TestAction = { type: 'INCREMENT' };

    const nextState = loggedReducer(prevState, action);

    expect(nextState).toEqual({ count: 1 });
    expect(consoleSpy).toHaveBeenCalledWith('INCREMENT', prevState, nextState);
  });
});
