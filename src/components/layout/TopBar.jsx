import { Bell, ChevronRight, Menu, Search } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function TopBar({ setMobileOpen, title, breadcrumb, onBreadcrumbClick, searchQuery, onSearchChange }) {
  const { t } = useLanguage();
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-700 dark:bg-slate-900">
      {/* Left: mobile menu + breadcrumb/title */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 sm:hidden dark:hover:bg-slate-800"
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
                  className="sp-display max-w-[140px] truncate font-medium text-slate-400 transition-colors hover:text-indigo-600"
                >
                  {breadcrumb}
                </button>
              ) : (
                <span className="sp-display max-w-[140px] truncate font-medium text-slate-400">
                  {breadcrumb}
                </span>
              )}
              <ChevronRight size={14} className="shrink-0 text-slate-300 dark:text-slate-600" />
            </>
          )}
          <h1 className="sp-display font-semibold text-slate-900 dark:text-white">{title}</h1>
        </nav>
      </div>

      {/* Right: search + notifications */}
      <div className="flex items-center gap-2">
        {onSearchChange && (
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchSurveys")}
              className="w-52 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-sm outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 lg:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-900 dark:focus:border-indigo-500"
            />
          </div>
        )}

        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>
      </div>
    </div>
  );
}
