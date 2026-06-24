import { ClipboardList, LayoutDashboard, Settings } from "lucide-react";
import Logo from "../common/Logo";

export default function Sidebar({
  active,
  go,
  tenant,
  mobileOpen,
  setMobileOpen,
}) {
  const items = [
    { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { key: "builder", label: "Survey Builder", Icon: ClipboardList },
  ];
  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform sm:translate-x-0 sm:static ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="border-b border-slate-100 px-5 py-5">
          <Logo size="sm" />
        </div>
        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Workspace
          </p>
          <p className="sp-display mt-1 truncate font-semibold text-slate-800">
            {tenant.name}
          </p>
          <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
            {tenant.plan.toUpperCase()} PLAN
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => {
                go(key);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active === key ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-100 px-3 py-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Settings size={17} /> Settings
          </button>
        </div>
      </aside>
    </>
  );
}
