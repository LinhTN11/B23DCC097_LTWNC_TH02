import { useState, useMemo, useCallback, memo } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import type { Exercise } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { ExerciseRow } from './ExerciseRow';

interface ItemData {
  items: Exercise[];
  onStart: (exercise: Exercise) => void;
}

const Row = memo(function Row({ index, style, data }: ListChildComponentProps<ItemData>) {
  const exercise = data.items[index];
  if (!exercise) return null;
  return (
    <ExerciseRow
      exercise={exercise}
      index={index}
      style={style}
      onStart={data.onStart}
    />
  );
});

export function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'duration-asc'>('default');

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

  const handleStart = useCallback((exercise: Exercise) => {
    // Placeholder callback for starting a session (wired up in Part 2)
    void exercise;
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

  const itemData = useMemo<ItemData>(
    () => ({
      items: filteredExercises,
      onStart: handleStart,
    }),
    [filteredExercises, handleStart],
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
