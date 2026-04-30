import ThemeToggle from './ThemeToggle';

export default function Navbar({ title = 'CorpHR', right }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <span className="text-base font-semibold text-slate-900 dark:text-white">{title}</span>
      <div className="flex items-center gap-3">
        {right}
        <ThemeToggle />
      </div>
    </header>
  );
}
