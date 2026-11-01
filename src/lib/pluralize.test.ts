import { describe, it, expect } from 'vitest';
import { plural, lessonsWord, stepsWord, coursesWord } from './pluralize';

describe('plural', () => {
  it('1, 21, 101 → one', () => {
    expect(plural(1, 'a', 'b', 'c')).toBe('a');
    expect(plural(21, 'a', 'b', 'c')).toBe('a');
    expect(plural(101, 'a', 'b', 'c')).toBe('a');
  });

  it('2–4 → few', () => {
    expect(plural(2, 'a', 'b', 'c')).toBe('b');
    expect(plural(4, 'a', 'b', 'c')).toBe('b');
    expect(plural(22, 'a', 'b', 'c')).toBe('b');
  });

  it('5–20 → many', () => {
    expect(plural(5, 'a', 'b', 'c')).toBe('c');
    expect(plural(15, 'a', 'b', 'c')).toBe('c');
    expect(plural(20, 'a', 'b', 'c')).toBe('c');
  });

  it('11–14 → всегда many, даже если последняя цифра 1–4', () => {
    expect(plural(11, 'a', 'b', 'c')).toBe('c');
    expect(plural(12, 'a', 'b', 'c')).toBe('c');
    expect(plural(13, 'a', 'b', 'c')).toBe('c');
    expect(plural(14, 'a', 'b', 'c')).toBe('c');
  });

  it('0 → many', () => {
    expect(plural(0, 'a', 'b', 'c')).toBe('c');
  });
});

describe('word helpers', () => {
  it('lessonsWord', () => {
    expect(lessonsWord(1)).toBe('урок');
    expect(lessonsWord(2)).toBe('урока');
    expect(lessonsWord(5)).toBe('уроков');
  });
  it('stepsWord', () => {
    expect(stepsWord(1)).toBe('шаг');
    expect(stepsWord(3)).toBe('шага');
    expect(stepsWord(10)).toBe('шагов');
  });
  it('coursesWord', () => {
    expect(coursesWord(1)).toBe('курс');
    expect(coursesWord(4)).toBe('курса');
    expect(coursesWord(5)).toBe('курсов');
  });
});