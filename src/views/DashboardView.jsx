import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import QrModal from "../components/modals/QrModal";
import { useState } from "react";
import KpiCard from "../components/common/KpiCard"
import { ClipboardList, Database, Plus, QrCode, Tag } from "lucide-react";
import ScoreDial from "../components/common/ScoreDial";
import SentimentBadge from "../components/common/SentimentBadge";
import SecondaryButton from "../components/common/SecondaryButton";

export default function DashboardView({
  go,
  tenant,
  surveys,
  feedback,
  setMobileOpen,
  mobileOpen,
}) {
  const [qrSurvey, setQrSurvey] = useState(null);
  const avgScore = feedback.length
    ? Math.round(feedback.reduce((a, f) => a + f.score, 0) / feedback.length)
    : 0;
  const totalResponses = surveys.reduce((a, s) => a + s.submissions, 0);
  const activeSurveys = surveys.filter((s) => s.status === "live").length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active="dashboard"
        go={go}
        tenant={tenant}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 sm:ml-64">
        <TopBar setMobileOpen={setMobileOpen} title="Dashboard" />
        <div className="space-y-6 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Total Responses"
              value={totalResponses.toLocaleString()}
              sub="+12.4% vs last 30 days"
              Icon={Database}
              accent="bg-indigo-50 text-indigo-600"
            />
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Avg. AI Sentiment Score
              </p>
              <div className="mt-2 flex items-center gap-3">
                <ScoreDial score={avgScore} />
                <span className="sp-display text-2xl font-semibold text-slate-900">
                  {avgScore}
                  <span className="text-sm font-normal text-slate-400">
                    /100
                  </span>
                </span>
              </div>
            </div>
            <KpiCard
              label="Active Surveys"
              value={activeSurveys}
              sub={`${surveys.length} total assets`}
              Icon={ClipboardList}
              accent="bg-teal-50 text-teal-600"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="sp-display font-semibold text-slate-900">
                  Real-Time AI Processing Feed
                </h2>
                <span className="flex items-center gap-1.5 text-xs font-medium text-teal-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 sp-pulse" />{" "}
                  live
                </span>
              </div>
              <div className="sp-scrollbar mt-4 max-h-[480px] space-y-3 overflow-y-auto pr-1">
                {feedback.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <SentimentBadge sentiment={f.sentiment} />
                      <span className="text-xs text-slate-400">
                        {f.receivedAt}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm text-slate-700">{f.text}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {f.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          <Tag size={10} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="sp-display font-semibold text-slate-900">
                Surveys Inventory
              </h2>
              <div className="mt-4 divide-y divide-slate-100">
                {surveys.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start justify-between gap-3 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {s.title}
                      </p>
                      <p className="sp-mono mt-0.5 truncate text-xs text-slate-400">
                        {s.endpoint}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${s.status === "live" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}
                        >
                          {s.status === "live" ? "Live" : "Draft"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {s.submissions.toLocaleString()} submissions
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setQrSurvey(s)}
                      className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <SecondaryButton
                onClick={() => go("builder")}
                icon={Plus}
                className="mt-4 w-full"
              >
                New Survey
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
      <QrModal survey={qrSurvey} onClose={() => setQrSurvey(null)} />
    </div>
  );
}
