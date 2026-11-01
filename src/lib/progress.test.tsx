import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProgressProvider, useProgress } from './progress';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

describe('ProgressProvider', () => {
  it('начальное состояние пустое', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.state.done).toEqual({});
    expect(result.current.state.lastVisited).toEqual({});
    expect(result.current.state.quizResults).toEqual({});
  });

  it('completeStep добавляет шаг в done', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => result.current.completeStep('py', 'step-1'));
    expect(result.current.isStepDone('py', 'step-1')).toBe(true);
    expect(result.current.isStepDone('py', 'step-2')).toBe(false);
  });

  it('completeStep идемпотентен', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.completeStep('py', 'step-1');
      result.current.completeStep('py', 'step-1');
    });
    expect(Object.keys(result.current.state.done)).toHaveLength(1);
  });

  it('setQuizResult не понижает ok → fail', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => result.current.setQuizResult('py', 's1', 'ok'));
    act(() => result.current.setQuizResult('py', 's1', 'fail'));
    expect(result.current.quizResult('py', 's1')).toBe('ok');
  });

  it('setQuizResult повышает fail → ok', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => result.current.setQuizResult('py', 's1', 'fail'));
    act(() => result.current.setQuizResult('py', 's1', 'ok'));
    expect(result.current.quizResult('py', 's1')).toBe('ok');
  });

  it('setQuizResult не понижает ok → partial', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => result.current.setQuizResult('py', 's1', 'ok'));
    act(() => result.current.setQuizResult('py', 's1', 'partial'));
    expect(result.current.quizResult('py', 's1')).toBe('ok');
  });

  it('visit сохраняет lastVisited с шагом', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => result.current.visit('py', 'lesson-1', 2));
    const last = result.current.state.lastVisited['py'];
    expect(last?.lessonId).toBe('lesson-1');
    expect(last?.stepIndex).toBe(2);
    expect(last?.ts).toBeGreaterThan(0);
  });

  it('resetCourse очищает только этот курс', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.completeStep('py', 'step-1');
      result.current.completeStep('py', 'step-2');
      result.current.completeStep('qa', 'step-3');
    });
    act(() => result.current.resetCourse('py'));
    expect(result.current.isStepDone('py', 'step-1')).toBe(false);
    expect(result.current.isStepDone('py', 'step-2')).toBe(false);
    expect(result.current.isStepDone('qa', 'step-3')).toBe(true);
  });

  it('сохраняет состояние в localStorage', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => result.current.completeStep('py', 'step-1'));
    const raw = localStorage.getItem('devlearn-progress-v1');
    expect(raw).toBeTruthy();
    const saved = JSON.parse(raw!);
    expect(saved.done['py:step-1']).toBe(true);
  });

  it('загружает состояние из localStorage при старте', () => {
    localStorage.setItem(
      'devlearn-progress-v1',
      JSON.stringify({
        done: { 'py:step-1': true },
        lastVisited: {},
        quizResults: {},
      }),
    );
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.isStepDone('py', 'step-1')).toBe(true);
  });

  it('устойчив к битому localStorage', () => {
    localStorage.setItem('devlearn-progress-v1', 'not a json {');
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.state.done).toEqual({});
  });

  it('courseProgress возвращает корректные числа', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    const before = result.current.courseProgress('python-basics');
    expect(before.pct).toBe(0);
    expect(before.total).toBeGreaterThan(0);
  });
});