// limits: null means unlimited
export const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    responses: "100 responses / mo",
    blurb: "Validate your first feedback loop.",
    limits: { workspaces: 1, surveys: 1, responses: 100 },
    features: [
      "1 workspace",
      "1 survey",
      "100 responses / month",
      "Basic sentiment tagging",
      "QR code generation",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 79,
    annual: 63,
    responses: "5,000 responses / mo",
    blurb: "For teams shipping weekly.",
    limits: { workspaces: 5, surveys: null, responses: 5000 },
    features: [
      "Up to 5 workspaces",
      "Unlimited surveys",
      "5,000 responses / month",
      "Real-time AI sentiment feed",
      "Category auto-tagging",
      "CSV + API export",
      "Priority support",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 249,
    annual: 199,
    responses: "Unlimited responses",
    blurb: "For multi-region, multi-brand orgs.",
    limits: { workspaces: null, surveys: null, responses: null },
    features: [
      "Unlimited workspaces",
      "Unlimited surveys",
      "Unlimited responses",
      "Multi-tenant workspace roles",
      "SSO + audit logs",
      "Dedicated ingestion queue",
      "White-labeled survey links",
    ],
  },
];

export function getPlan(id) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function atLimit(current, cap) {
  return cap !== null && current >= cap;
}

export function limitLabel(cap) {
  return cap === null ? "∞" : cap;
}
