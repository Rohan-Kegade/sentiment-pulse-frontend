import { Bell, Menu, Search } from "lucide-react";

export default function TopBar({ setMobileOpen, title }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
      <div className="flex items-center gap-3">
        <button className="sm:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} className="text-slate-600" /></button>
        <h1 className="sp-display text-base font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search feedback…" className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
        </div>
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
      </div>
    </div>
  );
}