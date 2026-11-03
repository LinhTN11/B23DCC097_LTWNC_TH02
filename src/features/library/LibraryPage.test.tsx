import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LibraryPage from './LibraryPage';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';

describe('LibraryPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSavedStore.setState({ ids: [] });
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

  it('mặc định hiển thị "Tìm thấy 10000 bài tập"', () => {
    render(<LibraryPage />);
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });

  it('gõ "đẩy": trong lúc gõ chưa đổi, sau 300ms hiển thị "Tìm thấy 1250 bài tập"', () => {
    render(<LibraryPage />);
    const searchInput = screen.getByLabelText('Tìm kiếm');

    fireEvent.change(searchInput, { target: { value: 'đẩy' } });

    // Trước 300ms vẫn là 10000
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();
  });

  it('lọc "đẩy" và chọn nhóm cơ "Vai" tìm thấy 250 bài tập', () => {
    render(<LibraryPage />);
    const searchInput = screen.getByLabelText('Tìm kiếm');
    const groupSelect = screen.getByLabelText('Nhóm cơ');

    fireEvent.change(searchInput, { target: { value: 'đẩy' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();

    fireEvent.change(groupSelect, { target: { value: 'Vai' } });
    expect(screen.getByText('Tìm thấy 250 bài tập')).toBeInTheDocument();
  });

  it('xóa ô tìm kiếm, chọn Tất cả, gõ "đức anh" tìm thấy 1000 bài tập theo HLV', () => {
    render(<LibraryPage />);
    const searchInput = screen.getByLabelText('Tìm kiếm');

    fireEvent.change(searchInput, { target: { value: 'đức anh' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1000 bài tập')).toBeInTheDocument();
  });

  it('gõ "xyz" hiển thị "Không tìm thấy bài tập nào"', () => {
    render(<LibraryPage />);
    const searchInput = screen.getByLabelText('Tìm kiếm');

    fireEvent.change(searchInput, { target: { value: 'xyz' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
  });

  it('sắp xếp theo Tên A–Z và Thời lượng tăng dần hoạt động', () => {
    render(<LibraryPage />);
    const sortSelect = screen.getByLabelText('Sắp xếp');

    fireEvent.change(sortSelect, { target: { value: 'name-asc' } });
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    fireEvent.change(sortSelect, { target: { value: 'duration-asc' } });
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    fireEvent.change(sortSelect, { target: { value: 'default' } });
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });

  it('bấm Bắt đầu ở một dòng khởi tạo buổi tập với danh sách đang hiển thị', () => {
    render(<LibraryPage />);

    const startButtons = screen.getAllByRole('button', { name: 'Bắt đầu' });
    fireEvent.click(startButtons[0]);

    const sessionState = useSessionStore.getState();
    expect(sessionState.queue.length).toBe(10000);
    expect(sessionState.currentIndex).toBe(0);
    expect(sessionState.isRunning).toBe(true);
  });

  it('bấm + Buổi tập thêm bài tập vào danh sách buổi tập', () => {
    render(<LibraryPage />);

    const sessionButtons = screen.getAllByRole('button', { name: '+ Buổi tập' });
    fireEvent.click(sessionButtons[0]);

    const sessionState = useSessionStore.getState();
    expect(sessionState.queue.length).toBe(1);
    expect(sessionState.queue[0].id).toBe('e1');
  });

  it('bấm nút Lưu bài tập đổi trạng thái sao và cập nhật useSavedStore', () => {
    render(<LibraryPage />);

    const saveButtons = screen.getAllByRole('button', { name: 'Lưu bài tập' });
    expect(saveButtons[0]).toHaveTextContent('☆');

    fireEvent.click(saveButtons[0]);
    expect(useSavedStore.getState().ids).toContain('e1');
  });
});
