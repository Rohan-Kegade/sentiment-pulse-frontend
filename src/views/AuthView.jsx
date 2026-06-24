import { useState } from "react";
import Logo from "../components/common/Logo";
import TextField from "../components/common/TextField";
import { ArrowLeft, Building2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import PrimaryButton from "../components/common/PrimaryButton";

export default function AuthView({ mode, go, onAuth }) {
  const isRegister = mode === "register";
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    org: "",
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (isRegister && !form.org.trim())
      next.org = "Organization name is required to provision your workspace.";
    if (isRegister && !form.name.trim()) next.name = "Your name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onAuth({
        name: form.name || "Avery Chen",
        email: form.email,
        tenantName: isRegister ? form.org : "Northwind Retail Co.",
      });
    }
  };

  return (
    <div className="sp-root flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md sp-rise">
        <button
          onClick={() => go("landing")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={15} /> Back to home
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Logo />
          <h1 className="sp-display mt-6 text-2xl font-semibold text-slate-900">
            {isRegister ? "Create your workspace" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isRegister
              ? "Provision a clean, multi-tenant workspace for your team."
              : "Sign in to your SentimentPulse workspace."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {isRegister && (
              <TextField
                label="Organization / Company name"
                icon={Building2}
                value={form.org}
                onChange={update("org")}
                placeholder="Northwind Retail Co."
                error={errors.org}
              />
            )}
            {isRegister && (
              <TextField
                label="Full name"
                icon={User}
                value={form.name}
                onChange={update("name")}
                placeholder="Avery Chen"
                error={errors.name}
              />
            )}
            <TextField
              label="Work email"
              icon={Mail}
              value={form.email}
              onChange={update("email")}
              placeholder="you@company.com"
              error={errors.email}
            />
            <TextField
              label="Password"
              icon={Lock}
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              error={errors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <PrimaryButton type="submit" className="w-full justify-center">
              {isRegister ? "Provision workspace" : "Sign in"}
            </PrimaryButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? "Already have a workspace?" : "Need a workspace?"}{" "}
            <button
              onClick={() => go(isRegister ? "login" : "register")}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
