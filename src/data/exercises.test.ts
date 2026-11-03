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
});
