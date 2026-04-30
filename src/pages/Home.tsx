import { Link } from 'react-router-dom';
import { packs } from '../data';

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.28em] text-sage font-medium mb-4">
          ── Welcome
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight text-charcoal mb-3">
          Learn a <span className="font-script text-sage normal-case">language</span>
        </h1>
        <p className="text-warm-grey max-w-xl mx-auto leading-relaxed">
          Two paths, two languages. Vocabulary exercises, grammar with the
          reasoning behind each rule, and a quick test at the end of every
          session.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {Object.values(packs).map((p) => (
          <Link
            key={p.code}
            to={`/learn/${p.code}`}
            className="group bg-sand border border-taupe p-10 rounded-sm hover:border-sage hover:-translate-y-1 transition-all"
          >
            <div className="text-5xl mb-6">{p.flag}</div>
            <div className="font-display text-3xl mb-1 text-charcoal">{p.name}</div>
            <div className="font-script text-2xl text-sage leading-none mb-4">
              {p.englishName}
            </div>
            <p className="text-sm text-warm-grey leading-relaxed">
              {p.introNote}
            </p>
            <div className="mt-6 text-xs uppercase tracking-[0.2em] text-charcoal group-hover:text-sage transition-colors">
              Start →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
