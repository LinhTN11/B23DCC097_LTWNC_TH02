import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

describe('SessionBar', () => {
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
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      restRemaining: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị "Chưa bắt đầu buổi tập" và "Buổi tập: 0 bài" khi chưa có bài tập', () => {
    render(<SessionBar />);

    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: 'Bắt đầu' });
    expect(toggleBtn).toBeDisabled();
  });

  it('hiển thị thông tin bài đang tập và cập nhật nút Tạm dừng khi đang chạy', () => {
    useSessionStore.setState({
      queue: [ex1, ex2],
      currentIndex: 0,
      isRunning: true,
      elapsed: 5,
      restRemaining: 0,
    });

    render(<SessionBar />);

    expect(
      screen.getByText('Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang'),
    ).toBeInTheDocument();
    expect(screen.getByText('Còn lại: 0:25')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 2 bài')).toBeInTheDocument();

    const pauseBtn = screen.getByRole('button', { name: 'Tạm dừng' });
    expect(pauseBtn).toBeInTheDocument();

    fireEvent.click(pauseBtn);
    expect(useSessionStore.getState().isRunning).toBe(false);
  });

  it('các nút Trước và Sau chuyển bài chính xác', () => {
    useSessionStore.setState({
      queue: [ex1, ex2],
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
      restRemaining: 0,
    });

    render(<SessionBar />);

    const nextBtn = screen.getByRole('button', { name: 'Sau' });
    fireEvent.click(nextBtn);

    expect(useSessionStore.getState().currentIndex).toBe(1);

    const prevBtn = screen.getByRole('button', { name: 'Trước' });
    fireEvent.click(prevBtn);

    expect(useSessionStore.getState().currentIndex).toBe(0);
  });

  it('hiển thị "Nghỉ: N giây" trong thời gian nghỉ giữa bài', () => {
    useSessionStore.setState({
      queue: [ex1, ex2],
      currentIndex: 1,
      isRunning: true,
      elapsed: 0,
      restRemaining: 8,
    });

    render(<SessionBar />);

    expect(screen.getByText('Nghỉ: 8 giây')).toBeInTheDocument();
  });

  it('phím tắt Space bật/tắt đồng hồ và bỏ qua khi đang gõ trong ô nhập', () => {
    useSessionStore.setState({
      queue: [ex1],
      currentIndex: 0,
      isRunning: false,
      elapsed: 0,
      restRemaining: 0,
    });

    render(
      <div>
        <input data-testid="search-box" />
        <SessionBar />
      </div>,
    );

    // Nhấn Space ở ngoài ô nhập -> bật đồng hồ
    fireEvent.keyDown(window, { code: 'Space', key: ' ' });
    expect(useSessionStore.getState().isRunning).toBe(true);

    // Nhấn Space tiếp -> tạm dừng
    fireEvent.keyDown(window, { code: 'Space', key: ' ' });
    expect(useSessionStore.getState().isRunning).toBe(false);

    // Nhấn Space khi đang focus ô input -> không đổi trạng thái
    const input = screen.getByTestId('search-box');
    input.focus();
    fireEvent.keyDown(input, { code: 'Space', key: ' ' });
    expect(useSessionStore.getState().isRunning).toBe(false);
  });

  it('đồng hồ tự động chạy tick mỗi giây khi isRunning là true', () => {
    vi.useFakeTimers();

    useSessionStore.setState({
      queue: [ex1],
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
      restRemaining: 0,
    });

    render(<SessionBar />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(useSessionStore.getState().elapsed).toBe(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(useSessionStore.getState().elapsed).toBe(4);
  });
});
