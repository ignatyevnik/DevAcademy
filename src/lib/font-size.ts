import { useState, useEffect } from 'react';

const STORAGE_KEY = 'devlearn-font-size';
export type FontSize = 's' | 'm' | 'l';

function getInitial(): FontSize {
  if (typeof window === 'undefined') return 'm';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 's' || stored === 'm' || stored === 'l') return stored;
  return 'm';
}

const SIZES: Record<FontSize, string> = {
  s: '15px',
  m: '16px',
  l: '18px',
};

export function useFontSize() {
  const [size, setSize] = useState<FontSize>(getInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, size);
    document.documentElement.style.setProperty('--reading-font-size', SIZES[size]);
  }, [size]);

  return { size, setSize };
}