import type { LangCode } from '../types';

const KEY = 'learningapp.progress.v1';

export interface Progress {
  lastQuizScore: Partial<Record<LangCode, { score: number; total: number; ts: number }>>;
  vocabSeen: Partial<Record<LangCode, string[]>>;
  grammarRead: Partial<Record<LangCode, string[]>>;
}

const empty: Progress = { lastQuizScore: {}, vocabSeen: {}, grammarRead: {} };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* localStorage disabled — silently ignore */
  }
}

export function recordVocabSeen(lang: LangCode, id: string) {
  const p = loadProgress();
  const seen = new Set(p.vocabSeen[lang] ?? []);
  seen.add(id);
  p.vocabSeen[lang] = Array.from(seen);
  saveProgress(p);
}

export function recordGrammarRead(lang: LangCode, id: string) {
  const p = loadProgress();
  const read = new Set(p.grammarRead[lang] ?? []);
  read.add(id);
  p.grammarRead[lang] = Array.from(read);
  saveProgress(p);
}

export function recordQuizScore(lang: LangCode, score: number, total: number) {
  const p = loadProgress();
  p.lastQuizScore[lang] = { score, total, ts: Date.now() };
  saveProgress(p);
}
