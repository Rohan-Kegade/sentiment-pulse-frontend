import { Bell, ChevronRight, Menu, Search } from "lucide-react";

export default function TopBar({ setMobileOpen, title, breadcrumb, onBreadcrumbClick }) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 sm:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumb && (
            <>
              {onBreadcrumbClick ? (
                <button
                  onClick={onBreadcrumbClick}
                  className="max-w-[140px] truncate font-medium text-slate-400 transition-colors hover:text-indigo-600"
                >
                  {breadcrumb}
                </button>
              ) : (
                <span className="max-w-[140px] truncate font-medium text-slate-400">
                  {breadcrumb}
                </span>
              )}
              <ChevronRight size={14} className="shrink-0 text-slate-300" />
            </>
          )}
          <h1 className="sp-display font-semibold text-slate-900">{title}</h1>
        </nav>
      </div>

      {/* Right: search + notifications */}
      <div className="flex items-center gap-2">
        {/* Search with ⌘K hint */}
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search feedback…"
            className="w-52 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-10 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 lg:w-64"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>

        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>
      </div>
    </div>
  );
}
