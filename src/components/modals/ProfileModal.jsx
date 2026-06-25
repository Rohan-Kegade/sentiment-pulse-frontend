import { useState } from "react";
import { Camera, Check, Mail, Shield, User, X } from "lucide-react";

const COLOR_OPTIONS = [
  { key: "indigo", bg: "bg-indigo-600",  ring: "ring-indigo-400" },
  { key: "teal",   bg: "bg-teal-500",    ring: "ring-teal-400" },
  { key: "violet", bg: "bg-violet-600",  ring: "ring-violet-400" },
  { key: "rose",   bg: "bg-rose-500",    ring: "ring-rose-400" },
  { key: "amber",  bg: "bg-amber-500",   ring: "ring-amber-400" },
  { key: "slate",  bg: "bg-slate-600",   ring: "ring-slate-400" },
];

function userInitials(name = "") {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || "?";
}

export default function ProfileModal({ user, onSave, onClose }) {
  const [name, setName]               = useState(user?.name ?? "");
  const [email, setEmail]             = useState(user?.email ?? "");
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor ?? "indigo");
  const [nameError, setNameError]     = useState("");
  const [saved, setSaved]             = useState(false);

  const colorBg = COLOR_OPTIONS.find((c) => c.key === avatarColor)?.bg ?? "bg-indigo-600";

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) { setNameError("Name is required."); return; }
    setNameError("");
    onSave({ name: name.trim(), email: email.trim(), avatarColor });
    setSaved(true);
    setTimeout(onClose, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl sp-rise dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-1.5 dark:bg-indigo-950/40">
              <User size={14} className="text-indigo-600" />
            </div>
            <h3 className="sp-display font-semibold text-slate-900 dark:text-white">Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 py-6 space-y-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-4">
            <div className={`relative inline-flex h-20 w-20 items-center justify-center rounded-full ${colorBg} text-2xl font-bold text-white shadow-md`}>
              {userInitials(name || user?.name)}
              <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-slate-100 p-1 dark:border-slate-900 dark:bg-slate-800">
                <Camera size={10} className="text-slate-500" />
              </div>
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map(({ key, bg, ring }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAvatarColor(key)}
                  className={`h-6 w-6 rounded-full ${bg} transition-all hover:scale-110 ${
                    avatarColor === key ? `ring-2 ring-offset-2 ${ring}` : ""
                  }`}
                >
                  {avatarColor === key && <Check size={11} className="mx-auto text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Display name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(""); }}
                  placeholder="Your name"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition-all dark:text-slate-100 dark:placeholder-slate-500 ${
                    nameError
                      ? "border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-100 dark:border-rose-700 dark:bg-rose-950/20"
                      : "border-slate-200 bg-slate-50 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                  }`}
                />
              </div>
              {nameError && <p className="mt-1 text-xs text-rose-500">{nameError}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Email address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            {/* Role — read-only */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Role
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <Shield size={14} className="text-indigo-400" />
                <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                  {user?.role ?? "admin"}
                </span>
                <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  Workspace admin
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all ${
                saved
                  ? "bg-teal-500"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
              }`}
            >
              {saved ? <><Check size={14} /> Saved!</> : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
