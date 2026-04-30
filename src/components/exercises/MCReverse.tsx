import type { MCReverseExercise } from '../../types';

interface Props {
  ex: MCReverseExercise;
  picked: string | null;
  onPick: (opt: string) => void;
}

export default function MCReverse({ ex, picked, onPick }: Props) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-warm-grey text-center mb-4">
        How do you say this?
      </p>
      <div className="bg-sand border border-taupe rounded-sm p-8 text-center mb-8">
        <div className="font-display text-4xl text-charcoal">{ex.translation}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ex.options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = opt === ex.correctTerm;
          let cls = 'w-full text-left px-4 py-3.5 border rounded-sm transition-all text-sm font-medium';
          if (!picked) {
            cls += ' border-taupe-strong bg-ivory hover:border-sage hover:bg-sand cursor-pointer';
          } else if (isCorrect) {
            cls += ' border-sage bg-sage/15 text-charcoal';
          } else if (isPicked) {
            cls += ' border-red-400 bg-red-50 text-charcoal';
          } else {
            cls += ' border-taupe bg-ivory text-warm-grey opacity-50';
          }
          return (
            <button key={opt} className={cls} onClick={() => onPick(opt)} disabled={!!picked}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
