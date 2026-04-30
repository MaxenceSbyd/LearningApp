import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { packs } from '../data';
import type { LangCode } from '../types';
import { recordGrammarRead } from '../lib/progress';

export default function Grammar() {
  const { lang, lessonId } = useParams<{ lang: string; lessonId?: string }>();
  const validLang = lang && lang in packs;
  const pack = validLang ? packs[lang as LangCode] : null;
  const lesson = pack && lessonId ? pack.grammar.find((g) => g.id === lessonId) : null;

  useEffect(() => {
    if (pack && lesson) recordGrammarRead(pack.code, lesson.id);
  }, [pack, lesson]);

  if (!validLang || !pack) return <Navigate to="/" replace />;

  // List view
  if (!lessonId) {
    return (
      <div className="py-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to={`/learn/${pack.code}`}
            className="text-xs uppercase tracking-[0.2em] text-warm-grey hover:text-sage transition-colors"
          >
            ← {pack.englishName}
          </Link>
        </div>
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-2 text-center">
          Grammar
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-10">
          {pack.name} — lessons
        </h1>

        <div className="space-y-4">
          {pack.grammar.map((g, i) => (
            <Link
              key={g.id}
              to={`/learn/${pack.code}/grammar/${g.id}`}
              className="group flex items-start gap-5 bg-sand border border-taupe p-6 rounded-sm hover:border-sage hover:translate-x-1 transition-all"
            >
              <div className="font-display text-3xl text-sage leading-none flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className="font-display text-xl text-charcoal mb-1">{g.title}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-warm-grey mb-2">
                  Level {g.level}
                </div>
                <p className="text-sm text-warm-grey leading-relaxed">{g.intro}</p>
              </div>
              <div className="text-warm-grey group-hover:text-sage self-center">→</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Detail view
  if (!lesson) return <Navigate to={`/learn/${pack.code}/grammar`} replace />;

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link
          to={`/learn/${pack.code}/grammar`}
          className="text-xs uppercase tracking-[0.2em] text-warm-grey hover:text-sage transition-colors"
        >
          ← All lessons
        </Link>
        <div className="text-xs uppercase tracking-[0.18em] text-warm-grey">
          Level {lesson.level}
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-2">
        Grammar
      </p>
      <h1 className="font-display text-3xl md:text-5xl text-charcoal mb-6">
        {lesson.title}
      </h1>

      <p className="text-warm-grey leading-relaxed mb-8">{lesson.intro}</p>

      <section className="bg-sand border border-taupe p-6 mb-6 rounded-sm">
        <div className="text-xs uppercase tracking-[0.2em] text-sage font-medium mb-3">
          The Rule
        </div>
        <p className="text-charcoal leading-relaxed">{lesson.rule}</p>
      </section>

      <section className="bg-pale border-l-4 border-sage p-6 mb-6 rounded-sm">
        <div className="text-xs uppercase tracking-[0.2em] text-sage font-medium mb-3">
          Why this matters
        </div>
        <p className="text-charcoal leading-relaxed">{lesson.why}</p>
      </section>

      <section className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-sage font-medium mb-4">
          Examples
        </div>
        <div className="space-y-3">
          {lesson.examples.map((ex, i) => (
            <div key={i} className="bg-sand border border-taupe p-4 rounded-sm">
              <div className="font-display text-xl text-charcoal mb-1">{ex.source}</div>
              <div className="text-sm text-warm-grey italic">{ex.translation}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-between pt-4 border-t border-taupe">
        <Link
          to={`/learn/${pack.code}/grammar`}
          className="px-6 py-3 border border-taupe-strong text-charcoal text-xs uppercase tracking-[0.18em] hover:border-sage hover:text-sage transition-colors"
        >
          ← Lessons
        </Link>
        <Link
          to={`/learn/${pack.code}/quiz`}
          className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors"
        >
          Take the quiz →
        </Link>
      </div>
    </div>
  );
}
