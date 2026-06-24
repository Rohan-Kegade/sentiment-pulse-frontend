export const SEED_SURVEYS = [
  {
    id: "srv_01",
    workspaceId: "ws_01",
    title: "Q3 Checkout Experience",
    description: "Understand friction in the post-purchase flow.",
    submissions: 1842,
    endpoint: "pulse.sh/r/chk-q3x9",
    status: "live",
    createdAt: "2026-04-02",
    questions: [
      {
        id: "q1",
        type: "text",
        label: "What almost stopped you from completing checkout?",
      },
      {
        id: "q2",
        type: "choice",
        label: "How would you rate the speed of checkout?",
        options: ["Fast", "Average", "Slow"],
      },
    ],
  },
  {
    id: "srv_02",
    workspaceId: "ws_01",
    title: "Support Ticket Follow-up",
    description: "Closed-ticket satisfaction pulse.",
    submissions: 963,
    endpoint: "pulse.sh/r/sup-7tmv",
    status: "live",
    createdAt: "2026-05-11",
    questions: [
      {
        id: "q1",
        type: "choice",
        label: "Was your issue resolved?",
        options: ["Yes", "Partially", "No"],
      },
      {
        id: "q2",
        type: "text",
        label: "Anything we should have done differently?",
      },
    ],
  },
  {
    id: "srv_03",
    workspaceId: "ws_02",
    title: "Onboarding Day 7 Pulse",
    description: "Sentiment one week after signup.",
    submissions: 421,
    endpoint: "pulse.sh/r/ob7-k2lp",
    status: "draft",
    createdAt: "2026-06-01",
    questions: [
      {
        id: "q1",
        type: "text",
        label: "What's still confusing about the product?",
      },
    ],
  },
];
