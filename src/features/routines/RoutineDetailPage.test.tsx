import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import RoutineDetailPage from './RoutineDetailPage';
import { renderWithProviders } from '../../test-utils';
import { useSessionStore } from '../session/useSessionStore';

describe('RoutineDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
      restRemaining: 0,
    });
  });

  it('hiển thị "Không tìm thấy giáo án" khi ID không tồn tại', () => {
    renderWithProviders(
      <Routes>
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/routines/not-found-id'],
        initialRoutines: [],
      },
    );

    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });

  it('hiển thị tên giáo án, danh sách bài tập và tổng thời gian tính theo reduce', () => {
    // e1: 30s, e2: 67s => tổng 97s = 1 phút 37 giây
    renderWithProviders(
      <Routes>
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/routines/r1'],
        initialRoutines: [
          { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
        ],
      },
    );

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Bỏ' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).not.toBeDisabled();
  });

  it('bấm nút Bỏ thì loại bỏ bài tập khỏi giáo án', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/routines/r1'],
        initialRoutines: [
          { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
        ],
      },
    );

    const removeButtons = screen.getAllByRole('button', { name: 'Bỏ' });
    await user.click(removeButtons[0]); // Bỏ e1

    expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
    // e2: 67s = 1 phút 7 giây
    expect(screen.getByText('Tổng thời gian: 1 phút 7 giây')).toBeInTheDocument();
  });

  it('bấm Tập tất cả khởi động buổi tập trong session store', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/routines/r1'],
        initialRoutines: [
          { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
        ],
      },
    );

    const startAllBtn = screen.getByRole('button', { name: 'Tập tất cả' });
    await user.click(startAllBtn);

    const session = useSessionStore.getState();
    expect(session.queue).toHaveLength(2);
    expect(session.queue[0].id).toBe('e1');
    expect(session.queue[1].id).toBe('e2');
    expect(session.currentIndex).toBe(0);
    expect(session.isRunning).toBe(true);
  });
});
