import { createContext, useContext, type ReactNode } from 'react';

const ExamContext = createContext(false);

export function ExamModeProvider({ children }: { children: ReactNode }) {
  return <ExamContext.Provider value={true}>{children}</ExamContext.Provider>;
}

export function useExamMode(): boolean {
  return useContext(ExamContext);
}