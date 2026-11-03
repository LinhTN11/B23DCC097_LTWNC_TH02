import { useState, useMemo, useCallback, memo } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import type { Exercise } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import { useRoutines, useRoutineDispatch } from '../routines/RoutineContext';
import { ExerciseRow } from './ExerciseRow';

interface ItemData {
  items: Exercise[];
  savedIdsSet: Set<string>;
  isRoutineDisabled: boolean;
  onStart: (exercise: Exercise, index: number) => void;
  onToggleSave: (exercise: Exercise) => void;
  onAddToSession: (exercise: Exercise) => void;
  onAddToRoutine: (exercise: Exercise) => void;
}

const Row = memo(function Row({ index, style, data }: ListChildComponentProps<ItemData>) {
  const exercise = data.items[index];
  if (!exercise) return null;
  const isSaved = data.savedIdsSet.has(exercise.id);

  return (
    <ExerciseRow
      exercise={exercise}
      index={index}
      style={style}
      isSaved={isSaved}
      isRoutineDisabled={data.isRoutineDisabled}
      onStart={(ex) => data.onStart(ex, index)}
      onToggleSave={data.onToggleSave}
      onAddToSession={data.onAddToSession}
      onAddToRoutine={data.onAddToRoutine}
    />
  );
});

export function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'duration-asc'>('default');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');

  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  const savedIds = useSavedStore((s) => s.ids);
  const savedIdsSet = useMemo(() => new Set(savedIds), [savedIds]);

  const activeRoutineId = useMemo(() => {
    if (routines.length === 0) return '';
    const found = routines.find((r) => r.id === selectedRoutineId);
    return found ? found.id : routines[0].id;
  }, [routines, selectedRoutineId]);

  const debouncedKeyword = useDebounce(keyword, 300);

  const handleKeywordShift = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'default' | 'name-asc' | 'duration-asc');
  };

  const handleRoutineSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoutineId(e.target.value);
  }, []);

  const filteredExercises = useMemo(() => {
    let list = EXERCISES;

    const term = debouncedKeyword.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.trainer.toLowerCase().includes(term),
      );
    }

    if (selectedGroup !== 'All') {
      list = list.filter((item) => item.group === selectedGroup);
    }

    if (sortBy === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    if (sortBy === 'duration-asc') {
      return [...list].sort((a, b) => a.duration - b.duration);
    }

    return list;
  }, [debouncedKeyword, selectedGroup, sortBy]);

  const handleStart = useCallback(
    (_exercise: Exercise, index: number) => {
      useSessionStore.getState().startSession(filteredExercises, index);
    },
    [filteredExercises],
  );

  const handleToggleSave = useCallback((exercise: Exercise) => {
    useSavedStore.getState().toggle(exercise.id);
  }, []);

  const handleAddToSession = useCallback((exercise: Exercise) => {
    useSessionStore.getState().addToSession(exercise);
  }, []);

  const handleAddToRoutine = useCallback(
    (exercise: Exercise) => {
      if (!activeRoutineId) return;
      dispatch({
        type: 'addExercise',
        payload: { routineId: activeRoutineId, exerciseId: exercise.id },
      });
    },
    [activeRoutineId, dispatch],
  );

  const isRoutineDisabled = routines.length === 0 || !activeRoutineId;

  const itemData = useMemo<ItemData>(
    () => ({
      items: filteredExercises,
      savedIdsSet,
      isRoutineDisabled,
      onStart: handleStart,
      onToggleSave: handleToggleSave,
      onAddToSession: handleAddToSession,
      onAddToRoutine: handleAddToRoutine,
    }),
    [
      filteredExercises,
      savedIdsSet,
      isRoutineDisabled,
      handleStart,
      handleToggleSave,
      handleAddToSession,
      handleAddToRoutine,
    ],
  );

  return (
    <div className="library-page">
      <header className="page-header">
        <h1>Kho bài tập</h1>
      </header>

      <section className="filters-bar">
        <div className="filter-group">
          <label htmlFor="keyword-search">Tìm kiếm</label>
          <input
            id="keyword-search"
            type="text"
            placeholder="Tìm theo tên bài hoặc HLV..."
            value={keyword}
            onChange={handleKeywordShift}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="group-select">Nhóm cơ</label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={handleGroupChange}
          >
            <option value="All">Tất cả</option>
            {GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A–Z</option>
            <option value="duration-asc">Thời lượng tăng dần</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="routine-select">Giáo án đang chọn</label>
          <select
            id="routine-select"
            value={activeRoutineId}
            onChange={handleRoutineSelect}
            disabled={routines.length === 0}
          >
            {routines.length === 0 ? (
              <option value="">(Chưa có giáo án)</option>
            ) : (
              routines.map((routine) => (
                <option key={routine.id} value={routine.id}>
                  {routine.name}
                </option>
              ))
            )}
          </select>
        </div>
      </section>

      <section className="results-info">
        {filteredExercises.length > 0 ? (
          <p className="results-count">Tìm thấy {filteredExercises.length} bài tập</p>
        ) : (
          <p className="results-count">Không tìm thấy bài tập nào</p>
        )}
      </section>

      {filteredExercises.length > 0 && (
        <div className="list-wrapper">
          <FixedSizeList
            height={560}
            width="100%"
            itemCount={filteredExercises.length}
            itemSize={56}
            itemKey={(index, data) => data.items[index].id}
            itemData={itemData}
          >
            {Row}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
}

export default LibraryPage;
