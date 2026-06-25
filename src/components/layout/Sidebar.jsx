import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Globe,
  Lock,
  LogOut,
  Monitor,
  Moon,
  MoreHorizontal,
  Plus,
  Settings,
  Sun,
  Trash2,
  User,
  Users,
  Zap,
} from "lucide-react";
import Logo from "../common/Logo";
import CreateWorkspaceModal from "../modals/CreateWorkspaceModal";
import ProfileModal from "../modals/ProfileModal";
import BillingModal from "../modals/BillingModal";
import TeamModal from "../modals/TeamModal";
import { getPlan, atLimit, limitLabel } from "../../data/plans";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { LANGUAGES } from "../../i18n/translations";

const PLAN_GRAD = {
  free:       "from-slate-500 to-slate-700",
  pro:        "from-indigo-500 to-violet-600",
  enterprise: "from-violet-600 to-purple-700",
};

const AVATAR_PALETTE = [
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
];

const USER_AVATAR_BG = {
  indigo: "bg-indigo-600",
  teal:   "bg-teal-500",
  violet: "bg-violet-600",
  rose:   "bg-rose-500",
  amber:  "bg-amber-500",
  slate:  "bg-slate-600",
};

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
  onUpdateUser,
  workspaces,
  activeWorkspace,
  onSwitchWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  userPlan,
  mobileOpen,
  setMobileOpen,
  members = [],
  surveys = [],
  onInviteMember,
  onUpdateMember,
  onRemoveMember,
}) {
  const [menuOpenId, setMenuOpenId]           = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showCreate, setShowCreate]           = useState(false);
  const [userMenuOpen, setUserMenuOpen]       = useState(false);
  const [openSection, setOpenSection]         = useState(null);
  const [showProfile, setShowProfile]         = useState(false);
  const [showBilling, setShowBilling]         = useState(false);
  const [showTeam, setShowTeam]               = useState(false);
  const { theme, setTheme }                   = useTheme();
  const { language, setLanguage, t }          = useLanguage();

  const closeUserMenu = () => { setUserMenuOpen(false); setOpenSection(null); };
  const toggleSection = (s) => setOpenSection((cur) => (cur === s ? null : s));

  const planObj   = getPlan(userPlan);
  const wsLimit   = planObj.limits.workspaces;
  const wsAtLimit = atLimit(workspaces.length, wsLimit);

  // Current language native name for display
  const currentLangNative = LANGUAGES.find((l) => l.name === language)?.nativeName ?? language;
  // User avatar color
  const userAvatarBg = USER_AVATAR_BG[user?.avatarColor ?? "indigo"] ?? "bg-indigo-600";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform sm:sticky sm:top-0 sm:h-screen sm:translate-x-0 dark:border-slate-700 dark:bg-slate-900 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <Logo size="sm" />
        </div>

        {/* Scrollable body */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Workspaces section */}
          <div className="px-4 pt-3 pb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {t("workspaces")}
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
                      {t("deleteWorkspaceQ").replace("{name}", ws.name)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-rose-600">
                      {t("allSurveysRemoved")}
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        onClick={() => {
                          onDeleteWorkspace(ws.id);
                          setConfirmDeleteId(null);
                        }}
                        className="flex-1 rounded-lg bg-rose-600 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                      >
                        {t("delete")}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 rounded-lg border border-rose-200 py-1.5 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
                      >
                        {t("cancel")}
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
                        ? "bg-indigo-50 dark:bg-indigo-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${color}`}
                    >
                      {wsInitials(ws.name)}
                    </div>
                    <span
                      className={`min-w-0 flex-1 truncate text-sm font-medium ${
                        isActive
                          ? "text-indigo-700 dark:text-indigo-400"
                          : "text-slate-700 dark:text-slate-300"
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
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-opacity hover:text-slate-600 dark:hover:text-slate-300 ${
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
                      <div className="absolute right-2 top-10 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        {workspaces.length > 1 ? (
                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              setConfirmDeleteId(ws.id);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            <Trash2 size={13} /> {t("deleteWorkspace")}
                          </button>
                        ) : (
                          <div className="px-3 py-2.5 text-xs text-slate-400">
                            {t("cantDeleteOnly")}
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
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/20"
              >
                <Lock size={13} />
                <span>
                  {t("workspaceLimit")}
                  <span className="ml-1 text-[11px] font-semibold text-indigo-600">
                    {t("upgradeArrow")}
                  </span>
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <Plus size={14} /> {t("newWorkspace")}
              </button>
            )}
          </div>
        </div>

        {/* Pinned bottom: plan card + user profile */}
        <div className="border-t border-slate-100 px-3 py-3 space-y-1 dark:border-slate-800">
          {/* Plan card — gradient CTA */}
          <button
            onClick={() => setShowBilling(true)}
            className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-br p-3 text-left transition-opacity hover:opacity-90 ${PLAN_GRAD[userPlan] ?? PLAN_GRAD.free}`}
          >
            {/* decorative orbs */}
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
            <div className="absolute -bottom-2 right-6 h-10 w-10 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between">
              <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {planObj.name}
              </span>
              <Zap size={12} className="mt-0.5 text-white/50 transition-transform group-hover:scale-110" />
            </div>
            <p className="relative mt-2 text-[11px] text-white/70">
              <span className="font-bold text-white">{workspaces.length}</span>
              {" / "}
              <span className="text-white/60">{limitLabel(wsLimit)} {t("workspacesOf")}</span>
              {"  ·  "}
              <span className="font-bold text-white">{limitLabel(planObj.limits.surveys)}</span>
              {" "}<span className="text-white/60">{t("surveysPerWs")}</span>
            </p>
            <p className="relative mt-1 text-[10px] font-medium text-white/50">
              {userPlan === "enterprise" ? "Manage billing →" : `${t("upgrade")} →`}
            </p>
          </button>

          {/* User profile card */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="relative shrink-0">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${userAvatarBg} text-xs font-bold text-white`}>
                    {userInitials(user.name)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-400 dark:border-slate-900" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                </div>

                <ChevronUp
                  size={14}
                  className={`shrink-0 text-slate-400 transition-transform ${userMenuOpen ? "" : "rotate-180"}`}
                />
              </button>

              {/* User dropdown — opens upward */}
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeUserMenu} />
                  <div className="absolute bottom-full left-0 right-0 z-50 mb-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">

                    {/* Identity */}
                    <div className="px-3 py-2.5">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="truncate text-[11px] text-slate-400">{user.email}</p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700" />

                    {/* Settings */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection("settings"); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Settings size={14} className="text-slate-400" />
                      <span className="flex-1 text-left">{t("settings")}</span>
                      <ChevronRight size={13} className={`text-slate-300 dark:text-slate-600 transition-transform ${openSection === "settings" ? "rotate-90" : ""}`} />
                    </button>
                    {openSection === "settings" && (
                      <div className="border-t border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                        <button
                          onClick={() => { closeUserMenu(); setShowProfile(true); }}
                          className="flex w-full items-center gap-2.5 py-2 pl-9 pr-3 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <User size={12} className="shrink-0 text-slate-400" />
                          {t("profile")}
                        </button>
                        <button
                          onClick={closeUserMenu}
                          className="flex w-full items-center gap-2.5 py-2 pl-9 pr-3 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <Bell size={12} className="shrink-0 text-slate-400" />
                          {t("notifications")}
                        </button>
                        <button
                          onClick={() => { closeUserMenu(); setShowBilling(true); }}
                          className="flex w-full items-center gap-2.5 py-2 pl-9 pr-3 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <CreditCard size={12} className="shrink-0 text-slate-400" />
                          {t("billingPlan")}
                        </button>
                        {user?.role === "admin" && (
                          <button
                            onClick={() => { closeUserMenu(); setShowTeam(true); }}
                            className="flex w-full items-center gap-2.5 py-2 pl-9 pr-3 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Users size={12} className="shrink-0 text-slate-400" />
                            Team
                          </button>
                        )}
                      </div>
                    )}

                    {/* Language */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection("language"); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Globe size={14} className="text-slate-400" />
                      <span className="flex-1 text-left">{t("language")}</span>
                      <span className="mr-1 text-[11px] text-slate-400">{currentLangNative}</span>
                      <ChevronRight size={13} className={`text-slate-300 dark:text-slate-600 transition-transform ${openSection === "language" ? "rotate-90" : ""}`} />
                    </button>
                    {openSection === "language" && (
                      <div className="border-t border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                        {LANGUAGES.map(({ name, nativeName }) => {
                          const isActive = name === language;
                          return (
                            <button
                              key={name}
                              onClick={(e) => { e.stopPropagation(); setLanguage(name); }}
                              className="flex w-full items-center gap-2 py-2 pl-9 pr-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                                {isActive && <Check size={11} className="text-indigo-600" />}
                              </span>
                              <span className={isActive ? "font-semibold text-indigo-600" : "text-slate-600 dark:text-slate-300"}>
                                {nativeName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Theme */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection("theme"); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Sun size={14} className="text-slate-400" />
                      <span className="flex-1 text-left">{t("theme")}</span>
                      <span className="mr-1 text-[11px] text-slate-400">{t(theme.toLowerCase())}</span>
                      <ChevronRight size={13} className={`text-slate-300 dark:text-slate-600 transition-transform ${openSection === "theme" ? "rotate-90" : ""}`} />
                    </button>
                    {openSection === "theme" && (
                      <div className="border-t border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                        {[
                          { themeKey: "Light",  labelKey: "light",  icon: Sun },
                          { themeKey: "Dark",   labelKey: "dark",   icon: Moon },
                          { themeKey: "System", labelKey: "system", icon: Monitor },
                        ].map(({ themeKey, labelKey, icon: Icon }) => {
                          const isActive = themeKey === theme;
                          return (
                            <button
                              key={themeKey}
                              onClick={(e) => { e.stopPropagation(); setTheme(themeKey); }}
                              className="flex w-full items-center gap-2 py-2 pl-9 pr-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                                {isActive && <Check size={11} className="text-indigo-600" />}
                              </span>
                              <Icon size={12} className={`shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                              <span className={isActive ? "font-semibold text-indigo-600" : "text-slate-600 dark:text-slate-300"}>
                                {t(labelKey)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700" />

                    {/* Sign out */}
                    <button
                      onClick={() => { closeUserMenu(); onLogout(); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <LogOut size={14} /> {t("signOut")}
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

      {showProfile && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onSave={(patch) => {
            onUpdateUser?.(patch);
            setShowProfile(false);
          }}
        />
      )}

      {showBilling && (
        <BillingModal
          user={user}
          userPlan={userPlan}
          workspaces={workspaces}
          go={go}
          onClose={() => setShowBilling(false)}
        />
      )}

      {showTeam && (
        <TeamModal
          user={user}
          members={members}
          workspaces={workspaces}
          surveys={surveys}
          userPlan={userPlan}
          onClose={() => setShowTeam(false)}
          onInvite={onInviteMember}
          onUpdateMember={onUpdateMember}
          onRemoveMember={onRemoveMember}
        />
      )}
    </>
  );
}
