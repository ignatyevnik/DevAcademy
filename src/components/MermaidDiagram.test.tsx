import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MermaidDiagram } from './MermaidDiagram';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg><text>Mock</text></svg>' }),
  },
}));

afterEach(() => {
  cleanup();
});

describe('MermaidDiagram', () => {
  it('smoke: рендерится без ошибок', () => {
    const { container } = render(
      <MermaidDiagram code="graph TD; A-->B;" caption="Тестовая диаграмма" />,
    );
    expect(container).toBeTruthy();
  });

  it('отображает подпись', () => {
    const { getByText } = render(
      <MermaidDiagram code="graph TD; A-->B;" caption="Тестовая диаграмма" />,
    );
    expect(getByText('Тестовая диаграмма')).toBeTruthy();
  });
});