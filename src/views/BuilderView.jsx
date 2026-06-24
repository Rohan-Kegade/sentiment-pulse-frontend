import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import TextField from "../components/common/TextField";
import FieldLabel from "../components/common/FieldLabel";
import PrimaryButton from "../components/common/PrimaryButton";
import SecondaryButton from "../components/common/SecondaryButton";
import { CheckCircle2, Download, Link2, ListChecks, QrCode, Rocket, Trash2, TypeIcon } from "lucide-react";

export default function BuilderView({
  go,
  tenant,
  onDeploy,
  mobileOpen,
  setMobileOpen,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { id: "q_" + Date.now(), type: "text", label: "", options: [] },
  ]);
  const [deployed, setDeployed] = useState(null);

  const addQuestion = (type) => {
    setQuestions((qs) => [
      ...qs,
      {
        id: "q_" + Date.now() + qs.length,
        type,
        label: "",
        options: type === "choice" ? ["Option 1", "Option 2"] : [],
      },
    ]);
  };
  const updateQuestion = (id, patch) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const removeQuestion = (id) =>
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  const updateOption = (qid, idx, value) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o, i) => (i === idx ? value : o)) }
          : q,
      ),
    );

  const deploy = () => {
    const slug = Math.random().toString(36).slice(2, 8);
    const survey = {
      id: "srv_" + Date.now(),
      title: title || "Untitled Survey",
      description,
      submissions: 0,
      endpoint: `pulse.sh/r/${slug}`,
      status: "live",
      createdAt: new Date().toISOString().slice(0, 10),
      questions,
    };
    setDeployed(survey);
    onDeploy(survey);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active="builder"
        go={go}
        tenant={tenant}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 sm:ml-64">
        <TopBar setMobileOpen={setMobileOpen} title="Survey Builder" />
        <div className="mx-auto max-w-3xl space-y-5 p-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <TextField
              label="Survey title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Post-Purchase Pulse"
            />
            <div className="mt-4">
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What is this survey trying to learn?"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sp-rise"
              >
                <div className="flex items-center justify-between">
                  <span className="sp-mono text-xs font-medium text-slate-400">
                    QUESTION {idx + 1} ·{" "}
                    {q.type === "text" ? "OPEN TEXT" : "MULTIPLE CHOICE"}
                  </span>
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <input
                  value={q.label}
                  onChange={(e) =>
                    updateQuestion(q.id, { label: e.target.value })
                  }
                  placeholder="Type your question…"
                  className="mt-2 w-full border-b border-transparent py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-indigo-300"
                />
                {q.type === "choice" ? (
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
                        <input
                          value={opt}
                          onChange={(e) =>
                            updateOption(q.id, i, e.target.value)
                          }
                          className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 h-16 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
                    Open response text area
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <SecondaryButton
              icon={TypeIcon}
              onClick={() => addQuestion("text")}
            >
              Add text question
            </SecondaryButton>
            <SecondaryButton
              icon={ListChecks}
              onClick={() => addQuestion("choice")}
            >
              Add multiple choice
            </SecondaryButton>
          </div>

          <PrimaryButton
            onClick={deploy}
            icon={Rocket}
            className="w-full justify-center py-3"
          >
            Deploy &amp; Generate Live Assets
          </PrimaryButton>
        </div>
      </div>

      {deployed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
          onClick={() => setDeployed(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center sp-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="sp-display font-semibold text-slate-900">
              Survey is live
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Share the link or print the QR code to start collecting responses.
            </p>
            <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
              <QrCode size={72} className="text-slate-700" strokeWidth={1.2} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="sp-mono truncate text-sm text-slate-700">
                {deployed.endpoint}
              </span>
              <button className="text-slate-400 hover:text-indigo-600">
                <Link2 size={15} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <SecondaryButton icon={Download} className="flex-1">
                Download QR
              </SecondaryButton>
              <PrimaryButton
                onClick={() => go("dashboard")}
                className="flex-1 justify-center"
              >
                Done
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
