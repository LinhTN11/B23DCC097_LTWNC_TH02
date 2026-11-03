import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App navigation', () => {
  it('hiển thị thanh điều hướng gồm Kho bài tập, Đã lưu, Giáo án', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Kho bài tập' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Đã lưu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Giáo án' })).toBeInTheDocument();
  });

  it('chuyển sang trang /saved hiển thị nội dung trang Đã lưu', async () => {
    render(
      <MemoryRouter initialEntries={['/saved']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Bài tập đã lưu')).toBeInTheDocument();
  });

  it('chuyển sang trang /routines hiển thị nội dung trang Giáo án', async () => {
    render(
      <MemoryRouter initialEntries={['/routines']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Danh sách giáo án')).toBeInTheDocument();
  });

  it('thanh đồng hồ SessionBar xuất hiện cố định ở đáy ứng dụng', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('region', { name: 'Thanh đồng hồ buổi tập' })).toBeInTheDocument();
  });
});
