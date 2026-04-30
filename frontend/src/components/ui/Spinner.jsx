export default function Spinner({ label = 'Cargando', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
      <span>{label}</span>
    </span>
  );
}
