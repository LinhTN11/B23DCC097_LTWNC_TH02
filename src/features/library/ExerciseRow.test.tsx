import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Exercise } from '../../types';
import { ExerciseRow } from './ExerciseRow';

describe('ExerciseRow', () => {
  const mockExercise: Exercise = {
    id: 'e1',
    name: 'Đẩy tạ đơn 1',
    trainer: 'Minh Khang',
    group: 'Ngực',
    duration: 30,
  };

  it('hiển thị tên bài tập và 0:30, bấm nút Bắt đầu gọi mock function với đúng bài tập', () => {
    const handleStart = vi.fn();

    render(
      <ExerciseRow
        exercise={mockExercise}
        index={0}
        onStart={handleStart}
      />,
    );

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: 'Bắt đầu' });
    fireEvent.click(startBtn);

    expect(handleStart).toHaveBeenCalledTimes(1);
    expect(handleStart).toHaveBeenCalledWith(mockExercise);
  });

  it('các nút lưu, buổi tập, giáo án hoạt động và hiển thị đúng trạng thái', () => {
    const handleToggleSave = vi.fn();
    const handleAddToSession = vi.fn();
    const handleAddToRoutine = vi.fn();

    const { rerender } = render(
      <ExerciseRow
        exercise={mockExercise}
        index={0}
        onToggleSave={handleToggleSave}
        onAddToSession={handleAddToSession}
        onAddToRoutine={handleAddToRoutine}
        isSaved={false}
        isRoutineDisabled={false}
      />,
    );

    const saveBtn = screen.getByRole('button', { name: 'Lưu bài tập' });
    expect(saveBtn).toHaveTextContent('☆');
    fireEvent.click(saveBtn);
    expect(handleToggleSave).toHaveBeenCalledWith(mockExercise);

    const sessionBtn = screen.getByRole('button', { name: '+ Buổi tập' });
    fireEvent.click(sessionBtn);
    expect(handleAddToSession).toHaveBeenCalledWith(mockExercise);

    const routineBtn = screen.getByRole('button', { name: '+ Giáo án' });
    expect(routineBtn).not.toBeDisabled();
    fireEvent.click(routineBtn);
    expect(handleAddToRoutine).toHaveBeenCalledWith(mockExercise);

    rerender(
      <ExerciseRow
        exercise={mockExercise}
        index={0}
        isSaved={true}
        isRoutineDisabled={true}
      />,
    );

    const savedBtn = screen.getByRole('button', { name: 'Bỏ lưu' });
    expect(savedBtn).toHaveTextContent('★');
    expect(screen.getByRole('button', { name: '+ Giáo án' })).toBeDisabled();
  });
});
