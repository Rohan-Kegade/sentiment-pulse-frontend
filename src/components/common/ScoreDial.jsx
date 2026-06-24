export default function ScoreDial({ score }) {
  // Visual color-gradient indicator: hue derived from score 0-100
  const hue = Math.round((score / 100) * 152); // 0 = red-ish, 152 ≈ teal
  const color = `hsl(${hue}, 72%, 42%)`;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 shrink-0">
        <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${(score / 100) * 97.4} 97.4`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="sp-mono text-[11px] font-medium text-slate-700">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
