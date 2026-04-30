import { useState, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { packs } from '../data';
import type { LangCode } from '../types';
import { recordQuizScore } from '../lib/progress';

export default function Quiz() {
  const { lang } = useParams<{ lang: string }>();
  const validLang = lang && lang in packs;
  const pack = validLang ? packs[lang as LangCode] : null;
  const questions = useMemo(() => pack?.quiz ?? [], [pack]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  if (!validLang || !pack) return <Navigate to="/" replace />;

  const q = questions[index];
  const isCorrect = picked !== null && picked === q.answerIndex;

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index === questions.length - 1) {
      setDone(true);
      if (!scoreSaved) {
        recordQuizScore(pack.code, score, questions.length);
        setScoreSaved(true);
      }
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setScoreSaved(false);
  };

  if (done) {
    const percent = Math.round((score / questions.length) * 100);
    const message =
      percent >= 80
        ? 'Excellent.'
        : percent >= 60
        ? 'Solid. Review the misses and try again.'
        : 'Keep going. Re-read the lessons and retry.';
    return (
      <div className="py-8 max-w-xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-3">
          Quiz complete
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-6">
          {pack.name}
        </h1>
        <div className="font-script text-7xl text-sage leading-none mb-2">
          {score} / {questions.length}
        </div>
        <p className="text-warm-grey mb-10">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={restart}
            className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors"
          >
            Try again
          </button>
          <Link
            to={`/learn/${pack.code}`}
            className="px-6 py-3 border border-taupe-strong text-charcoal text-xs uppercase tracking-[0.18em] hover:border-sage hover:text-sage transition-colors"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

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
          {index + 1} / {questions.length}
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-2 text-center">
        Quiz
      </p>
      <h1 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-12">
        {pack.name}
      </h1>

      <div className="bg-sand border border-taupe rounded-sm p-8 mb-6">
        <div className="text-xl md:text-2xl text-charcoal text-center font-medium leading-relaxed">
          {q.prompt}
        </div>
      </div>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answerIndex;
          let cls =
            'w-full text-left px-5 py-4 border rounded-sm transition-colors';
          if (picked === null) {
            cls += ' border-taupe-strong bg-ivory hover:border-sage hover:bg-sand cursor-pointer';
          } else if (isAnswer) {
            cls += ' border-sage bg-sage/10 text-charcoal';
          } else if (isPicked && !isAnswer) {
            cls += ' border-bronze bg-bronze/10 text-charcoal';
          } else {
            cls += ' border-taupe bg-ivory text-warm-grey opacity-60';
          }
          return (
            <button key={i} className={cls} onClick={() => handlePick(i)} disabled={picked !== null}>
              <span className="font-display text-lg text-sage mr-3">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-6 bg-pale border-l-4 border-sage p-4 rounded-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-sage font-medium mb-2">
            {isCorrect ? '✓ Correct' : '✗ Not quite'}
          </div>
          {q.explanation && (
            <p className="text-sm text-charcoal leading-relaxed">{q.explanation}</p>
          )}
          {!q.explanation && !isCorrect && (
            <p className="text-sm text-charcoal">
              Correct answer: <strong>{q.options[q.answerIndex]}</strong>
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={picked === null}
          className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {index === questions.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
