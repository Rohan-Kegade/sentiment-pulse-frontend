import { useState } from "react";
import { PLANS } from "../data/plans";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CreditCard, Loader2, LockIcon, ShieldCheck, User } from "lucide-react";
import TextField from "../components/common/TextField";
import PrimaryButton from "../components/common/PrimaryButton";

export default function CheckoutView({ go, plan, onSubscribed }) {
  const planObj = PLANS.find((p) => p.id === plan) || PLANS[1];
  const [stage, setStage] = useState("form"); // form | processing | success
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!card.name.trim()) next.name = "Cardholder name is required.";
    if (!/^\d{13,19}$/.test(card.number.replace(/\s/g, "")))
      next.number = "Enter a valid card number.";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim()))
      next.expiry = "Use MM / YY format.";
    if (!/^\d{3,4}$/.test(card.cvv.trim()))
      next.cvv = "Enter a 3–4 digit CVV.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStage("processing");
    setTimeout(() => {
      setStage("success");
      onSubscribed(planObj.id);
    }, 1800);
  };

  return (
    <div className="sp-root flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="grid w-full max-w-3xl gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sp-rise sm:grid-cols-[1.1fr_1fr]">
        <div>
          <button
            onClick={() => go("landing")}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={15} /> Back
          </button>

          {stage !== "success" ? (
            <>
              <h1 className="sp-display text-xl font-semibold text-slate-900">
                Upgrade to {planObj.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Your workspace will unlock {planObj.responses.toLowerCase()}{" "}
                immediately after payment.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <TextField
                  label="Cardholder name"
                  icon={User}
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  placeholder="Avery Chen"
                  error={errors.name}
                />
                <TextField
                  label="Card number"
                  icon={CreditCard}
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  placeholder="4242 4242 4242 4242"
                  error={errors.number}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Expiry"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                    placeholder="MM / YY"
                    error={errors.expiry}
                  />
                  <TextField
                    label="CVV"
                    icon={LockIcon}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    placeholder="123"
                    error={errors.cvv}
                  />
                </div>
                <PrimaryButton
                  type="submit"
                  className="w-full justify-center"
                  disabled={stage === "processing"}
                >
                  {stage === "processing" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Processing
                      payment…
                    </span>
                  ) : (
                    `Pay $${planObj.monthly}/mo securely`
                  )}
                </PrimaryButton>
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck size={13} /> Encrypted &amp; PCI-simulated
                  checkout
                </p>
              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center sp-rise">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="sp-display text-xl font-semibold text-slate-900">
                Payment confirmed
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your workspace is now on the {planObj.name} plan.
              </p>
              <PrimaryButton
                onClick={() => go("dashboard")}
                className="mt-6"
                icon={ArrowRight}
              >
                Go to dashboard
              </PrimaryButton>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Order summary
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="sp-display font-semibold text-slate-900">
              {planObj.name} plan
            </span>
            <span className="sp-mono text-sm text-slate-700">
              ${planObj.monthly}.00
            </span>
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
            {planObj.features.slice(0, 4).map((f) => (
              <div
                key={f}
                className="flex items-start gap-2 text-xs text-slate-600"
              >
                <Check size={13} className="mt-0.5 text-teal-500" /> {f}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-900">
            <span>Due today</span>
            <span>${planObj.monthly}.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
