import { useState, useEffect } from 'react';
import type { PairMatchExercise } from '../../types';

interface Props {
  ex: PairMatchExercise;
  onComplete: (perfect: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PairMatch({ ex, onComplete }: Props) {
  const [leftItems] = useState(() => shuffle(ex.pairs.map((p) => p.term)));
  const [rightItems] = useState(() => shuffle(ex.pairs.map((p) => p.translation)));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const termToTranslation = Object.fromEntries(ex.pairs.map((p) => [p.term, p.translation]));

  useEffect(() => {
    if (matched.size === ex.pairs.length) {
      setTimeout(() => onComplete(mistakes === 0), 600);
    }
  }, [matched, ex.pairs.length, mistakes, onComplete]);

  const handleLeft = (term: string) => {
    if (matched.has(term)) return;
    setSelectedLeft(term);
    setWrong(null);
  };

  const handleRight = (translation: string) => {
    if (!selectedLeft) return;
    const isMatch = termToTranslation[selectedLeft] === translation;
    if (isMatch) {
      setMatched((prev) => new Set([...prev, selectedLeft]));
      setSelectedLeft(null);
    } else {
      setWrong(translation);
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setWrong(null);
        setSelectedLeft(null);
      }, 700);
    }
  };

  const matchedTranslations = new Set(
    ex.pairs.filter((p) => matched.has(p.term)).map((p) => p.translation)
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-warm-grey text-center mb-6">
        Match each word to its translation
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {leftItems.map((term) => {
            const isDone = matched.has(term);
            const isSelected = selectedLeft === term;
            let cls = 'w-full px-4 py-3.5 border rounded-sm transition-all text-sm font-medium text-center';
            if (isDone) {
              cls += ' border-sage bg-sage/15 text-sage cursor-default';
            } else if (isSelected) {
              cls += ' border-sage bg-sage text-ivory cursor-pointer';
            } else {
              cls += ' border-taupe-strong bg-ivory hover:border-sage hover:bg-sand cursor-pointer';
            }
            return (
              <button key={term} className={cls} onClick={() => handleLeft(term)} disabled={isDone}>
                {term}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {rightItems.map((translation) => {
            const isDone = matchedTranslations.has(translation);
            const isWrong = wrong === translation;
            let cls = 'w-full px-4 py-3.5 border rounded-sm transition-all text-sm font-medium text-center';
            if (isDone) {
              cls += ' border-sage bg-sage/15 text-sage cursor-default';
            } else if (isWrong) {
              cls += ' border-red-400 bg-red-50 text-charcoal cursor-pointer animate-shake';
            } else {
              cls += ` border-taupe-strong bg-ivory text-charcoal ${selectedLeft ? 'hover:border-sage hover:bg-sand cursor-pointer' : 'cursor-default opacity-60'}`;
            }
            return (
              <button
                key={translation}
                className={cls}
                onClick={() => handleRight(translation)}
                disabled={isDone || !selectedLeft}
              >
                {translation}
              </button>
            );
          })}
        </div>
      </div>

      {matched.size > 0 && matched.size < ex.pairs.length && (
        <p className="text-center text-xs text-warm-grey mt-4 uppercase tracking-widest">
          {matched.size} / {ex.pairs.length} matched
        </p>
      )}
    </div>
  );
}
