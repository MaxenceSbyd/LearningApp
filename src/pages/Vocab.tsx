import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { packs } from '../data';
import type { LangCode } from '../types';
import { recordVocabSeen } from '../lib/progress';

export default function Vocab() {
  const { lang } = useParams<{ lang: string }>();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (!lang || !(lang in packs)) return <Navigate to="/" replace />;
  const pack = packs[lang as LangCode];
  const items = pack.vocab;
  const item = items[index];

  useEffect(() => {
    recordVocabSeen(pack.code, item.id);
    setRevealed(false);
  }, [pack.code, item.id]);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link
          to={`/learn/${pack.code}`}
          className="text-xs uppercase tracking-[0.2em] text-warm-grey hover:text-sage transition-colors"
        >
          ← {pack.englishName}
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          {index + 1} / {items.length}
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-2 text-center">
        Vocabulary
      </p>
      <h1 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-10">
        {pack.name} — flashcard
      </h1>

      <div
        className="bg-sand border border-taupe rounded-sm p-10 md:p-14 text-center cursor-pointer hover:border-sage transition-colors min-h-[300px] flex flex-col justify-center"
        onClick={() => setRevealed((r) => !r)}
      >
        <div className="font-display text-5xl md:text-6xl text-charcoal mb-3">
          {item.term}
        </div>
        {item.reading && (
          <div className="text-warm-grey text-sm tracking-widest uppercase mb-2">
            {item.reading}
          </div>
        )}

        {revealed ? (
          <>
            <div className="font-script text-3xl text-sage my-4 leading-none">
              {item.translation}
            </div>
            {item.example && (
              <div className="mt-4 pt-4 border-t border-taupe text-charcoal">
                <div className="text-base mb-1">{item.example}</div>
                {item.exampleTranslation && (
                  <div className="text-sm text-warm-grey italic">
                    {item.exampleTranslation}
                  </div>
                )}
              </div>
            )}
            {item.notes && (
              <div className="mt-4 text-xs text-warm-grey bg-pale border-l-2 border-sage px-4 py-2 text-left">
                💡 {item.notes}
              </div>
            )}
          </>
        ) : (
          <div className="text-xs uppercase tracking-[0.2em] text-warm-grey mt-2">
            Tap to reveal
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3 mt-8">
        <button
          onClick={prev}
          className="px-6 py-3 border border-taupe-strong text-charcoal text-xs uppercase tracking-[0.18em] hover:border-sage hover:text-sage transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={() => setRevealed((r) => !r)}
          className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors"
        >
          {revealed ? 'Hide' : 'Reveal'}
        </button>
        <button
          onClick={next}
          className="px-6 py-3 border border-taupe-strong text-charcoal text-xs uppercase tracking-[0.18em] hover:border-sage hover:text-sage transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
