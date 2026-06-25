import { useState, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

import LandingView from "./views/LandingView";
import AuthView from "./views/AuthView";
import CheckoutView from "./views/CheckoutView";
import DashboardView from "./views/DashboardView";
import BuilderView from "./views/BuilderView";
import PublicSurveyView from "./views/PublicSurveyView";

import { SEED_WORKSPACES } from "./data/workspaces";
import { SEED_SURVEYS } from "./data/surveys";
import { SEED_FEEDBACK } from "./data/feedback";
import { SEED_MEMBERS } from "./data/members";

import { fontStyles } from "./styles/fonts";

const AVATAR_COLORS = ["indigo", "teal", "amber", "rose", "violet"];

export default function App() {
  const [view, setView] = useState("landing");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [user, setUser] = useState(null);

  const [userPlan, setUserPlan] = useState("pro");

  const [workspaces, setWorkspaces] = useState(SEED_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(SEED_WORKSPACES[0].id);
  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];

  const [surveys, setSurveys] = useState(SEED_SURVEYS);
  const [feedback] = useState(SEED_FEEDBACK);
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [previewSurvey] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);

  // Navigating away from the builder always clears the editing context
  const go = useCallback((next, payload = {}) => {
    if (payload.selectedPlan) setSelectedPlan(payload.selectedPlan);
    if (next !== "builder") setEditingSurvey(null);
    setView(next);
  }, []);

  const handleAuth = ({ name, email, tenantName }) => {
    setUser({ id: "u_1", name, email, role: "admin" });
    if (tenantName) {
      const id = "ws_" + Date.now();
      setWorkspaces([
        {
          id,
          name: tenantName,
          slug: tenantName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ]);
      setActiveWorkspaceId(id);
      setSurveys([]);
      setUserPlan("free");
    }
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setWorkspaces(SEED_WORKSPACES);
    setActiveWorkspaceId(SEED_WORKSPACES[0].id);
    setSurveys(SEED_SURVEYS);
    setMembers(SEED_MEMBERS);
    setUserPlan("pro");
    setEditingSurvey(null);
    setView("landing");
  };

  const handleUpdateUser = (patch) => setUser((u) => ({ ...u, ...patch }));

  const handleSubscribed = (planId) => setUserPlan(planId);

  // Survey already has workspaceId set by BuilderView before calling this
  const handleDeploy = (survey) => setSurveys((prev) => [survey, ...prev]);

  const handleUpdateSurvey = (id, patch) =>
    setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const handleDeleteSurvey = (id) =>
    setSurveys((prev) => prev.filter((s) => s.id !== id));

  const handleEditSurveyInBuilder = (survey) => {
    setEditingSurvey(survey);
    setView("builder");
  };

  const handleSwitchWorkspace = (id) => setActiveWorkspaceId(id);

  const handleCreateWorkspace = ({ name }) => {
    const id = "ws_" + Date.now();
    const colorIdx = workspaces.length % AVATAR_COLORS.length;
    setWorkspaces((prev) => [
      ...prev,
      {
        id,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdAt: new Date().toISOString().slice(0, 10),
        color: AVATAR_COLORS[colorIdx],
      },
    ]);
    setActiveWorkspaceId(id);
  };

  const MEMBER_AVATAR_COLORS = ["indigo", "teal", "amber", "rose", "violet", "slate"];

  const handleInviteMember = ({ email, role }) => {
    const id = "m_" + Date.now();
    const colorIdx = members.length % MEMBER_AVATAR_COLORS.length;
    setMembers((prev) => [
      ...prev,
      {
        id,
        name: null,
        email,
        role,
        status: "pending",
        workspaceAccess: null,
        surveyAccess: null,
        joinedAt: null,
        invitedAt: new Date().toISOString().slice(0, 10),
        avatarColor: MEMBER_AVATAR_COLORS[colorIdx],
      },
    ]);
  };

  const handleUpdateMember = (id, patch) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const handleRemoveMember = (id) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  const handleDeleteWorkspace = (id) => {
    const remaining = workspaces.filter((w) => w.id !== id);
    if (remaining.length === 0) return;
    setWorkspaces(remaining);
    setSurveys((prev) => prev.filter((s) => s.workspaceId !== id));
    if (activeWorkspaceId === id) setActiveWorkspaceId(remaining[0].id);
  };

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

  return (
    <LanguageProvider>
    <ThemeProvider>
    <div className="sp-root">
      <style>{fontStyles}</style>

      {view === "landing" && <LandingView go={go} />}
      {view === "login" && <AuthView mode="login" go={go} onAuth={handleAuth} />}
      {view === "register" && <AuthView mode="register" go={go} onAuth={handleAuth} />}
      {view === "checkout" && (
        <CheckoutView go={go} plan={selectedPlan} onSubscribed={handleSubscribed} user={user} />
      )}
      {view === "dashboard" && (
        <DashboardView
          go={go}
          surveys={surveys}
          feedback={feedback}
          onDeleteSurvey={handleDeleteSurvey}
          onEditSurveyInBuilder={handleEditSurveyInBuilder}
          {...workspaceProps}
        />
      )}
      {view === "builder" && (
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
