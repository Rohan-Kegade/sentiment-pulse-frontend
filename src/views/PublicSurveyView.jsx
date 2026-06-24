import { ArrowLeft, Info, Mail, Send } from "lucide-react";
import { useState } from "react";
import TextField from "../components/common/TextField";
import FieldLabel from "../components/common/FieldLabel";
import PrimaryButton from "../components/common/PrimaryButton";

export default function PublicSurveyView({ go, survey }) {
  const s = survey || SEED_SURVEYS[0];
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [choice, setChoice] = useState("");
  const [stage, setStage] = useState("form"); // form | submitting | done

  const choiceQ = s.questions.find((q) => q.type === "choice");
  const textQ = s.questions.find((q) => q.type === "text");

  const submit = (e) => {
    e.preventDefault();
    setStage("submitting");
    setTimeout(() => setStage("done"), 1300);
  };

  return (
    <div className="sp-root flex min-h-screen flex-col bg-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-sm flex-1">
        <button
          onClick={() => go("dashboard")}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"
        >
          <ArrowLeft size={13} /> Exit preview
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sp-rise">
          {stage !== "done" ? (
            <>
              <div className="mb-1 h-1.5 w-10 rounded-full sentiment-gradient" />
              <h1 className="sp-display mt-3 text-lg font-semibold text-slate-900">
                {s.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{s.description}</p>

              <form onSubmit={submit} className="mt-6 space-y-5">
                <TextField
                  label="Email address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />

                {choiceQ ? (
                  <div>
                    <FieldLabel>{choiceQ.label}</FieldLabel>
                    <div className="space-y-2">
                      {choiceQ.options.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setChoice(opt)}
                          className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${choice === opt ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                        >
                          <span
                            className={`h-3.5 w-3.5 rounded-full border-2 ${choice === opt ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}
                          />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {textQ ? (
                  <div>
                    <FieldLabel>{textQ.label}</FieldLabel>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={5}
                      placeholder="Type your answer here…"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                ) : null}

                <PrimaryButton
                  type="submit"
                  className="w-full justify-center py-3"
                  disabled={stage === "submitting"}
                  icon={stage === "submitting" ? undefined : Send}
                >
                  {stage === "submitting" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Submitting…
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </PrimaryButton>
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <Info size={11} /> Your response is queued instantly for AI
                  sentiment scoring
                </p>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center py-10 text-center sp-rise">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="sp-display text-lg font-semibold text-slate-900">
                Thanks for the feedback
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your response was queued for processing.
              </p>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Powered by SentimentPulse
        </p>
      </div>
    </div>
  );
}
