export interface SrsCard {
  interval: number; // интервал в днях
  nextReview: number; // timestamp следующего показа
  ease: number; // коэффициент легкости
  repetitions: number; // сколько раз подряд ответили верно
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function calculateSrs(isCorrect: boolean, current?: SrsCard): SrsCard {
  const now = Date.now();
  let ease = current?.ease ?? 2.5;
  let interval = current?.interval ?? 0;
  let repetitions = current?.repetitions ?? 0;

  if (isCorrect) {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * ease);
  } else {
    // Ошибка: сбрасываем прогресс, возвращаем через 10 минут для быстрого закрепления
    repetitions = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }

  // Для ошибок делаем nextReview через 10 минут, чтобы можно было сразу переиграть
  const nextReview = now + (isCorrect ? interval * DAY_MS : 10 * 60 * 1000);

  return { interval, nextReview, ease, repetitions };
}