export default function KpiCard({ label, value, sub, Icon, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="sp-display mt-2 text-2xl font-semibold text-slate-900">
            {value}
          </p>
          {sub ? <p className="mt-1 text-xs text-teal-600">{sub}</p> : null}
        </div>
        <div
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}
