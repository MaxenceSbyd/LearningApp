import { Link, useParams, Navigate } from 'react-router-dom';
import { packs } from '../data';
import type { LangCode } from '../types';
import { loadProgress } from '../lib/progress';

const modules = [
  {
    key: 'vocab',
    label: 'Vocabulary',
    desc: 'Flashcards with example sentences and notes.',
    icon: '✦',
  },
  {
    key: 'grammar',
    label: 'Grammar',
    desc: 'Rules with the reasoning — the "why" behind each pattern.',
    icon: '✿',
  },
  {
    key: 'quiz',
    label: 'Quiz',
    desc: 'Test what you just learned. Multiple choice, instant feedback.',
    icon: '✺',
  },
];

export default function LanguageHome() {
  const { lang } = useParams<{ lang: string }>();
  if (!lang || !(lang in packs)) return <Navigate to="/" replace />;
  const pack = packs[lang as LangCode];
  const progress = loadProgress();
  const seen = progress.vocabSeen[pack.code]?.length ?? 0;
  const read = progress.grammarRead[pack.code]?.length ?? 0;
  const lastScore = progress.lastQuizScore[pack.code];

  return (
    <div className="py-8">
      <div className="text-center mb-14">
        <div className="text-5xl mb-4">{pack.flag}</div>
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-3">
          {pack.englishName}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-charcoal">{pack.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {modules.map((m) => (
          <Link
            key={m.key}
            to={`/learn/${pack.code}/${m.key}`}
            className="group bg-sand border border-taupe p-7 rounded-sm hover:border-sage hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="font-display text-2xl text-sage mb-1">{m.icon}</div>
            <div className="font-display text-2xl text-charcoal mb-2">{m.label}</div>
            <p className="text-sm text-warm-grey leading-relaxed flex-1">{m.desc}</p>
            <div className="mt-5 pt-4 border-t border-taupe text-xs uppercase tracking-[0.18em] text-warm-grey">
              {m.key === 'vocab' && `${seen} / ${pack.vocab.length} seen`}
              {m.key === 'grammar' && `${read} / ${pack.grammar.length} read`}
              {m.key === 'quiz' &&
                (lastScore
                  ? `Last: ${lastScore.score} / ${lastScore.total}`
                  : 'Not taken yet')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
