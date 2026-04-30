import type { LangCode } from '../types';

const KEY = 'learningapp.progress.v2';

export interface Progress {
  lastQuizScore: Partial<Record<LangCode, { score: number; total: number; ts: number }>>;
  vocabSeen: Partial<Record<LangCode, string[]>>;
  grammarRead: Partial<Record<LangCode, string[]>>;
  completedLessons: Partial<Record<LangCode, string[]>>;
  xp: number;
  streak: { count: number; lastDate: string };
}

const empty: Progress = {
  lastQuizScore: {},
  vocabSeen: {},
  grammarRead: {},
  completedLessons: {},
  xp: 0,
  streak: { count: 0, lastDate: '' },
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch { /* storage disabled */ }
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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function recordLessonComplete(lang: LangCode, theme: string, xpEarned: number) {
  const p = loadProgress();

  // completed lessons
  const done = new Set(p.completedLessons[lang] ?? []);
  done.add(theme);
  p.completedLessons[lang] = Array.from(done);

  // xp
  p.xp = (p.xp ?? 0) + xpEarned;

  // streak
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (p.streak.lastDate === today) {
    // already counted today, just add xp
  } else if (p.streak.lastDate === yesterday) {
    p.streak = { count: p.streak.count + 1, lastDate: today };
  } else {
    p.streak = { count: 1, lastDate: today };
  }

  saveProgress(p);
}
