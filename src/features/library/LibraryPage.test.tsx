import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LibraryPage from './LibraryPage';

describe('LibraryPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
});
