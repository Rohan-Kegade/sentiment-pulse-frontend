import { useState, useCallback } from "react";

import LandingView from "./views/LandingView";
import AuthView from "./views/AuthView";
import CheckoutView from "./views/CheckoutView";
import DashboardView from "./views/DashboardView";
import BuilderView from "./views/BuilderView";
import PublicSurveyView from "./views/PublicSurveyView";

import SessionBanner from "./components/layout/SessionBanner";

import { SEED_SURVEYS } from "./data/surveys";
import { SEED_FEEDBACK } from "./data/feedback";

import { fontStyles } from "./styles/fonts";

export default function App() {
  const [view, setView] = useState("landing");
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const [user, setUser] = useState(null);

  const [tenant, setTenant] = useState({
    id: "t_demo",
    name: "Northwind Retail Co.",
    slug: "northwind",
    plan: "free",
  });

  const [surveys, setSurveys] = useState(SEED_SURVEYS);
  const [feedback] = useState(SEED_FEEDBACK);
  const [previewSurvey, setPreviewSurvey] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = useCallback((next, payload = {}) => {
    if (payload.selectedPlan) {
      setSelectedPlan(payload.selectedPlan);
    }

    setView(next);
  }, []);

  const handleAuth = ({ name, email, tenantName }) => {
    setUser({ id: "u_1", name, email, role: "admin" });
    setTenant((t) => ({ ...t, name: tenantName }));
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  const handleSubscribed = (planId) => {
    setTenant((t) => ({ ...t, plan: planId }));
  };

  const handleDeploy = (survey) => {
    setSurveys((s) => [survey, ...s]);
  };

  const protectedDashboardProps = {
    go,
    tenant,
    surveys,
    feedback,
    mobileOpen,
    setMobileOpen,
  };

  return (
    <div className="sp-root">
      <style>{fontStyles}</style>

      {user && (view === "dashboard" || view === "builder") ? (
        <SessionBanner user={user} tenant={tenant} onLogout={handleLogout} />
      ) : null}

      {view === "landing" && <LandingView go={go} />}
      {view === "login" && (
        <AuthView mode="login" go={go} onAuth={handleAuth} />
      )}
      {view === "register" && (
        <AuthView mode="register" go={go} onAuth={handleAuth} />
      )}
      {view === "checkout" && (
        <CheckoutView
          go={go}
          plan={selectedPlan}
          onSubscribed={handleSubscribed}
        />
      )}
      {view === "dashboard" && <DashboardView {...protectedDashboardProps} />}
      {view === "builder" && (
        <BuilderView
          go={go}
          tenant={tenant}
          onDeploy={handleDeploy}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      )}
      {view === "public-survey" && (
        <PublicSurveyView go={go} survey={previewSurvey || surveys[0]} />
      )}

      {/* Floating dev-only view switcher so every view is reachable without a real router */}
      <div className="fixed bottom-4 right-4 z-50 hidden rounded-xl border border-slate-200 bg-white/95 p-2 text-xs shadow-lg backdrop-blur sm:flex sm:flex-col sm:gap-1">
        <span className="px-2 pb-1 font-semibold text-slate-400">
          Dev view jump
        </span>
        {[
          "landing",
          "login",
          "register",
          "checkout",
          "dashboard",
          "builder",
          "public-survey",
        ].map((v) => (
          <button
            key={v}
            onClick={() => {
              setPreviewSurvey(surveys[0]);
              go(v);
            }}
            className={`rounded-lg px-2 py-1 text-left transition-colors ${view === v ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
