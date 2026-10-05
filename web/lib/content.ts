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
  note: string[];
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
    note: [
      "MULTI-HEAD- at 809bccd61077898849c428f37521fa198f7c7bf6 is a three-head demo (issue, sentiment, urgency). Issue confidence strictly below 0.6 is held for review. The repo publishes no gold accuracy, F1, emergency recall, or false-emergency rate. Smoke floors minEmergencyRecall 0.01 and maxFalseEmergencyRate 0.99 are harness-health thresholds, not model quality. That reading is the one written in responsible-ai-pack MODEL_CARD_MULTIHEAD.md.",
      "care-automation-roi ships workflows/n8n_emergency_escalation.json. An emergency label sets queue to senior_agent. The workflow README says the file has not been imported or executed. active is false. Precision 0.40, recall 0.75, and prevalence 0.08 in assumptions.yaml are illustrative placeholders.",
    ],
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
    note: [
      "telco-churn-nba-engine trains on the IBM Telco Customer Churn file, 7,043 rows, US sample. POST /score returns a churn probability, path contributions, a CLV proxy, add-on propensities, and a rule-based next action. On the published holdout the gradient-boosting churn model has ROC-AUC 0.846001, PR-AUC 0.656070, and top-decile lift 2.806733, against a dummy prior at ROC-AUC 0.500000. Those numbers are that holdout, not an operator result. Uptake scores are current add-on holding, not campaign response. The action table is a policy, not an uplift model.",
      "responsible-ai-pack pins that repo at 21f6115931f4358ebc7cc87d9ba1f4d87fd015aa. It recomputes the same three metrics, draws TreeSHAP plots, runs Fairlearn on gender and SeniorCitizen, and fails CI under floors 0.82, 0.63, and 2.60.",
    ],
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
    note: [
      "omnichannel-care-analytics computes journey KPIs on a seeded synthetic log (seed 20260929, 4,000 journeys). Charts are Plotly HTML labelled SYNTHETIC. Bitext supplies the intent taxonomy. The full Kaggle Twitter corpus was not downloaded: unauthenticated requests did not return the file, and no Kaggle credentials were used. pm4py is not used. The process view is a DuckDB directly-follows table.",
      "care-automation-roi prices containment from assumptions.yaml. Every input is an illustrative placeholder. On those placeholders the base bot scenario shows payback 8.47 months and year-1 ROI 0.4175. There is no Streamlit app. The sensitivity chart is a committed PNG, reports/charts/roi_sensitivity_tornado.png, plus an HTML twin.",
      "What is not built: a loop that changes a live route when a digital attempt fails. Later is that loop. The four repos do not contain it.",
    ],
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
        issues: [4, 5],
      },
      {
        id: "KR2",
        target:
          "An import test of the n8n file, on a non-production n8n, shows emergency to senior_agent.",
        shown: "The file exists. It has not been run.",
        issues: [6],
      },
      {
        id: "KR3",
        target:
          "Precision and recall leave assumptions.yaml only after a labelled sample is written down.",
        shown: "They are still placeholders.",
        issues: [7],
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
        issues: [9],
      },
      {
        id: "KR2",
        target:
          "CI fails if holdout ROC-AUC, PR-AUC, or top-decile lift fall below 0.82, 0.63, and 2.60.",
        shown: "Those floors are in gates.yaml for the IBM artifact.",
        issues: [10],
      },
      {
        id: "KR3",
        target:
          "A model card and the gender / SeniorCitizen table ship with the score before an agent sees it.",
        shown: "The pack has both, for the IBM sample only.",
        issues: [11],
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
        issues: [14, 16],
      },
      {
        id: "KR2",
        target:
          "Cost and containment inputs are replaced from operator sources, and the placeholder label comes off only after that swap.",
        shown: "The label is still on every input.",
        issues: [15, 16],
      },
      {
        id: "KR3",
        target: "A failed digital attempt changes the next route in a named pilot path.",
        shown: "No repo implements that change.",
        issues: [17],
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

/** User-story lines from docs/sprint-plans.md. Stories outside those two sprints have none. */
export const STORY_INTENT: Record<number, string> = {
  4: "As a reviewer, I want the routing note to say what MULTI-HEAD does not publish, so a smoke-test floor is not treated as accuracy.",
  5: "As a care reviewer, I want a low issue-confidence score held for a person, so the demo does not auto-route it.",
  6: "As a routing designer, I want the committed n8n file to send an emergency label to a senior queue, so the branch can be reviewed before any live import.",
  9: "As a retention analyst, I want one customer scored with a churn probability, a CLV proxy, and one action, so the rule can be read without a batch job.",
  10: "As a reviewer, I want CI to fail when the saved churn model's holdout metrics drop under the written floors, so a swapped artifact cannot pass quietly.",
  11: "As a reviewer, I want the group metrics that the IBM file can support sitting next to the score, so a parity gap is visible before anyone widens use.",
};

export function objectivesForIssue(issueNumber: number): { n: string; kr: string; title: string }[] {
  const found: { n: string; kr: string; title: string }[] = [];
  for (const objective of OKRS) {
    for (const kr of objective.krs) {
      if (kr.issues.some((issue) => issue === issueNumber)) {
        found.push({ n: objective.n, kr: kr.id, title: objective.title });
      }
    }
  }
  return found;
}
