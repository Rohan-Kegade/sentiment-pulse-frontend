import { AlertTriangle, Meh, Smile } from "lucide-react";

export default function SentimentBadge({ sentiment }) {
  const map = {
    positive: {
      label: "Positive",
      cls: "bg-teal-50 text-teal-700 border-teal-200",
      Icon: Smile,
    },
    neutral: {
      label: "Neutral",
      cls: "bg-slate-100 text-slate-600 border-slate-200",
      Icon: Meh,
    },
    critical: {
      label: "Critical Alert",
      cls: "bg-rose-50 text-rose-700 border-rose-200",
      Icon: AlertTriangle,
    },
  };
  const { label, cls, Icon } = map[sentiment];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  );
}
