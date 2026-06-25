import { useState } from "react";
import {
  Check,
  Clock,
  Mail,
  Shield,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { ROLES, ROLE_OPTIONS } from "../../data/members";
import { getPlan, atLimit, limitLabel } from "../../data/plans";

const AVATAR_COLORS = {
  indigo: "bg-indigo-100 text-indigo-700",
  teal:   "bg-teal-100 text-teal-700",
  amber:  "bg-amber-100 text-amber-700",
  rose:   "bg-rose-100 text-rose-700",
  violet: "bg-violet-100 text-violet-700",
  slate:  "bg-slate-100 text-slate-600",
};

function memberInitials(name, email) {
  if (name) {
    return name.split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  }
  return (email?.[0] ?? "?").toUpperCase();
}

export default function TeamModal({
  user,
  members,
  workspaces,
  surveys,
  userPlan,
  onClose,
  onInvite,
  onUpdateMember,
  onRemoveMember,
}) {
  const [inviteEmail, setInviteEmail]   = useState("");
  const [inviteRole, setInviteRole]     = useState("member");
  const [inviteError, setInviteError]   = useState("");
  const [inviteSent, setInviteSent]     = useState(false);
  const [expandedId, setExpandedId]     = useState(null);
  const [editState, setEditState]       = useState({});
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  const planObj      = getPlan(userPlan);
  const memberLimit  = planObj.limits.members;
  const totalCount   = members.length + 1; // +1 for the account owner (admin)
  const atMemberLimit = atLimit(totalCount, memberLimit);

  const activeMembers  = members.filter((m) => m.status === "active");
  const pendingMembers = members.filter((m) => m.status === "pending");

  // ── invite ──────────────────────────────────────────────────────────────────

  const handleInvite = () => {
    const email = inviteEmail.trim();
    if (!email) { setInviteError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInviteError("Enter a valid email address"); return; }
    if (members.some((m) => m.email === email)) { setInviteError("This person is already in the team"); return; }

    onInvite({ email, role: inviteRole });
    setInviteEmail("");
    setInviteError("");
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 2000);
  };

  // ── edit helpers ─────────────────────────────────────────────────────────────

  const startEdit = (member) => {
    setExpandedId(member.id);
    setEditState({
      role: member.role,
      workspaceAccess: member.workspaceAccess ? [...member.workspaceAccess] : null,
      surveyAccess:    member.surveyAccess    ? [...member.surveyAccess]    : null,
    });
  };

  const cancelEdit = () => { setExpandedId(null); setEditState({}); };

  const saveEdit = (memberId) => {
    onUpdateMember(memberId, editState);
    setExpandedId(null);
    setEditState({});
  };

  const toggleWorkspaceAccess = (wsId) => {
    setEditState((s) => {
      if (s.workspaceAccess === null) {
        // switch from "all" → specific (exclude the one just toggled off)
        return { ...s, workspaceAccess: workspaces.map((w) => w.id).filter((id) => id !== wsId) };
      }
      const next = s.workspaceAccess.includes(wsId)
        ? s.workspaceAccess.filter((id) => id !== wsId)
        : [...s.workspaceAccess, wsId];
      return { ...s, workspaceAccess: next.length === workspaces.length ? null : next };
    });
  };

  const accessibleSurveys = (workspaceAccess) =>
    workspaceAccess === null ? surveys : surveys.filter((s) => workspaceAccess.includes(s.workspaceId));

  const toggleSurveyAccess = (surveyId) => {
    setEditState((s) => {
      const pool = accessibleSurveys(s.workspaceAccess);
      if (s.surveyAccess === null) {
        return { ...s, surveyAccess: pool.map((sv) => sv.id).filter((id) => id !== surveyId) };
      }
      const next = s.surveyAccess.includes(surveyId)
        ? s.surveyAccess.filter((id) => id !== surveyId)
        : [...s.surveyAccess, surveyId];
      return { ...s, surveyAccess: next.length === pool.length ? null : next };
    });
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-1.5 dark:bg-indigo-950/50">
              <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Team Members</h2>
              <p className="text-[11px] text-slate-400">
                {totalCount} / {limitLabel(memberLimit)} on {planObj.name} plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Invite section */}
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Invite Member</p>

            {atMemberLimit ? (
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/30 dark:bg-amber-950/20">
                <Shield size={16} className="shrink-0 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Member limit reached</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {limitLabel(memberLimit)} members max on {planObj.name}
                  </p>
                </div>
                <button className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700">
                  <Zap size={11} /> Upgrade
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => { setInviteEmail(e.target.value); setInviteError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                      placeholder="colleague@company.com"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{ROLES[r].label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleInvite}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
                  >
                    {inviteSent
                      ? <><Check size={14} /> Sent!</>
                      : <><UserPlus size={14} /> Invite</>}
                  </button>
                </div>
                {inviteError && <p className="text-xs text-rose-500">{inviteError}</p>}
                <p className="text-[11px] text-slate-400">
                  <span className="font-medium text-slate-500">Member</span> — can create & manage surveys in assigned workspaces.{" "}
                  <span className="font-medium text-slate-500">Viewer</span> — read-only access to assigned surveys.
                </p>
              </div>
            )}
          </div>

          {/* Active members */}
          {(activeMembers.length > 0 || true) && (
            <div className="px-6 py-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Active ({activeMembers.length + 1})
              </p>
              <div className="space-y-2">

                {/* Owner row (current user — always admin) */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {memberInitials(user.name, user.email)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {user.name}
                      <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLES.admin.badge}`}>
                    Admin
                  </span>
                </div>

                {activeMembers.map((member) => {
                  const isExpanded      = expandedId === member.id;
                  const isConfirmRemove = confirmRemoveId === member.id;
                  const avatarCls       = AVATAR_COLORS[member.avatarColor] ?? AVATAR_COLORS.indigo;

                  if (isConfirmRemove) {
                    return (
                      <div key={member.id} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800/30 dark:bg-rose-950/20">
                        <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
                          Remove {member.name ?? member.email}?
                        </p>
                        <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">
                          They will lose access immediately.
                        </p>
                        <div className="mt-2.5 flex gap-2">
                          <button
                            onClick={() => { onRemoveMember(member.id); setConfirmRemoveId(null); }}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => setConfirmRemoveId(null)}
                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={member.id}
                      className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      {/* Member row */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarCls}`}>
                          {memberInitials(member.name, member.email)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.email}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLES[member.role]?.badge ?? ROLES.member.badge}`}>
                          {ROLES[member.role]?.label ?? member.role}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => (isExpanded ? cancelEdit() : startEdit(member))}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          >
                            {isExpanded ? "Cancel" : "Edit"}
                          </button>
                          <button
                            onClick={() => setConfirmRemoveId(member.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                            title="Remove member"
                          >
                            <UserMinus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Edit panel */}
                      {isExpanded && (
                        <div className="space-y-5 border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30">

                          {/* Role */}
                          <div>
                            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Role</p>
                            <div className="flex gap-2">
                              {ROLE_OPTIONS.map((r) => (
                                <button
                                  key={r}
                                  onClick={() => setEditState((s) => ({ ...s, role: r }))}
                                  className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-all ${
                                    editState.role === r
                                      ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
                                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                                  }`}
                                >
                                  <p className={`text-xs font-semibold ${editState.role === r ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>
                                    {ROLES[r].label}
                                  </p>
                                  <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{ROLES[r].description}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Workspace access */}
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Workspace Access</p>
                              <button
                                onClick={() =>
                                  setEditState((s) => ({
                                    ...s,
                                    workspaceAccess: s.workspaceAccess === null ? [] : null,
                                    surveyAccess: null,
                                  }))
                                }
                                className="text-[11px] font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:hover:text-indigo-400"
                              >
                                {editState.workspaceAccess === null ? "Restrict to specific" : "Grant all workspaces"}
                              </button>
                            </div>
                            {editState.workspaceAccess === null ? (
                              <div className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-700 dark:border-teal-800/30 dark:bg-teal-950/20 dark:text-teal-400">
                                Access to all current and future workspaces
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {workspaces.length === 0 ? (
                                  <p className="text-xs text-slate-400">No workspaces available</p>
                                ) : workspaces.map((ws) => {
                                  const hasAccess = editState.workspaceAccess.includes(ws.id);
                                  return (
                                    <label
                                      key={ws.id}
                                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 transition-colors hover:bg-slate-50 has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={hasAccess}
                                        onChange={() => toggleWorkspaceAccess(ws.id)}
                                        className="accent-indigo-600"
                                      />
                                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{ws.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Survey access — only shown for viewers */}
                          {editState.role === "viewer" && (
                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Survey Access</p>
                                <button
                                  onClick={() =>
                                    setEditState((s) => ({
                                      ...s,
                                      surveyAccess: s.surveyAccess === null ? [] : null,
                                    }))
                                  }
                                  className="text-[11px] font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:hover:text-indigo-400"
                                >
                                  {editState.surveyAccess === null ? "Restrict to specific" : "Grant all surveys"}
                                </button>
                              </div>
                              {editState.surveyAccess === null ? (
                                <div className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-700 dark:border-teal-800/30 dark:bg-teal-950/20 dark:text-teal-400">
                                  Access to all surveys in accessible workspaces
                                </div>
                              ) : (() => {
                                const pool = accessibleSurveys(editState.workspaceAccess);
                                return pool.length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No surveys in accessible workspaces</p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {pool.map((s) => {
                                      const hasAccess = editState.surveyAccess.includes(s.id);
                                      const ws = workspaces.find((w) => w.id === s.workspaceId);
                                      return (
                                        <label
                                          key={s.id}
                                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 transition-colors hover:bg-slate-50 has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={hasAccess}
                                            onChange={() => toggleSurveyAccess(s.id)}
                                            className="accent-indigo-600"
                                          />
                                          <div className="min-w-0">
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{s.title}</span>
                                            {ws && (
                                              <span className="ml-2 text-[10px] text-slate-400">{ws.name}</span>
                                            )}
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(member.id)}
                              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                            >
                              <Check size={12} /> Save changes
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending invites */}
          {pendingMembers.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Pending Invites ({pendingMembers.length})
              </p>
              <div className="space-y-2">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/30"
                  >
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                      {(member.email?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">{member.email}</p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={10} /> Invited {member.invitedAt}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLES[member.role]?.badge ?? ROLES.member.badge}`}>
                      {ROLES[member.role]?.label ?? member.role}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Pending
                    </span>
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                      title="Cancel invite"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Users size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No team members yet</p>
              <p className="mt-1 text-xs text-slate-400">Invite a colleague above to start collaborating</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
