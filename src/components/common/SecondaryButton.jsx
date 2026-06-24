export default function SecondaryButton({
  children,
  onClick,
  className = "",
  icon: Icon,
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 ${className}`}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}
