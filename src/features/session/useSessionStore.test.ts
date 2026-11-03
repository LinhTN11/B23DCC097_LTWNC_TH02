import { describe, it, expect, beforeEach } from 'vitest';
import {
  useSessionStore,
  REST_SECONDS,
  setRestSeconds,
  resetRestSeconds,
} from './useSessionStore';
import type { Exercise } from '../../types';

describe('useSessionStore', () => {
  const ex1: Exercise = {
    id: 'e1',
    name: 'Đẩy tạ đơn 1',
    trainer: 'Minh Khang',
    group: 'Ngực',
    duration: 30,
  };

  const ex2: Exercise = {
    id: 'e2',
    name: 'Kéo tạ đơn 1',
    trainer: 'Phương Anh',
    group: 'Chân',
    duration: 45,
  };

  beforeEach(() => {
    resetRestSeconds();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      restRemaining: 0,
    });
  });

  it('startSession đặt đúng bài và khởi tạo buổi tập', () => {
    useSessionStore.getState().startSession([ex1, ex2], 0);

    const state = useSessionStore.getState();
    expect(state.queue).toEqual([ex1, ex2]);
    expect(state.currentIndex).toBe(0);
    expect(state.isRunning).toBe(true);
    expect(state.elapsed).toBe(0);
    expect(state.restRemaining).toBe(0);
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    useSessionStore.getState().startSession([ex1, ex2], 0);
    useSessionStore.setState({ elapsed: 29 });

    useSessionStore.getState().tick();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.elapsed).toBe(0);
    expect(state.restRemaining).toBe(REST_SECONDS);
  });

  it('next ở bài cuối thì isRunning là false', () => {
    useSessionStore.getState().startSession([ex1, ex2], 1);
    expect(useSessionStore.getState().isRunning).toBe(true);

    useSessionStore.getState().next();

    const state = useSessionStore.getState();
    expect(state.isRunning).toBe(false);
    expect(state.currentIndex).toBe(1);
  });

  it('prev khi đã tập quá 3 giây chỉ đặt lại bài hiện tại về 0', () => {
    useSessionStore.getState().startSession([ex1, ex2], 1);
    useSessionStore.setState({ elapsed: 5 });

    useSessionStore.getState().prev();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.elapsed).toBe(0);
  });

  it('prev khi chưa quá 3 giây lùi về bài trước, ở bài đầu đặt lại về 0', () => {
    useSessionStore.getState().startSession([ex1, ex2], 1);
    useSessionStore.setState({ elapsed: 2 });

    useSessionStore.getState().prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);

    // Ở bài đầu bấm prev tiếp thì vẫn là bài đầu và elapsed là 0
    useSessionStore.getState().prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('addToSession thêm bài vào cuối buổi tập và bỏ qua bài trùng', () => {
    useSessionStore.getState().addToSession(ex1);
    expect(useSessionStore.getState().queue).toEqual([ex1]);

    useSessionStore.getState().addToSession(ex2);
    expect(useSessionStore.getState().queue).toEqual([ex1, ex2]);

    // Thêm lại ex1 thì không bị nhân đôi
    useSessionStore.getState().addToSession(ex1);
    expect(useSessionStore.getState().queue).toEqual([ex1, ex2]);
  });

  it('toggleRun bật tắt trạng thái đang chạy', () => {
    useSessionStore.getState().startSession([ex1], 0);
    expect(useSessionStore.getState().isRunning).toBe(true);

    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(false);

    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('thời gian nghỉ giữa các bài tập đếm lùi và bắt đầu bài mới sau khi hết nghỉ', () => {
    setRestSeconds(3);
    useSessionStore.getState().startSession([ex1, ex2], 0);
    useSessionStore.setState({ elapsed: 29 });

    // Hết bài 1 -> chuyển sang bài 2 và bắt đầu nghỉ 3 giây
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().restRemaining).toBe(3);
    expect(useSessionStore.getState().elapsed).toBe(0);

    // Giây nghỉ thứ 1
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().restRemaining).toBe(2);
    expect(useSessionStore.getState().elapsed).toBe(0);

    // Giây nghỉ thứ 2
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().restRemaining).toBe(1);
    expect(useSessionStore.getState().elapsed).toBe(0);

    // Giây nghỉ thứ 3 (hết nghỉ)
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().restRemaining).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);

    // Bắt đầu đếm giây bài 2
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().restRemaining).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(1);
  });
});
