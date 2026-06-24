import NavBar from "../components/layout/NavBar";
import FooterBar from "../components/layout/FooterBar";
import { PLANS } from "../data/plans";
import { useState } from "react";
import { Sparkles, ArrowRight, Zap, QrCode, Check } from "lucide-react";
import PrimaryButton from "../components/common/PrimaryButton";
import SecondaryButton from "../components/common/SecondaryButton";
import { SEED_FEEDBACK } from "../data/feedback";
import SentimentBadge from "../components/common/SentimentBadge";
import ScoreDial from "../components/common/ScoreDial";

export default function LandingView({ go }) {
  const [annual, setAnnual] = useState(false);
  
  return (
    <div className="sp-root min-h-screen bg-white">
      <NavBar go={go} transparent />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-indigo-50/60 to-white px-6 pt-16 pb-24 sm:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="sp-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles size={12} /> AI sentiment scoring, live in seconds
            </span>
            <h1 className="sp-display mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
              Know what every customer feels — before it becomes a churn ticket.
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-600">
              SentimentPulse turns raw survey replies into AI-tagged sentiment,
              routed to the right team, in real time — across every workspace
              you run.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={() => go("register")} icon={ArrowRight}>
                Start Free Trial
              </PrimaryButton>
              <SecondaryButton onClick={() => go("login")}>
                Sign in
              </SecondaryButton>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              No credit card required · 100 free responses every month
            </p>
          </div>

          <div className="relative sp-rise" style={{ animationDelay: "120ms" }}>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="sp-display text-sm font-semibold text-slate-800">
                  Live sentiment feed
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-teal-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 sp-pulse" />{" "}
                  streaming
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {SEED_FEEDBACK.slice(0, 3).map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <SentimentBadge sentiment={f.sentiment} />
                      <ScoreDial score={f.score} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
              <p className="text-xs text-slate-400">Avg. Sentiment Score</p>
              <p className="sp-display text-2xl font-semibold text-teal-600">
                82
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="sp-display text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            Built for the full feedback lifecycle
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                Icon: Sparkles,
                title: "AI Sentiment Extraction",
                body: "Every open-ended response is scored and tagged with category meta-tags in under a second.",
              },
              {
                Icon: Zap,
                title: "High-Throughput Queuing",
                body: "Async ingestion pipeline absorbs traffic spikes from QR scans without dropping a response.",
              },
              {
                Icon: QrCode,
                title: "Instant QR Downloads",
                body: "Deploy a survey and get a printable, scannable asset immediately — no design tools needed.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={20} />
                </div>
                <h3 className="sp-display font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="sp-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-2 text-slate-600">
              Scale from first pilot to global rollout.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!annual ? "bg-indigo-600 text-white" : "text-slate-600"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${annual ? "bg-indigo-600 text-white" : "text-slate-600"}`}
              >
                Annual <span className="text-teal-500">· save 20%</span>
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-2xl border bg-white p-6 ${p.highlight ? "border-indigo-300 shadow-lg shadow-indigo-100" : "border-slate-200"}`}
              >
                {p.highlight ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                ) : null}
                <h3 className="sp-display text-lg font-semibold text-slate-900">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{p.blurb}</p>
                <p className="sp-display mt-5 text-3xl font-semibold text-slate-900">
                  ${annual ? p.annual : p.monthly}
                  <span className="text-base font-normal text-slate-400">
                    /mo
                  </span>
                </p>
                <p className="mt-1 text-sm font-medium text-indigo-600">
                  {p.responses}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-teal-500"
                      />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <PrimaryButton
                  onClick={() =>
                    go(p.id === "free" ? "register" : "checkout", {
                      selectedPlan: p.id,
                    })
                  }
                  className={`mt-6 w-full ${p.highlight ? "" : "bg-slate-900 hover:bg-slate-800"}`}
                >
                  {p.id === "free" ? "Start Free" : "Choose " + p.name}
                </PrimaryButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterBar />
    </div>
  );
}
