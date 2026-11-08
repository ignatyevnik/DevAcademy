import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import EditorPage from './EditorPage';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EditorPage', () => {
  it('smoke: рендерится без падения', () => {
    const { container } = render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();
  });
});