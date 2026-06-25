import { useState } from "react";
import { Check, CreditCard, Download, Zap, X } from "lucide-react";
import { PLANS, getPlan, limitLabel } from "../../data/plans";

const MOCK_INVOICES = [
  { id: "INV-0026", date: "Jun 1, 2026",  plan: "Pro",  amount: "$79.00", status: "Paid" },
  { id: "INV-0025", date: "May 1, 2026",  plan: "Pro",  amount: "$79.00", status: "Paid" },
  { id: "INV-0024", date: "Apr 1, 2026",  plan: "Pro",  amount: "$79.00", status: "Paid" },
  { id: "INV-0023", date: "Mar 1, 2026",  plan: "Free", amount: "$0.00",  status: "Free"  },
];

function UsageStat({ label, used, cap }) {
  const unlimited = cap === null;
  const pct = !unlimited && used != null ? Math.min((used / cap) * 100, 100) : null;
  const barColor =
    pct === null   ? "bg-indigo-500"
    : pct >= 100   ? "bg-rose-500"
    : pct >= 80    ? "bg-amber-500"
    : "bg-indigo-500";

  return (
    <div className="rounded-xl border border-white/60 bg-white/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/40">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {used != null ? used.toLocaleString() : "—"}
        </span>
        {!unlimited && cap != null && (
          <span className="text-xs text-slate-400 dark:text-slate-500">/ {cap.toLocaleString()}</span>
        )}
        {unlimited && (
          <span className="text-xs text-slate-400 dark:text-slate-500">/ ∞</span>
        )}
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: pct != null ? `${pct}%` : unlimited ? "0%" : "100%" }}
        />
      </div>
      {pct != null && (
        <p className={`mt-1 text-[10px] font-medium ${pct >= 100 ? "text-rose-500" : pct >= 80 ? "text-amber-500" : "text-slate-400"}`}>
          {pct >= 100 ? "Limit reached" : `${Math.round(pct)}% used`}
        </p>
      )}
    </div>
  );
}

export default function BillingModal({ user, userPlan, workspaces, surveys = [], members = [], go, onClose }) {
  const [billing, setBilling] = useState("monthly");
  const currentPlan = getPlan(userPlan);
  const currentIdx  = PLANS.findIndex((p) => p.id === userPlan);

  const totalResponses = surveys.reduce((sum, s) => sum + (s.submissions ?? 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl sp-rise dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-indigo-50 p-1.5 dark:bg-indigo-950/40">
                <CreditCard size={14} className="text-indigo-600" />
              </div>
              <h3 className="sp-display font-semibold text-slate-900 dark:text-white">Billing &amp; Plan</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-6 px-6 py-6">
            {/* Current plan summary */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 dark:border-indigo-800/40 dark:from-indigo-950/30 dark:to-violet-950/20">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400">Current plan</p>
                  <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{currentPlan.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentPlan.blurb}</p>
                </div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {currentPlan.name.toUpperCase()}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-indigo-100/60 pt-4 dark:border-indigo-800/30">
                <UsageStat
                  label="Workspaces"
                  used={workspaces.length}
                  cap={currentPlan.limits.workspaces}
                />
                <UsageStat
                  label="Surveys"
                  used={surveys.length}
                  cap={currentPlan.limits.surveys}
                />
                <UsageStat
                  label="Responses"
                  used={totalResponses}
                  cap={currentPlan.limits.responses}
                />
                <UsageStat
                  label="Team members"
                  used={members.length}
                  cap={currentPlan.limits.members}
                />
              </div>
            </div>

            {/* Plan comparison */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">All plans</h4>
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs dark:border-slate-700 dark:bg-slate-800">
                  {["monthly", "annual"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBilling(b)}
                      className={`rounded-md px-3 py-1 font-medium capitalize transition-colors ${
                        billing === b
                          ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      {b}
                      {b === "annual" && (
                        <span className="ml-1 font-bold text-teal-600 dark:text-teal-400">−20%</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {PLANS.map((plan, idx) => {
                  const isCurrent = plan.id === userPlan;
                  const price     = billing === "annual" ? plan.annual : plan.monthly;
                  const isUpgrade = idx > currentIdx;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl border p-4 transition-all ${
                        isCurrent
                          ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30"
                          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60"
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-2.5 left-4 rounded-full bg-teal-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          CURRENT
                        </span>
                      )}
                      {plan.highlight && !isCurrent && (
                        <span className="absolute -top-2.5 left-4 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          POPULAR
                        </span>
                      )}

                      <p className="sp-display font-semibold text-slate-900 dark:text-white">{plan.name}</p>
                      <div className="mt-1.5 flex items-baseline gap-0.5">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">${price}</span>
                        <span className="text-xs text-slate-400">/mo</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{plan.blurb}</p>

                      <ul className="mt-3 space-y-1.5">
                        {plan.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                            <Check size={11} className="mt-0.5 shrink-0 text-teal-500" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4">
                        {isCurrent ? (
                          <div className="rounded-lg bg-indigo-100 py-2 text-center text-xs font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                            Current plan
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              go("checkout", { selectedPlan: plan.id });
                            }}
                            className={`w-full rounded-lg py-2 text-xs font-semibold text-white transition-colors ${
                              plan.id === "enterprise"
                                ? "bg-violet-600 hover:bg-violet-700"
                                : isUpgrade
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-slate-500 hover:bg-slate-600"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              {isUpgrade && <Zap size={11} />}
                              {isUpgrade ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing history */}
            <div>
              <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-200">Billing history</h4>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                      {["Invoice", "Date", "Plan", "Amount", "Status"].map((h, i) => (
                        <th
                          key={h}
                          className={`px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400 ${i > 2 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {MOCK_INVOICES.map((inv) => (
                      <tr key={inv.id} className="bg-white dark:bg-slate-900">
                        <td className="sp-mono px-4 py-2.5 text-slate-600 dark:text-slate-300">{inv.id}</td>
                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{inv.date}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{inv.plan}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-200">{inv.amount}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`rounded-full px-2 py-0.5 font-semibold ${
                            inv.status === "Paid"
                              ? "bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button className="rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                            <Download size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
