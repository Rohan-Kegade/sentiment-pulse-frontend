import { useState } from "react";
import {
  ChevronUp,
  LayoutDashboard,
  Lock,
  LogOut,
  MoreHorizontal,
  PenSquare,
  Plus,
  Trash2,
  UserCircle,
  Zap,
} from "lucide-react";
import Logo from "../common/Logo";
import CreateWorkspaceModal from "../modals/CreateWorkspaceModal";
import { getPlan, atLimit, limitLabel } from "../../data/plans";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { id: "builder",   label: "New Survey",  icon: PenSquare       },
];

const PLAN_CARD = {
  free:       "bg-slate-50 border-slate-200",
  pro:        "bg-indigo-50 border-indigo-100",
  enterprise: "bg-violet-50 border-violet-100",
};

const PLAN_BADGE = {
  free:       "bg-slate-200 text-slate-600",
  pro:        "bg-indigo-100 text-indigo-700",
  enterprise: "bg-violet-100 text-violet-700",
};

const AVATAR_PALETTE = [
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
];

function userInitials(name = "") {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

function wsInitials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}


export default function Sidebar({
  active,
  go,
  user,
  onLogout,
  workspaces,
  activeWorkspace,
  onSwitchWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  userPlan,
  mobileOpen,
  setMobileOpen,
}) {
  const [menuOpenId, setMenuOpenId]           = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showCreate, setShowCreate]           = useState(false);
  const [userMenuOpen, setUserMenuOpen]       = useState(false);

  const planObj   = getPlan(userPlan);
  const wsLimit   = planObj.limits.workspaces;
  const wsAtLimit = atLimit(workspaces.length, wsLimit);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform sm:sticky sm:top-0 sm:h-screen sm:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="border-b border-slate-100 px-5 py-5">
          <Logo size="sm" />
        </div>

        {/* Scrollable body */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Main navigation */}
          <div className="space-y-0.5 px-3 pt-3 pb-2">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { go(item.id); setMobileOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon size={15} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  {item.label}
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                </button>
              );
            })}
          </div>

          <div className="mx-3 border-t border-slate-100" />

          {/* Workspaces section */}
          <div className="px-4 pt-3 pb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Workspaces
            </p>
          </div>

          <div className="space-y-0.5 px-3">
            {workspaces.map((ws, idx) => {
              const isActive      = ws.id === activeWorkspace.id;
              const menuOpen      = menuOpenId === ws.id;
              const confirmDelete = confirmDeleteId === ws.id;
              const color         = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];

              if (confirmDelete) {
                return (
                  <div
                    key={ws.id}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3"
                  >
                    <p className="truncate text-xs font-semibold text-rose-800">
                      Delete "{ws.name}"?
                    </p>
                    <p className="mt-0.5 text-[11px] text-rose-600">
                      All surveys will be removed.
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        onClick={() => {
                          onDeleteWorkspace(ws.id);
                          setConfirmDeleteId(null);
                        }}
                        className="flex-1 rounded-lg bg-rose-600 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 rounded-lg border border-rose-200 py-1.5 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={ws.id} className="group relative">
                  <button
                    onClick={() => {
                      onSwitchWorkspace(ws.id);
                      go("dashboard");
                      setMobileOpen(false);
                      setMenuOpenId(null);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "bg-indigo-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${color}`}
                    >
                      {wsInitials(ws.name)}
                    </div>
                    <span
                      className={`min-w-0 flex-1 truncate text-sm font-medium ${
                        isActive ? "text-indigo-700" : "text-slate-700"
                      }`}
                    >
                      {ws.name}
                    </span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    )}
                  </button>

                  {/* Three-dot trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpen ? null : ws.id);
                    }}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-opacity hover:text-slate-600 ${
                      menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpenId(null)}
                      />
                      <div className="absolute right-2 top-10 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        {workspaces.length > 1 ? (
                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              setConfirmDeleteId(ws.id);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={13} /> Delete workspace
                          </button>
                        ) : (
                          <div className="px-3 py-2.5 text-xs text-slate-400">
                            Can't delete the only workspace
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* New workspace */}
          <div className="px-3 pt-1 pb-2">
            {wsAtLimit ? (
              <button
                onClick={() => go("checkout", { selectedPlan: "pro" })}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-amber-50 hover:text-amber-700"
              >
                <Lock size={13} />
                <span>
                  Workspace limit
                  <span className="ml-1 text-[11px] font-semibold text-indigo-600">
                    Upgrade →
                  </span>
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <Plus size={14} /> New workspace
              </button>
            )}
          </div>

        </div>

        {/* Pinned bottom: plan card + user profile */}
        <div className="border-t border-slate-100 px-3 py-3 space-y-1">
          {/* Plan card */}
          <div
            className={`rounded-xl border px-3 py-2.5 ${PLAN_CARD[userPlan] ?? PLAN_CARD.free}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  PLAN_BADGE[userPlan] ?? PLAN_BADGE.free
                }`}
              >
                {planObj.name.toUpperCase()}
              </span>
              {userPlan !== "enterprise" && (
                <button
                  onClick={() =>
                    go("checkout", {
                      selectedPlan: userPlan === "free" ? "pro" : "enterprise",
                    })
                  }
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Zap size={10} /> Upgrade
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">{workspaces.length}</span>
              {" / "}
              <span className="font-semibold text-slate-700">{limitLabel(wsLimit)}</span>
              {" workspaces · "}
              <span className="font-semibold text-slate-700">
                {limitLabel(planObj.limits.surveys)}
              </span>
              {" surveys/ws"}
            </p>
          </div>

          {/* User profile card */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {userInitials(user.name)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                </div>

                <ChevronUp
                  size={14}
                  className={`shrink-0 text-slate-400 transition-transform ${
                    userMenuOpen ? "" : "rotate-180"
                  }`}
                />
              </button>

              {/* User dropdown — opens upward */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 z-50 mb-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {/* Identity */}
                    <div className="px-3 py-2.5">
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    <div className="border-t border-slate-100" />
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <UserCircle size={14} /> Account settings
                    </button>
                    <div className="border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {showCreate && (
        <CreateWorkspaceModal
          onClose={() => setShowCreate(false)}
          onCreate={(data) => {
            onCreateWorkspace(data);
            setShowCreate(false);
          }}
        />
      )}
    </>
  );
}
