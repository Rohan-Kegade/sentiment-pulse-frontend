import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import QrModal from "../components/modals/QrModal";
import SentimentBadge from "../components/common/SentimentBadge";
import { getPlan, atLimit, limitLabel } from "../data/plans";
import { useLanguage } from "../context/LanguageContext";
import {
  AlignLeft,
  ArrowRight,
  BarChart2,
  CheckSquare,
  Circle,
  ClipboardList,
  Database,
  Eye,
  Inbox,
  Lock,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  QrCode,
  Search,
  Star,
  Tag,
  ToggleLeft,
  Trash2,
  Type,
  X,
  Zap,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────

function sentimentStats(feedbackItems) {
  const total    = feedbackItems.length;
  const positive = feedbackItems.filter((f) => f.sentiment === "positive").length;
  const neutral  = feedbackItems.filter((f) => f.sentiment === "neutral").length;
  const critical = feedbackItems.filter((f) => f.sentiment === "negative" || f.sentiment === "critical").length;
  const avgScore = total ? Math.round(feedbackItems.reduce((a, f) => a + f.score, 0) / total) : null;
  const positivePct = total ? Math.round((positive / total) * 100) : 0;
  const neutralPct  = total ? Math.round((neutral  / total) * 100) : 0;
  const criticalPct = total ? 100 - positivePct - neutralPct : 0;
  return { total, positive, neutral, critical, avgScore, positivePct, neutralPct, criticalPct };
}

function ScoreValue({ score }) {
  if (score === null) return <span className="text-2xl font-bold text-slate-300">—</span>;
  const cls = score >= 70 ? "text-teal-600" : score >= 45 ? "text-amber-600" : "text-rose-600";
  return <span className={`text-2xl font-bold ${cls}`}>{score}<span className="text-sm font-normal text-slate-400"> / 100</span></span>;
}

// ── status pill ───────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const { t } = useLanguage();
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 sp-pulse" /> {t("live")}
      </span>
    );
  if (status === "paused")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        <Pause size={9} className="fill-amber-500 text-amber-500" /> {t("paused")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
      {t("draft")}
    </span>
  );
}

// ── survey preview modal ──────────────────────────────────────────────────────

const TYPE_ICON = {
  short_text: Type,
  text:       AlignLeft,
  choice:     Circle,
  checkbox:   CheckSquare,
  rating:     Star,
  nps:        BarChart2,
  yesno:      ToggleLeft,
};

function PreviewQuestion({ q, answer, onChange }) {
  const { t } = useLanguage();
  switch (q.type) {
    case "short_text":
      return (
        <input
          value={answer ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("yourAnswer")}
          className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      );
    case "text":
      return (
        <textarea
          value={answer ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={t("yourAnswer")}
          className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      );
    case "choice":
      return (
        <div className="mt-3 space-y-2">
          {(q.options ?? []).map((opt, i) => (
            <label key={i} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50 has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50">
              <input type="radio" name={q.id} value={opt} checked={answer === opt} onChange={() => onChange(opt)} className="accent-indigo-600" />
              <span className="text-sm text-slate-700">{opt || `Option ${i + 1}`}</span>
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="mt-3 space-y-2">
          {(q.options ?? []).map((opt, i) => {
            const checked = (answer ?? []).includes(opt);
            return (
              <label key={i} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50 has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const cur = answer ?? [];
                    onChange(checked ? cur.filter((v) => v !== opt) : [...cur, opt]);
                  }}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-slate-700">{opt || `Option ${i + 1}`}</span>
              </label>
            );
          })}
        </div>
      );
    case "rating": {
      const max = q.maxRating ?? 5;
      const val = answer ?? 0;
      return (
        <div className="mt-3 flex items-center gap-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => onChange(n)} className="transition-transform hover:scale-110">
              <Star size={28} className={n <= val ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"} />
            </button>
          ))}
          {val > 0 && <span className="ml-1 text-sm text-slate-400">{val} / {max}</span>}
        </div>
      );
    }
    case "nps": {
      const val = answer ?? null;
      return (
        <div className="mt-3">
          <div className="flex gap-1">
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`flex flex-1 items-center justify-center rounded-lg py-2.5 text-xs font-bold transition-all ${
                  val === n
                    ? "bg-indigo-600 text-white shadow-sm"
                    : n <= 6
                    ? "bg-rose-50 text-rose-400 hover:bg-rose-100"
                    : n <= 8
                    ? "bg-amber-50 text-amber-500 hover:bg-amber-100"
                    : "bg-teal-50 text-teal-600 hover:bg-teal-100"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
            <span>{q.lowLabel || t("notAtAllLikely")}</span>
            <span>{q.highLabel || t("extremelyLikely")}</span>
          </div>
        </div>
      );
    }
    case "yesno": {
      return (
        <div className="mt-3 flex gap-3">
          {[t("yes"), t("no")].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex flex-1 items-center justify-center rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                answer === opt
                  ? opt === t("yes")
                    ? "border-teal-400 bg-teal-500 text-white shadow-sm"
                    : "border-rose-400 bg-rose-500 text-white shadow-sm"
                  : opt === t("yes")
                  ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                  : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

function SurveyPreviewModal({ survey, onClose }) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!survey) return null;

  const setAnswer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — slides in from right */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-100 p-1.5">
              <Eye size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{t("surveyPreview")}</p>
              <p className="text-[11px] text-slate-400">{t("responsesNotRecorded")}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Preview notice banner */}
        <div className="shrink-0 bg-indigo-600 px-6 py-2.5 text-center text-xs font-semibold text-white/90">
          {t("previewModeBanner")}
        </div>

        {/* Survey content */}
        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="rounded-full bg-teal-50 p-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t("thankYou")}</h3>
            <p className="text-sm text-slate-500">{t("responseSubmitted")}</p>
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="mt-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              {t("resetPreview")}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-md px-6 py-8">
              {/* Survey identity */}
              <h1 className="sp-display text-2xl font-bold text-slate-900">{survey.title || t("untitledSurvey")}</h1>
              {survey.description && <p className="mt-2 text-sm text-slate-500">{survey.description}</p>}

              {/* Questions */}
              <div className="mt-8 space-y-7">
                {(survey.questions ?? []).map((q, idx) => {
                  const Icon = TYPE_ICON[q.type] ?? Type;
                  return (
                    <div key={q.id}>
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 leading-snug">
                            {q.label || t("untitledQuestion")}
                            {q.required && <span className="ml-1 text-rose-500">*</span>}
                          </p>
                          {q.helpText && <p className="mt-0.5 text-xs text-slate-400">{q.helpText}</p>}
                          <PreviewQuestion
                            q={q}
                            answer={answers[q.id]}
                            onChange={(val) => setAnswer(q.id, val)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit */}
              <button
                onClick={() => setSubmitted(true)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
              >
                {t("submitResponse")}
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                {t("previewOnlyNote")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function DashboardView({
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
  feedback,
  onDeleteSurvey,
  onEditSurveyInBuilder,
  onUpdateSurvey,
  mobileOpen,
  setMobileOpen,
  members,
  onInviteMember,
  onUpdateMember,
  onRemoveMember,
}) {
  const { t } = useLanguage();
  const [selectedSurveyId, setSelectedSurveyId]       = useState(null);
  const [surveyMenuId, setSurveyMenuId]               = useState(null);
  const [pendingDeleteId, setPendingDeleteId]         = useState(null);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [qrSurvey, setQrSurvey]                       = useState(null);
  const [previewSurvey, setPreviewSurvey]             = useState(null);
  const [searchQuery, setSearchQuery]                 = useState("");

  useEffect(() => {
    setSelectedSurveyId(null);
    setPendingDeleteId(null);
    setSurveyMenuId(null);
    setConfirmDeleteSelected(false);
    setSearchQuery("");
  }, [activeWorkspace.id]);

  const planObj       = getPlan(userPlan);
  const surveyLimit   = planObj.limits.surveys;
  const wsSurveys     = surveys.filter((s) => s.workspaceId === activeWorkspace.id);
  const surveyAtLimit = atLimit(wsSurveys.length, surveyLimit);
  const selectedSurvey = wsSurveys.find((s) => s.id === selectedSurveyId) ?? null;

  const filteredSurveys = searchQuery.trim()
    ? wsSurveys.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : wsSurveys;

  const surveyFeedback = feedback.filter((f) => f.surveyId === selectedSurveyId);
  const stats = sentimentStats(surveyFeedback);

  const togglePause = (s) => {
    const nextStatus = s.status === "paused" ? "live" : "paused";
    onUpdateSurvey(s.id, { status: nextStatus });
  };

  const sidebarProps = {
    active: "dashboard", go, user, onLogout, onUpdateUser, workspaces, activeWorkspace,
    onSwitchWorkspace, onCreateWorkspace, onDeleteWorkspace,
    userPlan, mobileOpen, setMobileOpen,
    members, surveys, onInviteMember, onUpdateMember, onRemoveMember,
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar {...sidebarProps} />

      <div className="flex-1 min-w-0">
        <TopBar
          setMobileOpen={setMobileOpen}
          title={selectedSurvey ? selectedSurvey.title : activeWorkspace.name}
          breadcrumb={selectedSurvey ? activeWorkspace.name : undefined}
          onBreadcrumbClick={selectedSurvey ? () => { setSelectedSurveyId(null); setConfirmDeleteSelected(false); } : undefined}
          searchQuery={selectedSurvey ? undefined : searchQuery}
          onSearchChange={selectedSurvey ? undefined : setSearchQuery}
        />

        <div className="p-5">
          {selectedSurvey ? (
            /* ═══════════════════════════════════════════════════════════
               SURVEY DETAIL VIEW
            ═══════════════════════════════════════════════════════════ */
            <div className="space-y-5">
              <button
                onClick={() => { setSelectedSurveyId(null); setConfirmDeleteSelected(false); }}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
              >
                {t("backToSurveys")}
              </button>

              {/* Survey header card */}
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="sp-display text-xl font-bold text-slate-900 dark:text-white">{selectedSurvey.title}</h1>
                      <StatusPill status={selectedSurvey.status} />
                    </div>
                    {selectedSurvey.description && (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedSurvey.description}</p>
                    )}
                    <p className="sp-mono mt-1.5 text-xs text-slate-400">
                      {selectedSurvey.endpoint}
                      <span className="mx-2 text-slate-200">·</span>
                      {t("created")} {selectedSurvey.createdAt}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {/* Preview */}
                    <button
                      onClick={() => setPreviewSurvey(selectedSurvey)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Eye size={13} /> {t("preview")}
                    </button>

                    {/* Pause / Resume */}
                    <button
                      onClick={() => togglePause(selectedSurvey)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                        selectedSurvey.status === "paused"
                          ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                          : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {selectedSurvey.status === "paused"
                        ? <><Play size={13} className="fill-teal-600 text-teal-600" /> {t("resume")}</>
                        : <><Pause size={13} /> {t("pause")}</>}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditSurveyInBuilder(selectedSurvey)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Pencil size={13} /> {t("edit")}
                    </button>

                    {/* QR Code */}
                    <button
                      onClick={() => setQrSurvey(selectedSurvey)}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      title={t("viewQrCode")}
                    >
                      <QrCode size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmDeleteSelected(true)}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-rose-800 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                      title={t("deleteSurvey")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Paused notice */}
                {selectedSurvey.status === "paused" && !confirmDeleteSelected && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                    <Pause size={14} className="shrink-0" />
                    <span>
                      {t("surveyPausedNotice")
                        .replace("{paused}", `**${t("paused").toLowerCase()}**`)
                        .replace("{resume}", `**${t("resume")}**`)}
                    </span>
                  </div>
                )}

                {/* Delete confirmation */}
                {confirmDeleteSelected && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800/50 dark:bg-rose-950/20">
                    <div>
                      <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">{t("deleteSurveyQ")}</p>
                      <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">{t("deleteSurveyWarning", { title: selectedSurvey.title })}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => setConfirmDeleteSelected(false)}
                        className="rounded-lg border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={() => {
                          onDeleteSurvey(selectedSurvey.id);
                          setSelectedSurveyId(null);
                          setConfirmDeleteSelected(false);
                        }}
                        className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t("totalResponses")}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{selectedSurvey.submissions.toLocaleString()}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{t("acrossAllTime")}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t("avgSentimentScore")}</p>
                  <div className="mt-2"><ScoreValue score={stats.avgScore} /></div>
                  <p className="mt-0.5 text-xs text-slate-400">{t("fromAnalysed", { n: stats.total })}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t("positiveSentiment")}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.total ? `${stats.positivePct}%` : "—"}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{t("ofResponses", { n: stats.positive, total: stats.total })}</p>
                </div>
              </div>

              {/* Sentiment breakdown */}
              {stats.total > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("sentimentBreakdown")}</p>
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    {stats.positivePct > 0 && <div style={{ width: `${stats.positivePct}%` }} className="bg-teal-500 transition-all" />}
                    {stats.neutralPct  > 0 && <div style={{ width: `${stats.neutralPct}%`  }} className="bg-amber-400 transition-all" />}
                    {stats.criticalPct > 0 && <div style={{ width: `${stats.criticalPct}%` }} className="bg-rose-500 transition-all" />}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-5 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />{stats.positivePct}% Positive ({stats.positive})</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />{stats.neutralPct}% Neutral ({stats.neutral})</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />{stats.criticalPct}% Critical ({stats.critical})</span>
                  </div>
                </div>
              )}

              {/* Real-time feed */}
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <h2 className="sp-display text-sm font-semibold text-slate-900 dark:text-white">{t("realTimeAiFeed")}</h2>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-teal-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 sp-pulse" /> {t("liveLabel")}
                  </span>
                </div>
                {surveyFeedback.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Inbox size={24} className="mb-2 text-slate-300" />
                    <p className="text-sm text-slate-400">{t("noResponsesYet")}</p>
                  </div>
                ) : (
                  <div className="sp-scrollbar max-h-[520px] space-y-3 overflow-y-auto p-4">
                    {surveyFeedback.map((f) => (
                      <div key={f.id} className="rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-sm dark:border-slate-800">
                        <div className="flex items-center justify-between gap-3">
                          <SentimentBadge sentiment={f.sentiment} />
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-700">{f.score}<span className="font-normal text-slate-400"> / 100</span></span>
                            <span className="text-xs text-slate-400">{f.receivedAt}</span>
                          </div>
                        </div>
                        <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300">{f.text}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {f.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          ) : (
            /* ═══════════════════════════════════════════════════════════
               WORKSPACE OVERVIEW — survey cards
            ═══════════════════════════════════════════════════════════ */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="sp-display text-base font-semibold text-slate-900 dark:text-white">{t("surveys")}</h2>
                </div>
                {wsSurveys.length > 0 && (
                  <span className="text-xs text-slate-400">{wsSurveys.length}{surveyLimit !== null && ` / ${limitLabel(surveyLimit)}`}</span>
                )}
              </div>

              {filteredSurveys.length === 0 && searchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center">
                  <Search size={24} className="mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">{t("noSurveysMatch", { query: searchQuery })}</p>
                  <button onClick={() => setSearchQuery("")} className="mt-2 text-xs text-indigo-600 hover:underline">{t("clearSearch")}</button>
                </div>
              ) : wsSurveys.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                    <ClipboardList size={30} />
                  </div>
                  <h2 className="sp-display text-xl font-semibold text-slate-900 dark:text-white">{t("noSurveysYet")}</h2>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    {t("noSurveysDesc", { workspace: activeWorkspace.name })}
                  </p>
                  <button onClick={() => go("builder")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    <Plus size={16} /> {t("createFirstSurvey")}
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSurveys.map((s) => {
                    const sfb           = feedback.filter((f) => f.surveyId === s.id);
                    const menuOpen      = surveyMenuId === s.id;
                    const confirmDelete = pendingDeleteId === s.id;

                    if (confirmDelete) {
                      return (
                        <div key={s.id} className="flex flex-col rounded-2xl border border-rose-200 bg-rose-50 p-5">
                          <p className="text-sm font-semibold text-rose-800">{t("deleteSurveyQ")}</p>
                          <p className="mt-0.5 truncate text-xs text-rose-600">{t("deleteSurveyWarning", { title: s.title })}</p>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => { onDeleteSurvey(s.id); setPendingDeleteId(null); }} className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-700">{t("delete")}</button>
                            <button onClick={() => setPendingDeleteId(null)} className="flex-1 rounded-xl border border-rose-200 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100">{t("cancel")}</button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSurveyId(s.id)}
                        className="group relative flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-700"
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <StatusPill status={s.status} />

                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSurveyMenuId(menuOpen ? null : s.id)}
                              className={`rounded-lg p-1.5 text-slate-400 transition-opacity hover:text-slate-600 ${menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            >
                              <MoreHorizontal size={15} />
                            </button>

                            {menuOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setSurveyMenuId(null)} />
                                <div className="absolute right-0 top-8 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                                  <button
                                    onClick={() => { setSurveyMenuId(null); setPreviewSurvey(s); }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                  >
                                    <Eye size={13} /> {t("previewSurvey")}
                                  </button>
                                  <button
                                    onClick={() => { setSurveyMenuId(null); onEditSurveyInBuilder(s); }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                  >
                                    <Pencil size={13} /> {t("editInBuilder")}
                                  </button>
                                  <button
                                    onClick={() => { setSurveyMenuId(null); setQrSurvey(s); }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                  >
                                    <QrCode size={13} /> {t("qrCode")}
                                  </button>
                                  <div className="border-t border-slate-100 dark:border-slate-700" />
                                  <button
                                    onClick={() => { setSurveyMenuId(null); togglePause(s); }}
                                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-slate-50 ${s.status === "paused" ? "text-teal-700" : "text-amber-700"}`}
                                  >
                                    {s.status === "paused"
                                      ? <><Play size={13} className="fill-teal-600 text-teal-600" /> {t("resumeSurvey")}</>
                                      : <><Pause size={13} /> {t("pauseSurvey")}</>}
                                  </button>
                                  <div className="border-t border-slate-100 dark:border-slate-700" />
                                  <button
                                    onClick={() => { setSurveyMenuId(null); setPendingDeleteId(s.id); }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  >
                                    <Trash2 size={13} /> {t("deleteSurvey")}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <h3 className="mt-3 text-base font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-400">{s.title}</h3>
                        {s.description && <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{s.description}</p>}

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5"><Database size={13} className="text-slate-400" />{s.submissions.toLocaleString()} {t("responses")}</span>
                          {sfb.length > 0 && <span className="text-xs text-slate-400">{sfb.length} {t("analysed")}</span>}
                        </div>
                        <p className="sp-mono mt-2 truncate text-[11px] text-slate-400">{s.endpoint}</p>

                        <div className="mt-auto flex items-center justify-between pt-4">
                          <span className="text-xs text-slate-400">{t("created")} {s.createdAt}</span>
                          <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                            {t("open")} <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add survey card */}
                  {surveyAtLimit ? (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                      <Lock size={20} className="text-amber-500" />
                      <p className="mt-2 text-sm font-semibold text-amber-800">{t("surveyLimitReached")}</p>
                      <p className="mt-0.5 text-xs text-amber-600">{wsSurveys.length} / {limitLabel(surveyLimit)} on {planObj.name} plan</p>
                      <button onClick={() => go("checkout", { selectedPlan: "pro" })} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                        <Zap size={11} /> {t("upgradeArrow")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => go("builder")}
                      className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                    >
                      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Plus size={20} /></div>
                      <p className="mt-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400">{t("newSurvey")}</p>
                      <p className="text-xs text-slate-400">{t("openBuilder")}</p>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <QrModal survey={qrSurvey} onClose={() => setQrSurvey(null)} />
      <SurveyPreviewModal survey={previewSurvey} onClose={() => setPreviewSurvey(null)} />
    </div>
  );
}
