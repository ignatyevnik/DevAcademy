import { describe, it, expect } from 'vitest';
import { tracks } from './tracks';
import { courses } from './index';

describe('tracks', () => {
  it('все slug в треках уникальны', () => {
    const slugs = tracks.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('все курсы в треках существуют', () => {
    const courseSlugs = new Set(courses.map((c) => c.slug));
    for (const track of tracks) {
      for (const tc of track.courses) {
        expect(
          courseSlugs.has(tc.slug),
          `трек "${track.slug}": курс "${tc.slug}" не найден`,
        ).toBe(true);
      }
    }
  });

  it('в каждом треке хотя бы 2 курса', () => {
    for (const track of tracks) {
      expect(track.courses.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('в треках нет дублей курсов', () => {
    for (const track of tracks) {
      const slugs = track.courses.map((c) => c.slug);
      expect(
        new Set(slugs).size,
        `трек "${track.slug}": дубли курсов`,
      ).toBe(slugs.length);
    }
  });
});