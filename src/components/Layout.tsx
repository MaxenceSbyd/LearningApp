import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const onHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur bg-ivory/80 border-b border-taupe">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="font-script text-3xl text-charcoal leading-none hover:text-sage transition-colors"
          >
            Learning
          </Link>
          {!onHome && (
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.2em] text-warm-grey hover:text-sage transition-colors"
            >
              ← Home
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-taupe py-6 text-center text-xs uppercase tracking-[0.2em] text-warm-grey">
        Built by <span className="font-script text-base normal-case tracking-normal text-sage">Maxence</span> · 2026
      </footer>
    </div>
  );
}
