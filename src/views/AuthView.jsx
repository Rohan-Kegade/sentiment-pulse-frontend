import { useState, useEffect } from "react";
import Logo from "../components/common/Logo";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

// ── inline brand icons ────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ── background styles ─────────────────────────────────────────────────────────

const PAGE_STYLE = {
  backgroundImage: [
    "linear-gradient(to right, rgba(0,0,0,.05) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(0,0,0,.05) 1px, transparent 1px)",
  ].join(","),
  backgroundSize: "48px 48px",
};

// ── local field helpers ───────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

function Input({ icon: Icon, error, rightSlot, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}
      <input
        {...props}
        className={`block w-full rounded-xl border py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
          Icon ? "pl-10" : "pl-4"
        } ${rightSlot ? "pr-11" : "pr-4"} ${
          error
            ? "border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            : "border-slate-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        }`}
      />
      {rightSlot}
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function AuthView({ mode, go, onAuth }) {
  const isRegister = mode === "register";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [errors, setErrors]   = useState({});

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (isRegister && !form.name.trim())
      next.name = "Your full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await onAuth({
        name: form.name || form.email.split("@")[0],
        email: form.email,
        password: form.password,
        isRegister,
      });
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed background — always covers viewport regardless of scroll */}
      <div className="fixed inset-0 bg-slate-50" style={PAGE_STYLE} />
      <div className="pointer-events-none fixed -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-200/40 blur-3xl" />

      {/* Scrollable layer */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">

      {/* Back link — top-left */}
      <button
        onClick={() => go("landing")}
        className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
      >
        <ArrowLeft size={14} /> Home
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[520px] sp-rise">
        {/* Logo — above the card, centered */}
        <div className="mb-6 flex justify-center">
          <button onClick={() => go("landing")}>
            <Logo />
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="sp-display text-2xl font-bold text-slate-900">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {isRegister
                ? "14-day free trial — no credit card required."
                : "Sign in to your SentimentPulse workspace."}
            </p>
          </div>

          {/* Social sign-in */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <GithubIcon /> GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} noValidate className="space-y-4">
            {isRegister && (
              <Field label="Full name" error={errors.name}>
                <Input
                  icon={User}
                  error={errors.name}
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Avery Chen"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="Email" error={errors.email}>
              <Input
                icon={Mail}
                type="email"
                error={errors.email}
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>

            <Field
              label={
                <span className="flex items-center justify-between">
                  <span>Password</span>
                  {!isRegister && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </span>
              }
              error={errors.password}
            >
              <Input
                icon={Lock}
                type={showPw ? "text" : "password"}
                error={errors.password}
                value={form.password}
                onChange={update("password")}
                placeholder="••••••••"
                autoComplete={isRegister ? "new-password" : "current-password"}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </Field>

            {isRegister && (
              <p className="text-xs text-slate-400">
                By creating an account you agree to our{" "}
                <a href="#" className="underline decoration-slate-300 hover:text-slate-600">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline decoration-slate-300 hover:text-slate-600">
                  Privacy Policy
                </a>
                .
              </p>
            )}

            {errors.submit && (
              <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
                {errors.submit}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> {isRegister ? "Creating…" : "Signing in…"}</>
                : <>{isRegister ? "Create account" : "Sign in"} <ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Switch */}
          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => go(isRegister ? "login" : "register")}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {isRegister ? "Sign in" : "Start free trial"}
            </button>
          </p>
        </div>

        {/* Footer trust line */}
        <p className="mt-5 text-center text-xs text-slate-500">
          Trusted by{" "}
          <span className="font-semibold text-slate-600">2,400+</span> product teams worldwide
        </p>
      </div>

      </div>{/* end scrollable layer */}
    </div>
  );
}
