export type WorldId = 'python' | 'sql' | 'pandas' | 'numpy' | 'ml';
export type Status = 'not-started' | 'learning' | 'practicing' | 'demonstrated';
export type Lesson = {
  id: string; number: number; world: WorldId; title: string; minutes: number; objectives: string[];
  definitions: { term: string; meaning: string }[]; explanation: string[]; diagram: string;
  source: string; expected: string; applications: string[];
  quiz: { question: string; options: string[]; answer: number; explanation: string };
  repair: { source: string; options: string[]; answer: number; explanation: string };
  build: string; miniProject: string; mainProject: string; supportedInTracer: boolean;
};
export type Progress = { visited: number[]; quizPassed: boolean; predictPassed: boolean; repairPassed: boolean; buildPassed: boolean; projectDone: boolean; mainDone: boolean; attempts: number; bestScore: number; lastScore: number; hintsUsed: number; savedCode?: string; projectCode?: string; updatedAt: string };
export type ProgressMap = Record<string, Progress>;
export type World = { id: WorldId; name: string; tagline: string; color: string; icon: string; count: number };
