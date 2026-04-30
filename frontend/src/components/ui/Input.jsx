export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name;

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}
