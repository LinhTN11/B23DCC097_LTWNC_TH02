import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoutinesPage from './RoutinesPage';
import { renderWithProviders } from '../../test-utils';

describe('RoutinesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bấm Tạo khi ô trống thì thấy "Tên giáo án không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const createButton = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createButton);

    expect(
      screen.getByText('Tên giáo án không được để trống'),
    ).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByLabelText('Tên giáo án');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Ngày ngực');
    await user.click(createButton);

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chi tiết' })).toBeInTheDocument();
  });

  it('nhập trùng tên không phân biệt hoa thường thì báo "Tên giáo án đã tồn tại"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByLabelText('Tên giáo án');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    // Tạo giáo án đầu tiên
    await user.type(input, 'Ngày ngực');
    await user.click(createButton);
    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();

    // Tạo tiếp giáo án thứ hai với tên hoa thường khác nhau
    await user.type(input, 'ngày NGỰC');
    await user.click(createButton);

    expect(screen.getByText('Tên giáo án đã tồn tại')).toBeInTheDocument();
  });

  it('bấm nút Xóa thì giáo án biến mất khỏi danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />, {
      initialRoutines: [
        { id: 'r1', name: 'Giáo án cần xóa', exerciseIds: [] },
      ],
    });

    expect(screen.getByText('Giáo án cần xóa')).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: 'Xóa' });
    await user.click(deleteBtn);

    expect(screen.queryByText('Giáo án cần xóa')).not.toBeInTheDocument();
    expect(screen.getByText('Chưa có giáo án nào')).toBeInTheDocument();
  });
});
