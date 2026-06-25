import { Gauge } from "lucide-react";

export default function Logo({ size = "md" }) {
  const dims = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${dims} rounded-lg sentiment-gradient flex items-center justify-center`}
      >
        <Gauge className="text-white" size={size === "sm" ? 14 : 18} />
      </div>

      <span className={`sp-display font-semibold ${text} text-slate-900 dark:text-white`}>
        SentimentPulse
      </span>
    </div>
  );
}
