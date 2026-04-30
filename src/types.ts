export type LangCode = 'fr' | 'ja';

export interface VocabItem {
  id: string;
  term: string;
  reading?: string;
  translation: string;
  example?: string;
  exampleTranslation?: string;
  notes?: string;
  theme: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: 'A1' | 'A2' | 'beginner';
  intro: string;
  rule: string;
  why: string;
  examples: { source: string; translation: string }[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface Unit {
  id: string;
  theme: string;
  icon: string;
  label: string;
}

export interface LanguagePack {
  code: LangCode;
  name: string;
  englishName: string;
  flag: string;
  introNote: string;
  vocab: VocabItem[];
  grammar: GrammarLesson[];
  quiz: QuizQuestion[];
  units: Unit[];
}

// ── Exercise types ───────────────────────────────────────────────────────────

export interface MCWordExercise {
  kind: 'mc-word';
  term: string;
  reading?: string;
  correctTranslation: string;
  options: string[];
}

export interface MCReverseExercise {
  kind: 'mc-reverse';
  translation: string;
  correctTerm: string;
  options: string[];
}

export interface PairMatchExercise {
  kind: 'pair-match';
  pairs: { term: string; translation: string; reading?: string }[];
}

export type Exercise = MCWordExercise | MCReverseExercise | PairMatchExercise;
