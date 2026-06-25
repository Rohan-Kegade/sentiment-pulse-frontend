import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { getPlan, atLimit, limitLabel } from "../data/plans";
import { useLanguage } from "../context/LanguageContext";
import {
  AlignLeft,
  ArrowLeft,
  BarChart2,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Download,
  GripVertical,
  Link2,
  Loader2,
  Lock,
  Menu,
  Plus,
  QrCode,
  Rocket,
  Save,
  Sparkles,
  Star,
  ToggleLeft,
  Trash2,
  Type,
  X,
  Zap,
} from "lucide-react";

// ── question type registry ────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { type: "short_text", labelKey: "shortAnswer",   descKey: "singleLine",    icon: Type,        iconBg: "bg-teal-50",   iconColor: "text-teal-600",   badge: "bg-teal-50 text-teal-700" },
  { type: "text",       labelKey: "longText",       descKey: "paragraph",     icon: AlignLeft,   iconBg: "bg-teal-50",   iconColor: "text-teal-600",   badge: "bg-teal-50 text-teal-700" },
  { type: "choice",     labelKey: "multipleChoice", descKey: "singleSelect",  icon: Circle,      iconBg: "bg-violet-50", iconColor: "text-violet-600", badge: "bg-violet-50 text-violet-700" },
  { type: "checkbox",   labelKey: "checkboxes",     descKey: "multiSelect",   icon: CheckSquare, iconBg: "bg-violet-50", iconColor: "text-violet-600", badge: "bg-violet-50 text-violet-700" },
  { type: "rating",     labelKey: "starRating",     descKey: "oneToFive",     icon: Star,        iconBg: "bg-amber-50",  iconColor: "text-amber-500",  badge: "bg-amber-50 text-amber-700" },
  { type: "nps",        labelKey: "npsScore",       descKey: "zeroToTen",     icon: BarChart2,   iconBg: "bg-indigo-50", iconColor: "text-indigo-600", badge: "bg-indigo-50 text-indigo-700" },
  { type: "yesno",      labelKey: "yesNo",          descKey: "binaryChoice",  icon: ToggleLeft,  iconBg: "bg-rose-50",   iconColor: "text-rose-500",   badge: "bg-rose-50 text-rose-700" },
];

const TYPE_MAP = Object.fromEntries(QUESTION_TYPES.map((qt) => [qt.type, qt]));

// ── AI templates ──────────────────────────────────────────────────────────────

const AI_TEMPLATES = [
  {
    keywords: ["car", "vehicle", "auto", "drive", "tesla", "bmw", "toyota", "honda", "automotive"],
    questions: [
      { type: "rating",   label: "How would you rate your overall driving experience?" },
      { type: "choice",   label: "What aspect of the car impressed you most?",           options: ["Performance & speed", "Comfort & ride quality", "Fuel efficiency", "Interior design", "Safety features"] },
      { type: "nps",      label: "How likely are you to recommend this car to a friend or family member?" },
      { type: "rating",   label: "How satisfied are you with the technology and infotainment system?" },
      { type: "choice",   label: "How would you rate the build quality?",                options: ["Excellent", "Very good", "Good", "Fair", "Poor"] },
      { type: "yesno",    label: "Would you purchase this car again?" },
      { type: "text",     label: "What improvements would you suggest for this vehicle?" },
    ],
  },
  {
    keywords: ["restaurant", "food", "dining", "meal", "cafe", "coffee", "cuisine", "menu"],
    questions: [
      { type: "rating",   label: "How would you rate your overall dining experience?" },
      { type: "rating",   label: "How satisfied were you with the quality of the food?" },
      { type: "choice",   label: "How would you rate the service?",                      options: ["Excellent", "Good", "Average", "Below average", "Poor"] },
      { type: "nps",      label: "How likely are you to recommend this restaurant?" },
      { type: "yesno",    label: "Did your order arrive correctly and on time?" },
      { type: "yesno",    label: "Would you visit this restaurant again?" },
      { type: "text",     label: "What could we improve to make your next visit better?" },
    ],
  },
  {
    keywords: ["hotel", "stay", "room", "accommodation", "resort", "check-in", "booking"],
    questions: [
      { type: "rating",   label: "How would you rate your overall stay?" },
      { type: "rating",   label: "How satisfied were you with the cleanliness of your room?" },
      { type: "choice",   label: "How was the check-in experience?",                     options: ["Very smooth", "Smooth", "Average", "Slow", "Very slow"] },
      { type: "rating",   label: "How would you rate the hotel staff and service?" },
      { type: "checkbox", label: "Which amenities did you use during your stay?",         options: ["Pool", "Gym", "Spa", "Restaurant", "Room service", "Business centre"] },
      { type: "nps",      label: "How likely are you to recommend this hotel?" },
      { type: "yesno",    label: "Would you stay here again?" },
      { type: "text",     label: "What would have made your stay more enjoyable?" },
    ],
  },
  {
    keywords: ["product", "purchase", "buy", "order", "item", "unboxing", "delivery", "shopping"],
    questions: [
      { type: "rating",   label: "How would you rate the overall product quality?" },
      { type: "choice",   label: "Did the product match the description?",               options: ["Exactly as described", "Mostly accurate", "Somewhat different", "Very different"] },
      { type: "rating",   label: "How satisfied are you with packaging and delivery?" },
      { type: "choice",   label: "Would you say the product offers good value for money?", options: ["Excellent value", "Good value", "Fair value", "Poor value"] },
      { type: "nps",      label: "How likely are you to recommend this product to others?" },
      { type: "yesno",    label: "Would you purchase this product again?" },
      { type: "checkbox", label: "What influenced your purchase decision?",              options: ["Price", "Reviews", "Brand reputation", "Features", "Friend recommendation"] },
      { type: "text",     label: "What improvements would you suggest for this product?" },
    ],
  },
  {
    keywords: ["employee", "workplace", "hr", "team", "manager", "staff", "company", "culture", "work"],
    questions: [
      { type: "rating",   label: "How satisfied are you with your overall work experience?" },
      { type: "nps",      label: "How likely are you to recommend this company as a great place to work?" },
      { type: "choice",   label: "How would you describe the company culture?",          options: ["Excellent — collaborative & supportive", "Good — mostly positive", "Neutral", "Needs improvement"] },
      { type: "rating",   label: "How satisfied are you with your work-life balance?" },
      { type: "yesno",    label: "Do you feel your contributions are recognised by your manager?" },
      { type: "choice",   label: "What is your biggest challenge at work?",              options: ["Workload", "Communication", "Career growth", "Tools & resources", "Management"] },
      { type: "text",     label: "What changes would most improve your day-to-day experience?" },
    ],
  },
  {
    keywords: ["app", "software", "website", "platform", "tool", "ui", "ux", "digital", "saas"],
    questions: [
      { type: "rating",   label: "How easy was it to use this product?" },
      { type: "nps",      label: "How likely are you to recommend this to a colleague?" },
      { type: "choice",   label: "How often do you use this product?",                  options: ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely"] },
      { type: "checkbox", label: "Which features do you use most?",                     options: ["Dashboard", "Reports", "Integrations", "Notifications", "Exports", "Team collaboration"] },
      { type: "rating",   label: "How satisfied are you with the overall performance and speed?" },
      { type: "yesno",    label: "Have you encountered any bugs or issues recently?" },
      { type: "text",     label: "What feature would you most like to see added?" },
    ],
  },
  {
    keywords: ["event", "conference", "workshop", "seminar", "webinar", "training", "session"],
    questions: [
      { type: "rating",   label: "How would you rate the event overall?" },
      { type: "rating",   label: "How relevant was the content to your needs?" },
      { type: "choice",   label: "How would you rate the quality of the speakers/presenters?", options: ["Excellent", "Good", "Average", "Below average"] },
      { type: "nps",      label: "How likely are you to attend a future event by this organisation?" },
      { type: "checkbox", label: "Which session was most valuable to you?",             options: ["Keynote", "Breakout sessions", "Workshops", "Networking", "Panel discussion"] },
      { type: "yesno",    label: "Did the event meet your expectations?" },
      { type: "text",     label: "What topics would you like covered at future events?" },
    ],
  },
  {
    keywords: ["customer", "service", "support", "help", "issue", "complaint", "feedback", "ticket"],
    questions: [
      { type: "rating",   label: "How satisfied were you with the support you received?" },
      { type: "choice",   label: "Was your issue resolved?",                            options: ["Fully resolved", "Partially resolved", "Not resolved", "Still in progress"] },
      { type: "rating",   label: "How would you rate the response time?" },
      { type: "nps",      label: "How likely are you to recommend our support to others?" },
      { type: "choice",   label: "How did you contact us?",                             options: ["Email", "Live chat", "Phone", "Help centre", "Social media"] },
      { type: "yesno",    label: "Was the support agent knowledgeable and helpful?" },
      { type: "text",     label: "How could we improve our support experience?" },
    ],
  },
];

const GENERIC_QUESTIONS = [
  { type: "rating",     label: "How would you rate your overall experience?" },
  { type: "nps",        label: "How likely are you to recommend us to a friend or colleague?" },
  { type: "choice",     label: "How satisfied are you with our service?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
  { type: "yesno",      label: "Did we meet your expectations?" },
  { type: "text",       label: "What could we do better?" },
  { type: "short_text", label: "Any additional comments or feedback?" },
];

function getAISuggestions(input) {
  const lower = input.toLowerCase();
  for (const tpl of AI_TEMPLATES) {
    if (tpl.keywords.some((k) => lower.includes(k))) {
      return tpl.questions.map((q, i) => ({ ...q, id: "ai_" + i, options: q.options ?? [] }));
    }
  }
  return GENERIC_QUESTIONS.map((q, i) => ({ ...q, id: "ai_" + i, options: q.options ?? [] }));
}

// ── answer preview ────────────────────────────────────────────────────────────

function AnswerPreview({ q, onAddOption, onRemoveOption, onUpdateOption }) {
  const { t } = useLanguage();
  switch (q.type) {
    case "short_text":
      return <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800"><p className="text-sm text-slate-400">{t("shortAnswer")} — {t("singleLine").toLowerCase()}</p></div>;
    case "text":
      return <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-800"><p className="text-sm text-slate-400">{t("longText")} — {t("paragraph").toLowerCase()}</p></div>;
    case "choice":
    case "checkbox":
      return (
        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              {q.type === "choice"
                ? <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
                : <div className="h-4 w-4 shrink-0 rounded border-2 border-slate-300" />}
              <input value={opt} onChange={(e) => onUpdateOption(q.id, i, e.target.value)} onClick={(e) => e.stopPropagation()} placeholder={`Option ${i + 1}`} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder-slate-300 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-600" />
              {q.options.length > 2 && <button onClick={(e) => { e.stopPropagation(); onRemoveOption(q.id, i); }} className="shrink-0 text-slate-300 hover:text-rose-400"><X size={14} /></button>}
            </div>
          ))}
          <button onClick={(e) => { e.stopPropagation(); onAddOption(q.id); }} className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-indigo-500 hover:bg-indigo-50 transition-colors">
            <Plus size={13} /> {t("addOption")}
          </button>
        </div>
      );
    case "rating":
      return (
        <div className="mt-4">
          <div className="flex items-center gap-1.5">{[1,2,3,4,5].map((n) => <Star key={n} size={26} className={n <= 3 ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"} />)}<span className="ml-2 text-xs text-slate-400">Preview</span></div>
          <p className="mt-2 text-xs text-slate-400">{t("oneToFive")}</p>
        </div>
      );
    case "nps":
      return (
        <div className="mt-4">
          <div className="flex gap-1">{Array.from({ length: 11 }, (_, i) => i).map((n) => <div key={n} className={`flex flex-1 items-center justify-center rounded-lg py-2 text-[11px] font-bold ${n <= 6 ? "bg-rose-50 text-rose-400" : n <= 8 ? "bg-amber-50 text-amber-500" : "bg-teal-50 text-teal-600"}`}>{n}</div>)}</div>
          <div className="mt-1.5 flex justify-between text-[11px] text-slate-400"><span>{t("notAtAllLikely")}</span><span>{t("extremelyLikely")}</span></div>
        </div>
      );
    case "yesno":
      return (
        <div className="mt-4 flex gap-3">
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-teal-200 bg-teal-50 py-3 text-sm font-semibold text-teal-700">{t("yes")}</div>
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-rose-200 bg-rose-50 py-3 text-sm font-semibold text-rose-600">{t("no")}</div>
        </div>
      );
    default:
      return null;
  }
}

// ── question card ─────────────────────────────────────────────────────────────

function QuestionCard({ q, idx, total, isSelected, onSelect, onMoveUp, onMoveDown, onUpdate, onRemove, onAddOption, onRemoveOption, onUpdateOption }) {
  const { t } = useLanguage();
  const meta = TYPE_MAP[q.type] ?? TYPE_MAP.text;

  return (
    <div onClick={onSelect} className={`group relative cursor-pointer rounded-2xl border bg-white transition-all dark:bg-slate-900 ${isSelected ? "border-indigo-300 shadow-md shadow-indigo-100/50 dark:border-indigo-600" : "border-slate-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-slate-600"}`}>
      <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-indigo-500 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`} />

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <GripVertical size={14} className="shrink-0 cursor-grab text-slate-300" />
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">{idx + 1}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.badge}`}>{t(meta.labelKey)}</span>
          </div>
          <div className={`flex items-center gap-0.5 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={idx === 0} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25 transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-300" title="Move up"><ChevronUp size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={idx === total - 1} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25 transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-300" title="Move down"><ChevronDown size={14} /></button>
            <div className="mx-1 h-3.5 w-px bg-slate-200" />
            <button onClick={(e) => { e.stopPropagation(); onRemove(q.id); }} disabled={total === 1} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-25 transition-colors" title="Delete"><Trash2 size={14} /></button>
          </div>
        </div>

        <input value={q.label} onChange={(e) => { e.stopPropagation(); onUpdate(q.id, { label: e.target.value }); }} onClick={(e) => e.stopPropagation()} placeholder={t("typeQuestionHere")} className="mt-4 w-full bg-transparent text-[15px] font-medium text-slate-800 placeholder-slate-300 outline-none border-b border-transparent focus:border-indigo-200 pb-1 transition-colors dark:text-slate-100 dark:placeholder-slate-600" />

        <AnswerPreview q={q} onAddOption={onAddOption} onRemoveOption={onRemoveOption} onUpdateOption={onUpdateOption} />

        {/* Inline settings — shown only when selected */}
        {isSelected && (
          <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
            <label onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate(q.id, { required: !q.required }); }}
                className={`relative h-4 w-7 rounded-full transition-colors ${q.required ? "bg-indigo-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${q.required ? "translate-x-3.5" : "translate-x-0.5"}`} />
              </button>
              <span className="text-xs text-slate-500 select-none">{t("required")}</span>
            </label>
            <input
              value={q.helpText ?? ""}
              onChange={(e) => { e.stopPropagation(); onUpdate(q.id, { helpText: e.target.value }); }}
              onClick={(e) => e.stopPropagation()}
              placeholder={t("helpTextPlaceholder")}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 placeholder-slate-300 outline-none focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder-slate-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── left panel: question types ────────────────────────────────────────────────

function LeftPanel({ onAdd }) {
  const { t } = useLanguage();
  return (
    <div className="hidden lg:flex w-48 shrink-0 flex-col border-r border-slate-200 bg-white overflow-y-auto dark:border-slate-700 dark:bg-slate-900">
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t("questionTypes")}</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-4">
        {QUESTION_TYPES.map((qt) => (
          <button
            key={qt.type}
            onClick={() => onAdd(qt.type)}
            className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
          >
            <div className={`rounded-lg p-1.5 ${qt.iconBg}`}>
              <qt.icon size={13} className={qt.iconColor} />
            </div>
            <p className="text-[10px] font-semibold leading-tight text-slate-600 group-hover:text-indigo-600 transition-colors">
              {t(qt.labelKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── right panel: AI generator ─────────────────────────────────────────────────

function AiPanel({ onAddQuestion }) {
  const { t } = useLanguage();
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [used, setUsed]               = useState(new Set());

  const generate = () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setSuggestions([]);
    setUsed(new Set());
    setTimeout(() => {
      setSuggestions(getAISuggestions(input));
      setLoading(false);
    }, 1400);
  };

  const addSuggestion = (q) => {
    onAddQuestion(q);
    setUsed((u) => new Set([...u, q.id]));
  };

  return (
    <div className="hidden xl:flex w-[26rem] shrink-0 flex-col border-l border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/40">
            <Sparkles size={15} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("aiGenerator")}</p>
            <p className="text-[11px] text-slate-400">{t("aiGeneratorDesc")}</p>
          </div>
        </div>
      </div>

      {/* Prompt area */}
      <div className="shrink-0 border-b border-slate-100 p-4 dark:border-slate-800">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
          placeholder={t("aiPlaceholder")}
          rows={5}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-900"
        />
        <button
          onClick={generate}
          disabled={!input.trim() || loading}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> {t("generating")}</>
            : <><Sparkles size={14} /> {t("generateQuestions")}</>}
        </button>
        <p className="mt-1.5 text-center text-[10px] text-slate-400">
          {t("ctrlEnter")}
        </p>
      </div>

      {/* Suggestions list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <Loader2 size={22} className="animate-spin text-indigo-400" />
            <p className="text-sm text-slate-500">{t("craftingQuestions")}</p>
            <p className="text-xs text-slate-400">{t("analysingTopic")}</p>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {t("suggestedQuestions", { n: suggestions.length })}
              </p>
              <button
                onClick={() => {
                  suggestions.forEach((s) => {
                    if (!used.has(s.id)) addSuggestion(s);
                  });
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {t("addAll")}
              </button>
            </div>

            {suggestions.map((s) => {
              const meta   = TYPE_MAP[s.type] ?? TYPE_MAP.text;
              const isUsed = used.has(s.id);
              return (
                <div key={s.id} className={`rounded-xl border p-3.5 transition-all ${isUsed ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"}`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${meta.iconBg}`}>
                      <meta.icon size={12} className={meta.iconColor} />
                    </div>
                    <p className="flex-1 text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">{s.label}</p>
                  </div>
                  <button
                    onClick={() => addSuggestion(s)}
                    disabled={isUsed}
                    className={`mt-2.5 w-full rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      isUsed
                        ? "cursor-default bg-teal-100 text-teal-600"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    {isUsed ? t("addedToSurvey") : t("addToSurvey")}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="mb-4 rounded-2xl bg-indigo-50 p-5">
              <Sparkles size={28} className="text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">{t("readyToGenerate")}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              {t("readyToGenerateDesc")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── main view ─────────────────────────────────────────────────────────────────

export default function BuilderView({
  go,
  user,
  onLogout,
  onUpdateUser,
  workspaces,
  activeWorkspace,
  onSwitchWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  userPlan,
  surveys,
  onDeploy,
  onUpdateSurvey,
  editingSurvey,
  mobileOpen,
  setMobileOpen,
  members,
  onInviteMember,
  onUpdateMember,
  onRemoveMember,
  onDeleteAccount,
}) {
  const { t } = useLanguage();
  const isEditing = !!editingSurvey;

  const [title, setTitle]           = useState(editingSurvey?.title ?? "");
  const [description, setDesc]      = useState(editingSurvey?.description ?? "");
  const [questions, setQuestions]   = useState(() => {
    if (editingSurvey?.questions) return editingSurvey.questions;
    const id = crypto.randomUUID();
    return [{ id, type: "short_text", label: "", options: [] }];
  });
  const [deployed, setDeployed]     = useState(null);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [selectedId, setSelectedId] = useState(() =>
    editingSurvey?.questions?.[0]?.id ?? questions[0]?.id ?? null,
  );

  const planObj       = getPlan(userPlan);
  const surveyLimit   = planObj.limits.surveys;
  const wsSurveyCount = surveys.filter(
    (s) => s.workspaceId === activeWorkspace.id && s.id !== editingSurvey?.id,
  ).length;
  const surveyAtLimit = atLimit(wsSurveyCount, surveyLimit);

  // ── question helpers ──────────────────────────────────────────────────────

  const addQuestion = (typeOrObj) => {
    const isObj  = typeof typeOrObj === "object";
    const newId  = crypto.randomUUID();
    const newQ   = isObj
      ? { ...typeOrObj, id: newId }
      : { id: newId, type: typeOrObj, label: "", options: typeOrObj === "choice" || typeOrObj === "checkbox" ? ["", ""] : [] };
    setQuestions((qs) => [...qs, newQ]);
    setSelectedId(newQ.id);
  };

  const updateQuestion = (id, patch) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const removeQuestion = (id) =>
    setQuestions((qs) => {
      const next = qs.filter((q) => q.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });

  const moveQuestion = (idx, dir) =>
    setQuestions((qs) => {
      const next = [...qs];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return qs;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });

  const addOption = (qid) =>
    setQuestions((qs) =>
      qs.map((q) => (q.id === qid ? { ...q, options: [...q.options, ""] } : q)),
    );

  const removeOption = (qid, i) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid ? { ...q, options: q.options.filter((_, j) => j !== i) } : q,
      ),
    );

  const updateOption = (qid, i, value) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o, j) => (j === i ? value : o)) }
          : q,
      ),
    );

  // ── save (draft or publish) ───────────────────────────────────────────────

  const [saving, setSaving] = useState(false);

  const save = async (asDraft = false) => {
    if (saving) return;
    setSaving(true);
    const survey = {
      workspaceId: isEditing ? editingSurvey.workspaceId : activeWorkspace.id,
      title:       title.trim() || t("untitledSurvey"),
      description,
      status:      asDraft ? "draft" : "live",
      questions,
      ...(isEditing ? {
        id:          editingSurvey.id,
        submissions: editingSurvey.submissions,
        endpoint:    editingSurvey.endpoint,
        createdAt:   editingSurvey.createdAt,
      } : {}),
    };
    try {
      let saved;
      if (isEditing) {
        await onUpdateSurvey(survey.id, survey);
        saved = survey;
      } else {
        saved = await onDeploy(survey);
      }
      setSavedAsDraft(asDraft);
      setDeployed(saved || survey);
    } catch (err) {
      console.error("Save failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  const qCount = questions.length;
  const qLabel = qCount === 1 ? t("question", { n: qCount }) : t("questions", { n: qCount });

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        active="builder"
        go={go}
        user={user}
        onLogout={onLogout}
        onUpdateUser={onUpdateUser}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSwitchWorkspace={onSwitchWorkspace}
        onCreateWorkspace={onCreateWorkspace}
        onDeleteWorkspace={onDeleteWorkspace}
        userPlan={userPlan}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        members={members}
        surveys={surveys}
        onInviteMember={onInviteMember}
        onUpdateMember={onUpdateMember}
        onRemoveMember={onRemoveMember}
        onDeleteAccount={onDeleteAccount}
      />

      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">

        {/* ── Builder header ────────────────────────────────────────────── */}
        <div className="shrink-0 flex h-14 items-center gap-2 border-b border-slate-200 bg-white px-4 sm:px-5 dark:border-slate-700 dark:bg-slate-900">
          <button className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 sm:hidden dark:hover:bg-slate-800" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>

          <button onClick={() => go("dashboard")} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="hidden items-center gap-1.5 sm:flex">
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={() => go("dashboard")} className="sp-display max-w-[120px] truncate text-sm text-slate-400 transition-colors hover:text-indigo-600">{activeWorkspace.name}</button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="sp-display text-sm font-medium text-slate-700 dark:text-slate-200">
              {isEditing ? t("editSurveyTitle") : t("newSurveyTitle")}
            </span>
          </div>

          <div className="flex-1" />

          {!isEditing && (
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> {t("draftBadge")}
            </span>
          )}
          <span className="hidden text-xs text-slate-400 sm:block">{qLabel}</span>
          <div className="h-4 w-px bg-slate-200" />

          <button onClick={() => go("dashboard")} className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            {t("cancelBtn")}
          </button>
          {!isEditing && !surveyAtLimit && (
            <button onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50">
              <Save size={13} /> {t("saveDraft")}
            </button>
          )}
          <button onClick={() => save(false)} disabled={surveyAtLimit || saving} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
            {surveyAtLimit
              ? <><Lock size={13} /> {t("upgrade")}</>
              : saving
              ? <><Loader2 size={13} className="animate-spin" /> {t("saving") || "Saving…"}</>
              : isEditing
              ? <><CheckCircle2 size={13} /> {t("saveChanges")}</>
              : <><Rocket size={13} /> {t("publish")}</>}
          </button>
        </div>

        {/* ── Three-panel body ──────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Left: Question types */}
          <LeftPanel onAdd={addQuestion} />

          {/* Middle: Survey form */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-xl space-y-4 px-4 py-8 sm:px-6">

              {surveyAtLimit && (
                <div className="flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800"><Lock size={14} /> {t("surveyLimitReached")}</p>
                    <p className="mt-0.5 text-xs text-amber-700"><strong>{planObj.name}</strong> plan — max {limitLabel(surveyLimit)} survey{surveyLimit !== 1 ? "s" : ""} per workspace.</p>
                  </div>
                  <button onClick={() => go("checkout", { selectedPlan: "pro" })} className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                    <Zap size={11} /> {t("upgrade")}
                  </button>
                </div>
              )}

              {/* Survey identity */}
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 dark:border-slate-700 dark:bg-slate-900">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("untitledSurvey")} className="sp-display w-full bg-transparent text-2xl font-bold text-slate-900 placeholder-slate-300 outline-none dark:text-white dark:placeholder-slate-600" />
                <textarea value={description} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder={t("addDescPlaceholder")} className="mt-3 w-full resize-none bg-transparent text-sm text-slate-500 placeholder-slate-300 outline-none dark:text-slate-400 dark:placeholder-slate-600" />
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    idx={idx}
                    total={questions.length}
                    isSelected={selectedId === q.id}
                    onSelect={() => setSelectedId(q.id)}
                    onMoveUp={() => moveQuestion(idx, -1)}
                    onMoveDown={() => moveQuestion(idx, 1)}
                    onUpdate={updateQuestion}
                    onRemove={removeQuestion}
                    onAddOption={addOption}
                    onRemoveOption={removeOption}
                    onUpdateOption={updateOption}
                  />
                ))}
              </div>

              {/* Mobile-only type picker */}
              <div className="lg:hidden rounded-2xl border border-dashed border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t("addAQuestion")}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {QUESTION_TYPES.map((qt) => (
                    <button key={qt.type} onClick={() => addQuestion(qt.type)} className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 px-2 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50">
                      <div className={`rounded-lg p-1.5 ${qt.iconBg}`}><qt.icon size={13} className={qt.iconColor} /></div>
                      <p className="text-[10px] font-semibold leading-tight text-slate-600 group-hover:text-indigo-600">{t(qt.labelKey)}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: AI generator */}
          <AiPanel onAddQuestion={addQuestion} />

        </div>
      </div>

      {/* ── Save / Publish success modal ──────────────────────────────────── */}
      {deployed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6" onClick={() => setDeployed(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center sp-rise dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <div className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${savedAsDraft ? "bg-amber-50" : "bg-teal-50"}`}>
              {savedAsDraft
                ? <Save size={22} className="text-amber-500" />
                : <CheckCircle2 size={24} className="text-teal-500" />}
            </div>
            <h3 className="sp-display text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? t("changesSaved") : savedAsDraft ? t("draftSaved") : t("surveyIsLive")}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? t("changesSavedDesc", { title: deployed.title })
                : savedAsDraft
                ? t("draftSavedDesc", { title: deployed.title })
                : t("surveyIsLiveDesc", { title: deployed.title })}
            </p>

            {!isEditing && !savedAsDraft && (
              <>
                <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <QrCode size={68} className="text-slate-600 dark:text-slate-400" strokeWidth={1.2} />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 dark:bg-slate-800">
                  <span className="sp-mono truncate text-sm text-slate-600 dark:text-slate-300">{deployed.endpoint}</span>
                  <button className="ml-2 shrink-0 text-slate-400 transition-colors hover:text-indigo-600"><Link2 size={15} /></button>
                </div>
              </>
            )}

            <div className="mt-5 flex gap-2.5">
              {!isEditing && !savedAsDraft && (
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Download size={14} /> {t("downloadQr")}
                </button>
              )}
              <button onClick={() => go("dashboard")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                {t("goToDashboard")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
