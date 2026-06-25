export const ROLES = {
  admin: {
    label: "Admin",
    description: "Full access to all workspaces, settings, and billing",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  member: {
    label: "Member",
    description: "Can create and manage surveys in assigned workspaces",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to assigned surveys and results",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  },
};

export const ROLE_OPTIONS = ["member", "viewer"];

export const SEED_MEMBERS = [
  {
    id: "m_1",
    name: "Alex Rivera",
    email: "alex.rivera@acme.co",
    role: "member",
    status: "active",
    workspaceAccess: null,
    surveyAccess: null,
    joinedAt: "2026-02-10",
    invitedAt: "2026-02-08",
    avatarColor: "teal",
  },
  {
    id: "m_2",
    name: "Jordan Lee",
    email: "jordan.lee@acme.co",
    role: "viewer",
    status: "active",
    workspaceAccess: ["ws_01"],
    surveyAccess: null,
    joinedAt: "2026-04-20",
    invitedAt: "2026-04-18",
    avatarColor: "amber",
  },
  {
    id: "m_3",
    name: null,
    email: "sam.kim@acme.co",
    role: "member",
    status: "pending",
    workspaceAccess: null,
    surveyAccess: null,
    joinedAt: null,
    invitedAt: "2026-06-22",
    avatarColor: "rose",
  },
];
