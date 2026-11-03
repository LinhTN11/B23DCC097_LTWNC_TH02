import { useState, useMemo, useCallback, memo } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';
import type { Routine } from './routineReducer';

export interface RoutineFormProps {
  existingNames?: string[];
}

export const RoutineForm = memo(function RoutineForm({
  existingNames = [],
}: RoutineFormProps) {
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Tên giáo án không được để trống');
      return;
    }
    const isDuplicate = existingNames.some(
      (n) => n.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setError('Tên giáo án đã tồn tại');
      return;
    }

    dispatch({
      type: 'create',
      payload: {
        id: `routine-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmed,
        exerciseIds: [],
      },
    });
    setName('');
    setError(null);
  };

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="routine-name-input">Tên giáo án</label>
        <div className="form-input-row">
          <input
            id="routine-name-input"
            type="text"
            placeholder="Nhập tên giáo án..."
            value={name}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-create">
            Tạo
          </button>
        </div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
});

export function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  const existingNames = useMemo(
    () => routines.map((r) => r.name),
    [routines],
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch({ type: 'remove', payload: { id } });
    },
    [dispatch],
  );

  return (
    <div className="routines-page">
      <header className="page-header">
        <h1>Danh sách giáo án</h1>
      </header>

      <RoutineForm existingNames={existingNames} />

      <section className="routines-list-section">
        {routines.length === 0 ? (
          <p className="no-routines-msg">Chưa có giáo án nào</p>
        ) : (
          <div className="routines-grid">
            {routines.map((routine: Routine) => (
              <div key={routine.id} className="routine-card">
                <div className="routine-card-info">
                  <span className="routine-name">{routine.name}</span>
                  <span className="routine-count">
                    {routine.exerciseIds.length} bài
                  </span>
                </div>
                <div className="routine-card-actions">
                  <Link
                    to={`/routines/${routine.id}`}
                    className="btn btn-detail"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="btn btn-delete"
                    onClick={() => handleDelete(routine.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RoutinesPage;
