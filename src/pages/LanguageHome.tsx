import { Link, useParams, Navigate } from 'react-router-dom';
import { packs } from '../data';
import type { LangCode } from '../types';
import { loadProgress } from '../lib/progress';

export default function LanguageHome() {
  const { lang } = useParams<{ lang: string }>();
  if (!lang || !(lang in packs)) return <Navigate to="/" replace />;
  const pack = packs[lang as LangCode];
  const progress = loadProgress();
  const completed = new Set(progress.completedLessons[pack.code] ?? []);
  const seen = progress.vocabSeen[pack.code]?.length ?? 0;
  const read = progress.grammarRead[pack.code]?.length ?? 0;
  const lastScore = progress.lastQuizScore[pack.code];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">{pack.flag}</div>
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-3">
          {pack.englishName}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-charcoal">{pack.name}</h1>
      </div>

      {/* Units / Lessons */}
      <section className="mb-14">
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-5">
          Lessons
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pack.units.map((unit) => {
            const isDone = completed.has(unit.theme);
            const themeCount = pack.vocab.filter((v) => v.theme === unit.theme).length;
            return (
              <Link
                key={unit.id}
                to={`/learn/${pack.code}/lesson/${unit.theme}`}
                className={`group relative flex flex-col items-center text-center p-6 rounded-sm border transition-all hover:-translate-y-1 ${
                  isDone
                    ? 'bg-sage/10 border-sage'
                    : 'bg-sand border-taupe hover:border-sage'
                }`}
              >
                {isDone && (
                  <span className="absolute top-3 right-3 text-sage text-xs font-medium">✓</span>
                )}
                <div className="text-4xl mb-3">{unit.icon}</div>
                <div className="font-display text-xl text-charcoal mb-1">{unit.label}</div>
                <div className="text-xs text-warm-grey mb-4">{themeCount} words</div>
                <div
                  className={`text-xs uppercase tracking-[0.18em] transition-colors ${
                    isDone ? 'text-sage' : 'text-warm-grey group-hover:text-sage'
                  }`}
                >
                  {isDone ? 'Practice again' : 'Start →'}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Practice section */}
      <section>
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-5">
          Practice
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to={`/learn/${pack.code}/vocab`}
            className="group bg-sand border border-taupe p-6 rounded-sm hover:border-sage hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="font-display text-2xl text-sage mb-1">✦</div>
            <div className="font-display text-xl text-charcoal mb-2">Flashcards</div>
            <p className="text-sm text-warm-grey leading-relaxed flex-1">
              All vocabulary with examples and notes.
            </p>
            <div className="mt-4 pt-3 border-t border-taupe text-xs uppercase tracking-[0.18em] text-warm-grey">
              {seen} / {pack.vocab.length} seen
            </div>
          </Link>

          <Link
            to={`/learn/${pack.code}/grammar`}
            className="group bg-sand border border-taupe p-6 rounded-sm hover:border-sage hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="font-display text-2xl text-sage mb-1">✿</div>
            <div className="font-display text-xl text-charcoal mb-2">Grammar</div>
            <p className="text-sm text-warm-grey leading-relaxed flex-1">
              Rules with the reasoning — the "why" behind each pattern.
            </p>
            <div className="mt-4 pt-3 border-t border-taupe text-xs uppercase tracking-[0.18em] text-warm-grey">
              {read} / {pack.grammar.length} read
            </div>
          </Link>

          <Link
            to={`/learn/${pack.code}/quiz`}
            className="group bg-sand border border-taupe p-6 rounded-sm hover:border-sage hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="font-display text-2xl text-sage mb-1">✺</div>
            <div className="font-display text-xl text-charcoal mb-2">Quiz</div>
            <p className="text-sm text-warm-grey leading-relaxed flex-1">
              Test your knowledge. Multiple choice, instant feedback.
            </p>
            <div className="mt-4 pt-3 border-t border-taupe text-xs uppercase tracking-[0.18em] text-warm-grey">
              {lastScore ? `Last: ${lastScore.score} / ${lastScore.total}` : 'Not taken yet'}
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
