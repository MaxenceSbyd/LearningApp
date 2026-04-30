import { useState, useMemo, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { packs } from '../data';
import type { LangCode } from '../types';
import { generateLesson } from '../lib/lesson-generator';
import { recordLessonComplete } from '../lib/progress';
import MCWord from '../components/exercises/MCWord';
import MCReverse from '../components/exercises/MCReverse';
import PairMatch from '../components/exercises/PairMatch';

const MAX_HEARTS = 5;

type Phase = 'exercise' | 'feedback' | 'complete' | 'failed';

export default function Lesson() {
  const { lang, theme } = useParams<{ lang: string; theme: string }>();
  const navigate = useNavigate();

  const validLang = lang && lang in packs;
  const pack = validLang ? packs[lang as LangCode] : null;

  const { exercises, unit } = useMemo(() => {
    if (!pack || !theme) return { exercises: [], unit: null };
    const u = pack.units.find((u) => u.theme === theme) ?? null;
    const themeItems = pack.vocab.filter((v) => v.theme === theme);
    return { exercises: generateLesson(themeItems, pack.vocab), unit: u };
  }, [pack, theme]);

  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xpEarned, setXpEarned] = useState(0);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState('');

  if (!validLang || !pack || !theme) return <Navigate to="/" replace />;
  if (exercises.length === 0) return <Navigate to={`/learn/${lang}`} replace />;

  const ex = exercises[index];
  const progress = (index / exercises.length) * 100;

  const handleAnswer = (correct: boolean, correctAns: string) => {
    setIsCorrect(correct);
    setCorrectAnswer(correctAns);
    if (correct) {
      setXpEarned((x) => x + 10);
    } else {
      setHearts((h) => h - 1);
    }
    setPhase('feedback');
  };

  const handleMCPick = (picked: string, correctValue: string) => {
    setPicked(picked);
    setTimeout(() => {
      handleAnswer(picked === correctValue, correctValue);
    }, 500);
  };

  const handlePairComplete = useCallback((perfect: boolean) => {
    setIsCorrect(perfect);
    setCorrectAnswer('');
    if (perfect) {
      setXpEarned((x) => x + 15);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
    setPhase('feedback');
  }, []);

  const handleNext = () => {
    if (hearts <= 0 && !isCorrect) {
      setPhase('failed');
      return;
    }
    const newHearts = isCorrect ? hearts : hearts;
    if (newHearts <= 0) {
      setPhase('failed');
      return;
    }
    if (index + 1 >= exercises.length) {
      recordLessonComplete(pack.code, theme, xpEarned);
      setPhase('complete');
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setPhase('exercise');
      setIsCorrect(null);
    }
  };

  if (phase === 'failed') {
    return (
      <div className="py-12 max-w-xl mx-auto text-center">
        <div className="text-6xl mb-6">💔</div>
        <h1 className="font-display text-4xl text-charcoal mb-3">Out of hearts</h1>
        <p className="text-warm-grey mb-10">Don't give up — every mistake is a lesson.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(`/learn/${lang}/lesson/${theme}`)}
            className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => navigate(`/learn/${lang}`)}
            className="px-6 py-3 border border-taupe-strong text-charcoal text-xs uppercase tracking-[0.18em] hover:border-sage hover:text-sage transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    const isPerfect = hearts === MAX_HEARTS;
    return (
      <div className="py-12 max-w-xl mx-auto text-center">
        <div className="confetti-burst text-5xl mb-2">🎉</div>
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-2">
          {isPerfect ? 'Perfect!' : 'Lesson complete!'}
        </h1>
        <p className="font-script text-3xl text-sage mb-8 leading-none">
          {unit?.label ?? theme}
        </p>
        <div className="flex justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="font-display text-4xl text-sage">{xpEarned}</div>
            <div className="text-xs uppercase tracking-widest text-warm-grey mt-1">XP earned</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl text-charcoal">
              {'❤️'.repeat(hearts)}{'🖤'.repeat(MAX_HEARTS - hearts)}
            </div>
            <div className="text-xs uppercase tracking-widest text-warm-grey mt-1">Hearts left</div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(`/learn/${lang}/lesson/${theme}`)}
            className="px-6 py-3 border border-taupe-strong text-charcoal text-xs uppercase tracking-[0.18em] hover:border-sage hover:text-sage transition-colors"
          >
            Practice again
          </button>
          <button
            onClick={() => navigate(`/learn/${lang}`)}
            className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/learn/${lang}`)}
          className="text-warm-grey hover:text-sage transition-colors text-lg leading-none"
          aria-label="Exit lesson"
        >
          ✕
        </button>
        <div className="flex-1 h-2.5 bg-taupe rounded-full overflow-hidden">
          <div
            className="h-full bg-sage rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-0.5 text-lg leading-none">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={i < hearts ? '' : 'opacity-20'}>❤️</span>
          ))}
        </div>
      </div>

      {/* Exercise */}
      {phase === 'exercise' && (
        <div className="animate-fade-in">
          {ex.kind === 'mc-word' && (
            <MCWord
              ex={ex}
              picked={picked}
              onPick={(opt) => handleMCPick(opt, ex.correctTranslation)}
            />
          )}
          {ex.kind === 'mc-reverse' && (
            <MCReverse
              ex={ex}
              picked={picked}
              onPick={(opt) => handleMCPick(opt, ex.correctTerm)}
            />
          )}
          {ex.kind === 'pair-match' && (
            <PairMatch ex={ex} onComplete={handlePairComplete} />
          )}
        </div>
      )}

      {/* Feedback banner */}
      {phase === 'feedback' && (
        <div className="animate-fade-in">
          {/* Re-render exercise in locked state */}
          {ex.kind === 'mc-word' && <MCWord ex={ex} picked={picked} onPick={() => {}} />}
          {ex.kind === 'mc-reverse' && <MCReverse ex={ex} picked={picked} onPick={() => {}} />}

          <div
            className={`mt-6 p-5 rounded-sm border-l-4 ${
              isCorrect
                ? 'bg-sage/10 border-sage'
                : 'bg-red-50 border-red-400'
            }`}
          >
            <div
              className={`text-xs uppercase tracking-[0.2em] font-medium mb-1 ${
                isCorrect ? 'text-sage' : 'text-red-500'
              }`}
            >
              {isCorrect ? '✓ Correct!' : '✗ Not quite'}
            </div>
            {!isCorrect && correctAnswer && (
              <p className="text-sm text-charcoal">
                Correct answer: <strong>{correctAnswer}</strong>
              </p>
            )}
            {isCorrect && ex.kind === 'pair-match' && (
              <p className="text-sm text-charcoal">All pairs matched perfectly!</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-charcoal text-ivory text-xs uppercase tracking-[0.18em] hover:bg-sage transition-colors"
            >
              {index + 1 >= exercises.length ? 'Finish' : 'Continue →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
