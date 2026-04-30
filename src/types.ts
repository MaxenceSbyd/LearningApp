export type LangCode = 'fr' | 'ja';

export interface VocabItem {
  id: string;
  term: string;          // The word in the target language
  reading?: string;      // Romaji or pronunciation guide
  translation: string;   // English translation
  example?: string;      // Example sentence in target language
  exampleTranslation?: string;
  notes?: string;        // Optional tip
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: 'A1' | 'A2' | 'beginner';
  intro: string;
  rule: string;
  why: string;           // The "why" behind the rule — user requirement
  examples: { source: string; translation: string }[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface LanguagePack {
  code: LangCode;
  name: string;          // "Français" / "日本語"
  englishName: string;   // "French" / "Japanese"
  flag: string;          // emoji or short text
  introNote: string;
  vocab: VocabItem[];
  grammar: GrammarLesson[];
  quiz: QuizQuestion[];
}
