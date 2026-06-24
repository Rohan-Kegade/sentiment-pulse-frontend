import { LogOut, ShieldCheck } from "lucide-react";

export default function SessionBanner({ user, workspace, onLogout }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-indigo-100 bg-indigo-50 px-6 py-2.5 text-sm">
      <span className="flex items-center gap-2 text-indigo-800">
        <ShieldCheck size={15} /> Signed in as{" "}
        <strong className="font-semibold">{user.email}</strong> · Workspace:{" "}
        <strong className="font-semibold">{workspace.name}</strong>
      </span>
      <button
        onClick={onLogout}
        className="inline-flex items-center gap-1.5 font-semibold text-indigo-700 hover:text-indigo-900"
      >
        <LogOut size={14} /> Log out
      </button>
    </div>
  );
}
