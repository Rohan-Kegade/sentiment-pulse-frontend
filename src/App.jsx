import { useState, useCallback, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

import LandingView     from "./views/LandingView";
import AuthView        from "./views/AuthView";
import CheckoutView    from "./views/CheckoutView";
import DashboardView   from "./views/DashboardView";
import BuilderView     from "./views/BuilderView";
import PublicSurveyView from "./views/PublicSurveyView";

import * as authApi      from "./api/auth";
import * as workspaceApi from "./api/workspaces";
import * as surveyApi    from "./api/surveys";
import * as feedbackApi  from "./api/feedback";
import * as memberApi    from "./api/members";
import { getToken }      from "./api/client";

import { fontStyles } from "./styles/fonts";

const AVATAR_COLORS      = ["indigo", "teal", "amber", "rose", "violet"];
const MEMBER_AVATAR_COLORS = ["indigo", "teal", "amber", "rose", "violet", "slate"];

export default function App() {
  const [view, setView]               = useState("landing");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [user, setUser]               = useState(null);
  const [userPlan, setUserPlan]       = useState("free");
  const [bootstrapped, setBootstrapped] = useState(false);

  const [workspaces, setWorkspaces]         = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0] ?? null;

  const [surveys, setSurveys]   = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [members, setMembers]   = useState([]);
  const [previewSurvey, setPreviewSurvey] = useState(null);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);

  // ── Bootstrap: check for stored JWT on load ─────────────────────────────
  useEffect(() => {
    if (!getToken()) { setBootstrapped(true); return; }
    authApi.fetchMe()
      .then(({ user: u, workspaces: ws }) => {
        setUser(u);
        setWorkspaces(ws);
        if (ws.length > 0) setActiveWorkspaceId(ws[0].id);
        setView("dashboard");
      })
      .catch(() => authApi.logout())
      .finally(() => setBootstrapped(true));
  }, []);

  // ── Load surveys + feedback + members when active workspace changes ───────
  useEffect(() => {
    if (!activeWorkspace) return;
    surveyApi.fetchSurveys(activeWorkspace.id).then(setSurveys).catch(() => {});
    memberApi.fetchMembers(activeWorkspace.id).then(setMembers).catch(() => {});
  }, [activeWorkspace?.id]);

  // Load feedback for selected survey (DashboardView will call this via prop)
  const loadFeedback = useCallback((surveyId) => {
    feedbackApi.fetchFeedback(surveyId).then((items) => {
      setFeedback((prev) => {
        const filtered = prev.filter((f) => f.surveyId !== surveyId);
        return [...filtered, ...items];
      });
    }).catch(() => {});
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const go = useCallback((next, payload = {}) => {
    if (payload.selectedPlan) setSelectedPlan(payload.selectedPlan);
    if (next !== "builder") setEditingSurvey(null);
    setView(next);
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleAuth = async ({ name, email, password, tenantName }) => {
    try {
      let data;
      if (tenantName) {
        data = await authApi.register({ name, email, password, tenantName });
      } else {
        data = await authApi.login({ email, password });
      }
      setUser(data.user);
      setWorkspaces(data.workspaces);
      if (data.workspaces.length > 0) setActiveWorkspaceId(data.workspaces[0].id);
      setSurveys([]);
      setFeedback([]);
      setMembers([]);
      setUserPlan(tenantName ? "free" : "pro");
      setView("dashboard");
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
    setSurveys([]);
    setFeedback([]);
    setMembers([]);
    setUserPlan("free");
    setEditingSurvey(null);
    setView("landing");
  };

  const handleUpdateUser = async (patch) => {
    setUser((u) => ({ ...u, ...patch }));
    await authApi.updateProfile(patch).catch(() => {});
  };

  const handleSubscribed = (planId) => setUserPlan(planId);

  // ── Workspaces ────────────────────────────────────────────────────────────
  const handleSwitchWorkspace = (id) => {
    setActiveWorkspaceId(id);
    setSurveys([]);
    setFeedback([]);
    setMembers([]);
  };

  const handleCreateWorkspace = async ({ name }) => {
    const colorIdx = workspaces.length % AVATAR_COLORS.length;
    try {
      const ws = await workspaceApi.createWorkspace({ name });
      ws.color = AVATAR_COLORS[colorIdx];
      setWorkspaces((prev) => [...prev, ws]);
      setActiveWorkspaceId(ws.id);
      setSurveys([]);
      setFeedback([]);
      setMembers([]);
    } catch (err) {
      console.error("Create workspace failed:", err.message);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    const remaining = workspaces.filter((w) => w.id !== id);
    if (remaining.length === 0) return;
    try {
      await workspaceApi.deleteWorkspace(id);
      setWorkspaces(remaining);
      setSurveys((prev) => prev.filter((s) => s.workspaceId !== id));
      if (activeWorkspaceId === id) setActiveWorkspaceId(remaining[0].id);
    } catch (err) {
      console.error("Delete workspace failed:", err.message);
    }
  };

  // ── Surveys ───────────────────────────────────────────────────────────────
  const handleDeploy = async (survey) => {
    try {
      const created = await surveyApi.createSurvey(survey);
      setSurveys((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Deploy failed:", err.message);
      throw err;
    }
  };

  const handleUpdateSurvey = async (id, patch) => {
    setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    await surveyApi.updateSurvey(id, patch).catch((err) => {
      console.error("Update survey failed:", err.message);
      surveyApi.fetchSurveys(activeWorkspace.id).then(setSurveys).catch(() => {});
    });
  };

  const handleDeleteSurvey = async (id) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
    await surveyApi.deleteSurvey(id).catch((err) => {
      console.error("Delete survey failed:", err.message);
    });
  };

  const handleEditSurveyInBuilder = (survey) => {
    setEditingSurvey(survey);
    setView("builder");
  };

  // ── Members ───────────────────────────────────────────────────────────────
  const handleInviteMember = async ({ email, role }) => {
    try {
      const member = await memberApi.inviteMember(activeWorkspace.id, { email, role });
      const colorIdx = members.length % MEMBER_AVATAR_COLORS.length;
      setMembers((prev) => [...prev, { ...member, avatarColor: MEMBER_AVATAR_COLORS[colorIdx] }]);
    } catch (err) {
      console.error("Invite failed:", err.message);
    }
  };

  const handleUpdateMember = async (id, patch) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    await memberApi.updateMember(id, patch).catch(() => {});
  };

  const handleRemoveMember = async (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    await memberApi.removeMember(id).catch(() => {});
  };

  // ── Shared sidebar props ──────────────────────────────────────────────────
  const workspaceProps = {
    user,
    onLogout: handleLogout,
    onUpdateUser: handleUpdateUser,
    workspaces,
    activeWorkspace,
    onSwitchWorkspace: handleSwitchWorkspace,
    onCreateWorkspace: handleCreateWorkspace,
    onDeleteWorkspace: handleDeleteWorkspace,
    userPlan,
    mobileOpen,
    setMobileOpen,
    members,
    surveys,
    onInviteMember: handleInviteMember,
    onUpdateMember: handleUpdateMember,
    onRemoveMember: handleRemoveMember,
  };

  if (!bootstrapped) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
    <ThemeProvider>
    <div className="sp-root">
      <style>{fontStyles}</style>

      {view === "landing"   && <LandingView go={go} />}
      {view === "login"     && <AuthView mode="login"    go={go} onAuth={handleAuth} />}
      {view === "register"  && <AuthView mode="register" go={go} onAuth={handleAuth} />}
      {view === "checkout"  && (
        <CheckoutView go={go} plan={selectedPlan} onSubscribed={handleSubscribed} user={user} />
      )}
      {view === "dashboard" && activeWorkspace && (
        <DashboardView
          go={go}
          surveys={surveys}
          feedback={feedback}
          onDeleteSurvey={handleDeleteSurvey}
          onEditSurveyInBuilder={handleEditSurveyInBuilder}
          onUpdateSurvey={handleUpdateSurvey}
          onLoadFeedback={loadFeedback}
          {...workspaceProps}
        />
      )}
      {view === "builder"   && activeWorkspace && (
        <BuilderView
          go={go}
          surveys={surveys}
          onDeploy={handleDeploy}
          onUpdateSurvey={handleUpdateSurvey}
          editingSurvey={editingSurvey}
          {...workspaceProps}
        />
      )}
      {view === "public-survey" && (
        <PublicSurveyView go={go} survey={previewSurvey || surveys[0]} />
      )}
    </div>
    </ThemeProvider>
    </LanguageProvider>
  );
}
