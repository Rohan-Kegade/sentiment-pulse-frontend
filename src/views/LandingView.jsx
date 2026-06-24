import NavBar from "../components/layout/NavBar";
import FooterBar from "../components/layout/FooterBar";
import { PLANS } from "../data/plans";
import { useState } from "react";
import {
  Sparkles, ArrowRight, Zap, QrCode, Check, Users, Shield,
  Star, MessageSquare, TrendingUp, Globe, Activity,
} from "lucide-react";
import PrimaryButton from "../components/common/PrimaryButton";
import SecondaryButton from "../components/common/SecondaryButton";
import { SEED_FEEDBACK } from "../data/feedback";
import SentimentBadge from "../components/common/SentimentBadge";
import ScoreDial from "../components/common/ScoreDial";

const STATS = [
  { value: "2.4M+", label: "Responses analyzed", Icon: MessageSquare },
  { value: "<1 s",  label: "Avg. AI processing",  Icon: Zap },
  { value: "500+",  label: "Product teams",        Icon: Users },
  { value: "99.9%", label: "Uptime SLA",            Icon: Shield },
];

const FEATURES = [
  {
    Icon: Sparkles,
    title: "AI Sentiment Extraction",
    body: "Every open-ended response is scored 0–100 and tagged with category meta-tags in under a second — no prompt engineering required.",
    badge: "Powered by GPT-4o",
  },
  {
    Icon: Zap,
    title: "High-Throughput Queuing",
    body: "Async ingestion pipeline absorbs traffic spikes from QR scans without dropping a single response, even at thousands per minute.",
    badge: "Zero-drop guarantee",
  },
  {
    Icon: QrCode,
    title: "Instant QR Assets",
    body: "Deploy a survey and receive a printable, scannable QR code immediately — ready for signage, receipts, or email footers.",
    badge: "Ready in seconds",
  },
  {
    Icon: TrendingUp,
    title: "Real-Time Analytics",
    body: "Live dashboard aggregates sentiment trends as responses land. Spot a critical-alert spike before your support queue fills up.",
    badge: "Sub-second refresh",
  },
  {
    Icon: Users,
    title: "Multi-Tenant Workspaces",
    body: "One account, unlimited brands. Each workspace has its own surveys, team roles, and fully isolated response data.",
    badge: "Enterprise-ready",
  },
  {
    Icon: Globe,
    title: "CSV & API Export",
    body: "Pull raw responses and scored data into your data warehouse or BI tool. Webhook support for real-time routing to Slack or Jira.",
    badge: "Integrates anywhere",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Build your survey",
    body: "Add open-text and multiple-choice questions in our visual builder. No code, no config — done in minutes.",
  },
  {
    step: "02",
    title: "Deploy anywhere",
    body: "Share via a unique link or print the auto-generated QR code. Responses stream the moment the first scan lands.",
  },
  {
    step: "03",
    title: "Act on AI insights",
    body: "Every response is scored, tagged, and surfaced in the live feed. Critical alerts are flagged instantly so your team can act fast.",
  },
];

const TESTIMONIALS = [
  {
    quote: "SentimentPulse cut our churn detection time from days to minutes. The AI tagging is eerily accurate — we cancelled two manual review tools on day one.",
    name: "Priya Nair",
    role: "Head of Customer Experience",
    company: "Beacon Health",
    initials: "PN",
    accent: "bg-indigo-100 text-indigo-700",
  },
  {
    quote: "We deployed 12 surveys across three markets in an afternoon. The QR workflow alone saved us a full week of co-ordination with the design team.",
    name: "Marcus Webb",
    role: "VP Product",
    company: "Fenix Commerce",
    initials: "MW",
    accent: "bg-teal-100 text-teal-700",
  },
  {
    quote: "The real-time feed is addictive. Our support team sees the sentiment score before they pick up the ticket — it completely changed how we triage.",
    name: "Tomás Reyes",
    role: "Support Operations Lead",
    company: "Stackline",
    initials: "TR",
    accent: "bg-amber-100 text-amber-700",
  },
];

const TRUST_NAMES = ["Stripe", "Vercel", "Linear", "Retool", "Loom"];

const GRID_BG = {
  backgroundImage:
    "linear-gradient(to right,#e2e8f0 1px,transparent 1px),linear-gradient(to bottom,#e2e8f0 1px,transparent 1px)",
  backgroundSize: "48px 48px",
};

const GRADIENT_TEXT = {
  background: "linear-gradient(90deg,#ef4565 0%,#f5a524 50%,#14b8a6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export default function LandingView({ go }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="sp-root min-h-screen bg-white">
      <NavBar go={go} transparent />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-indigo-50/70 via-white to-white px-6 pt-16 pb-28 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={GRID_BG} />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="sp-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles size={12} /> Now with GPT-4o sentiment scoring
            </span>

            <h1 className="sp-display mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[52px]">
              Know exactly how every customer feels —{" "}
              <span style={GRADIENT_TEXT}>before it's a churn ticket.</span>
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
              SentimentPulse turns raw survey replies into AI-tagged sentiment,
              routed to the right team, in real time — across every workspace
              you run.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton
                onClick={() => go("register")}
                icon={ArrowRight}
                className="px-6 py-3 text-base"
              >
                Start Free Trial
              </PrimaryButton>
              <SecondaryButton onClick={() => go("login")} className="py-3 text-base">
                Sign in
              </SecondaryButton>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-400">
              {["No credit card required", "100 free responses / month", "SOC 2 in progress"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check size={12} className="text-teal-500" /> {t}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Preview card */}
          <div className="relative sp-rise" style={{ animationDelay: "120ms" }}>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="sp-display text-sm font-semibold text-slate-800">
                  Live sentiment feed
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-teal-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 sp-pulse" /> streaming
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
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating stat badge */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
              <p className="text-xs text-slate-400">Avg. Sentiment Score</p>
              <p className="sp-display text-2xl font-semibold text-teal-600">82</p>
            </div>

            {/* Floating alert badge */}
            <div className="absolute -right-4 -top-4 hidden rounded-xl border border-rose-100 bg-white px-3 py-2 shadow-lg sm:block">
              <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 sp-pulse" /> Critical alert
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">Routed to CX · 2m ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-b border-slate-100 px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="whitespace-nowrap text-xs font-medium text-slate-400">
            Trusted by 500+ product teams, including teams at
          </p>
          <div className="flex flex-wrap items-center gap-8">
            {TRUST_NAMES.map((name) => (
              <span
                key={name}
                className="sp-display text-sm font-semibold text-slate-300 transition-colors hover:text-slate-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 py-8 text-center"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600 shadow-sm">
                <Icon size={19} />
              </div>
              <p className="sp-display text-3xl font-semibold text-slate-900">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              The full stack
            </span>
            <h2 className="sp-display mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Built for the full feedback lifecycle
            </h2>
            <p className="mt-3 text-slate-600">
              Everything your team needs to collect, understand, and act on customer
              sentiment — tightly integrated.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, body, badge }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon size={20} />
                  </div>
                  <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
                    {badge}
                  </span>
                </div>
                <h3 className="sp-display mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              How it works
            </span>
            <h2 className="sp-display mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              From survey to insight in three steps
            </h2>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, body }, i) => (
              <div key={step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-16 top-5 hidden h-px w-[calc(100%-52px)] border-t border-dashed border-slate-200 sm:block" />
                )}
                <div className="sp-mono mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
                  {step}
                </div>
                <h3 className="sp-display font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-3 flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="sp-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              Teams who ship with SentimentPulse
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, company, initials, accent }) => (
              <div
                key={name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-slate-700">"{quote}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${accent}`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-400">
                      {role} · {company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-t border-slate-100 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              Pricing
            </span>
            <h2 className="sp-display mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
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
                className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                  p.highlight
                    ? "border-indigo-300 shadow-lg shadow-indigo-100"
                    : "border-slate-200"
                }`}
              >
                {p.highlight ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                ) : null}
                <div className="flex-1">
                  <h3 className="sp-display text-lg font-semibold text-slate-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{p.blurb}</p>
                  <p className="sp-display mt-5 text-3xl font-semibold text-slate-900">
                    ${annual ? p.annual : p.monthly}
                    <span className="text-base font-normal text-slate-400">/mo</span>
                  </p>
                  {annual && p.monthly > 0 ? (
                    <p className="text-xs text-teal-600">
                      Billed as ${p.annual * 12}/yr
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm font-medium text-indigo-600">{p.responses}</p>
                  <ul className="mt-5 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={15} className="mt-0.5 shrink-0 text-teal-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <PrimaryButton
                  onClick={() =>
                    go(p.id === "free" ? "register" : "checkout", { selectedPlan: p.id })
                  }
                  className={`mt-6 w-full justify-center ${
                    p.highlight ? "" : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {p.id === "free" ? "Start Free" : "Choose " + p.name}
                </PrimaryButton>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="overflow-hidden border-t border-slate-100">
        <div className="relative bg-indigo-600 px-6 py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="sp-display text-3xl font-semibold text-white sm:text-4xl">
              Ready to turn feedback into action?
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Join 500+ product teams already running on SentimentPulse.
              Free plan, no card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => go("register")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Start Free Trial <ArrowRight size={17} />
              </button>
              <button
                onClick={() => go("login")}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-400 px-7 py-3.5 text-base font-semibold text-indigo-100 transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterBar />
    </div>
  );
}
