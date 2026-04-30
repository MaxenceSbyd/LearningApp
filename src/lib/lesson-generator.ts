import type { VocabItem, Exercise } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wrongTranslations(correct: VocabItem, pool: VocabItem[], count = 3): string[] {
  const others = shuffle(pool.filter((v) => v.id !== correct.id));
  return others.slice(0, count).map((v) => v.translation);
}

function wrongTerms(correct: VocabItem, pool: VocabItem[], count = 3): string[] {
  const others = shuffle(pool.filter((v) => v.id !== correct.id));
  return others.slice(0, count).map((v) => v.term);
}

export function generateLesson(themeItems: VocabItem[], allItems: VocabItem[]): Exercise[] {
  const items = shuffle(themeItems).slice(0, 10);
  const exercises: Exercise[] = [];

  // 5× word → translation
  for (const item of items.slice(0, 5)) {
    exercises.push({
      kind: 'mc-word',
      term: item.term,
      reading: item.reading,
      correctTranslation: item.translation,
      options: shuffle([item.translation, ...wrongTranslations(item, allItems)]),
    });
  }

  // 3× translation → word
  for (const item of items.slice(5, 8)) {
    exercises.push({
      kind: 'mc-reverse',
      translation: item.translation,
      correctTerm: item.term,
      options: shuffle([item.term, ...wrongTerms(item, allItems)]),
    });
  }

  // 1× pair match with 4 pairs
  const pairItems = items.slice(0, 4);
  if (pairItems.length === 4) {
    exercises.push({
      kind: 'pair-match',
      pairs: pairItems.map((v) => ({ term: v.term, translation: v.translation, reading: v.reading })),
    });
  }

  return exercises;
}
