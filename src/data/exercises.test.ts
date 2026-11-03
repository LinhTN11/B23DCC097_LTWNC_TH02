import { describe, it, expect } from 'vitest';
import { generateExercises } from './exercises';

describe('generateExercises', () => {
  it('sinh đúng 10000 bài tập', () => {
    const list = generateExercises(10000);
    expect(list).toHaveLength(10000);
  });

  it('các id không được trùng nhau', () => {
    const list = generateExercises(10000);
    const ids = new Set(list.map((ex) => ex.id));
    expect(ids.size).toBe(10000);
  });

  it('mọi thời lượng nằm trong khoảng từ 30 đến 120 giây', () => {
    const list = generateExercises(10000);
    for (const ex of list) {
      expect(ex.duration).toBeGreaterThanOrEqual(30);
      expect(ex.duration).toBeLessThanOrEqual(120);
    }
  });

  it('tự kiểm tra số lượng lọc và sắp xếp theo đặc tả', () => {
    const list = generateExercises(10000);

    // Lọc 'đẩy' -> 1250 kết quả
    const dayList = list.filter(
      (item) =>
        item.name.toLowerCase().includes('đẩy') ||
        item.trainer.toLowerCase().includes('đẩy'),
    );
    expect(dayList).toHaveLength(1250);

    // Lọc 'đẩy' + nhóm cơ 'Vai' -> 250 kết quả
    const dayVaiList = dayList.filter((item) => item.group === 'Vai');
    expect(dayVaiList).toHaveLength(250);

    // Lọc HLV 'đức anh' -> 1000 kết quả
    const ducAnhList = list.filter(
      (item) =>
        item.name.toLowerCase().includes('đức anh') ||
        item.trainer.toLowerCase().includes('đức anh'),
    );
    expect(ducAnhList).toHaveLength(1000);

    // Sắp xếp Tên A-Z trên toàn bộ 10000 bài: dòng đầu tiên là "Bật chậm 1"
    const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    expect(sorted[0].name).toBe('Bật chậm 1');
  });
});
