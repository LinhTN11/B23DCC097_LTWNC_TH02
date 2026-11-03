import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SavedPage from './SavedPage';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';

describe('SavedPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      restRemaining: 0,
    });
  });

  it('hiển thị thông báo khi chưa có bài tập nào được lưu', () => {
    render(<SavedPage />);

    expect(screen.getByText('Bài tập đã lưu')).toBeInTheDocument();
    expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tập tất cả' })).not.toBeInTheDocument();
  });

  it('hiển thị danh sách bài tập đã lưu và nút Tập tất cả', () => {
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    render(<SavedPage />);

    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
  });

  it('bấm nút Tập tất cả khởi tạo buổi tập với các bài đã lưu từ bài đầu tiên', () => {
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    render(<SavedPage />);

    const startAllBtn = screen.getByRole('button', { name: 'Tập tất cả' });
    fireEvent.click(startAllBtn);

    const sessionState = useSessionStore.getState();
    expect(sessionState.queue.length).toBe(2);
    expect(sessionState.currentIndex).toBe(0);
    expect(sessionState.isRunning).toBe(true);
    expect(sessionState.queue[0].id).toBe('e1');
  });

  it('bấm nút Bỏ lưu bỏ bài tập khỏi danh sách đã lưu', () => {
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    render(<SavedPage />);

    const removeBtns = screen.getAllByRole('button', { name: 'Bỏ lưu' });
    fireEvent.click(removeBtns[0]);

    expect(useSavedStore.getState().ids).toEqual(['e2']);
    expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
  });
});
