import type { HorizonId } from "./types";

export const REPO_URL = "https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap";

export const CAVEAT =
  "OKR targets and scores are illustrative planning values, not achieved results.";

export const SCORE_NOTE =
  "Scores are illustrative planning scores for this artefact, on a 1 to 5 scale. They are not measured benefit and not hours.";

export function issueUrl(issueNumber: number): string {
  return `${REPO_URL}/issues/${issueNumber}`;
}

export function repoUrl(name: string): string {
  return `https://github.com/ChristopherKiokoStrathmore/${name}`;
}

export const SERIES = [
  {
    name: "telco-churn-nba-engine",
    href: "https://github.com/ChristopherKiokoStrathmore/telco-churn-nba-engine",
    role: "NBA and churn score",
  },
  {
    name: "responsible-ai-pack",
    href: "https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack",
    role: "Model cards and CI gates",
  },
  {
    name: "omnichannel-care-analytics",
    href: "https://github.com/ChristopherKiokoStrathmore/omnichannel-care-analytics",
    role: "Journey KPIs on a synthetic log",
  },
  {
    name: "care-automation-roi",
    href: "https://github.com/ChristopherKiokoStrathmore/care-automation-roi",
    role: "n8n export and assumption ROI",
  },
] as const;

export const MULTI_HEAD = {
  name: "MULTI-HEAD-",
  href: "https://github.com/ChristopherKiokoStrathmore/MULTI-HEAD-",
  role: "Three-head triage demo",
} as const;

export const DOCS = {
  sprints: `${REPO_URL}/blob/main/docs/sprint-plans.md`,
  charter: `${REPO_URL}/blob/main/docs/pilot-charter.md`,
  backlog: `${REPO_URL}/blob/main/backlog.csv`,
  license: `${REPO_URL}/blob/main/LICENSE`,
} as const;

export const HORIZONS: {
  id: HorizonId;
  kicker: string;
  title: string;
  lines: string[];
  stillNeeds: string;
}[] = [
  {
    id: "1",
    kicker: "Now",
    title: "Triage and routing",
    lines: [
      "Strictly below 0.6 is held for review",
      "emergency sets queue to senior_agent",
      "Export not run. No gold accuracy",
    ],
    stillNeeds:
      "A labelled sample, and a workflow run against a real queue. Do not quote the smoke floors as accuracy.",
  },
  {
    id: "2",
    kicker: "Next",
    title: "NBA and churn",
    lines: [
      "POST /score on 7,043 IBM rows",
      "Holdout ROC-AUC 0.846001, PR-AUC 0.656070",
      "Lift 2.806733. Floors 0.82, 0.63, and 2.60",
    ],
    stillNeeds:
      "An operator extract, a refit, and a new pin. The IBM metrics stay IBM metrics.",
  },
  {
    id: "3",
    kicker: "Later",
    title: "Self-healing journeys",
    lines: [
      "4,000 synthetic journeys, seed 20260929",
      "Placeholder payback 8.47 months, year-1 ROI 0.4175",
      "The closed loop is not built",
    ],
    stillNeeds:
      "Replace config/synthetic.yaml and assumptions.yaml with operator measurements. The loop that changes a live route is not built.",
  },
];

export const OKRS = [
  {
    n: "1",
    title: "A routing note a reviewer can defend without a fake accuracy number.",
    krs: [
      {
        id: "KR1",
        target:
          'The routing note cites "not documented" for gold accuracy, and does not cite the smoke floors as quality.',
        shown: "The multi-head model card already says this.",
      },
      {
        id: "KR2",
        target:
          "An import test of the n8n file, on a non-production n8n, shows emergency to senior_agent.",
        shown: "The file exists. It has not been run.",
      },
      {
        id: "KR3",
        target:
          "Precision and recall leave assumptions.yaml only after a labelled sample is written down.",
        shown: "They are still placeholders.",
      },
    ],
  },
  {
    n: "2",
    title: "A next-best action with a gate in front of the score.",
    krs: [
      {
        id: "KR1",
        target:
          "A pilot score returns churn probability, a CLV proxy, and one action from the published rule table.",
        shown: "POST /score does this for one IBM-sample customer.",
      },
      {
        id: "KR2",
        target:
          "CI fails if holdout ROC-AUC, PR-AUC, or top-decile lift fall below 0.82, 0.63, and 2.60.",
        shown: "Those floors are in gates.yaml for the IBM artifact.",
      },
      {
        id: "KR3",
        target:
          "A model card and the gender / SeniorCitizen table ship with the score before an agent sees it.",
        shown: "The pack has both, for the IBM sample only.",
      },
    ],
  },
  {
    n: "3",
    title: "Journey changes follow an operator log, not a synthetic clock.",
    krs: [
      {
        id: "KR1",
        target:
          "Time-to-first-response, repeat contact, and digital-to-call are computed on an operator log.",
        shown: "They are computed on the synthetic log only.",
      },
      {
        id: "KR2",
        target:
          "Cost and containment inputs are replaced from operator sources, and the placeholder label comes off only after that swap.",
        shown: "The label is still on every input.",
      },
      {
        id: "KR3",
        target: "A failed digital attempt changes the next route in a named pilot path.",
        shown: "No repo implements that change.",
      },
    ],
  },
] as const;

export const SPRINTS = [
  {
    n: "1",
    title: "Triage routing contract",
    goal: "A reader can see what the triage demo does, and what it must not be quoted as.",
    issues: [4, 5, 6],
    out: "Out of this sprint: measuring precision and recall (#7), until a labelled sample exists.",
  },
  {
    n: "2",
    title: "NBA demo behind the published gates",
    goal: "The IBM-sample score, the rule, and the governance pack stay tied together.",
    issues: [9, 10, 11],
    out: "Out of this sprint: the operator refit (#12).",
  },
] as const;
