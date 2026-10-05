import type { HorizonId } from "@/lib/types";

/**
 * Prose quoted from the README, the sprint plans, and scripts/story_facts.py.
 * Scores are not stored in this module. They are read from backlog.csv.
 */

export const CAVEAT =
  "OKR targets and scores are illustrative planning values, not achieved results.";

export const HORIZONS: {
  id: HorizonId;
  name: string;
  title: string;
  lines: string[];
  needs: string;
}[] = [
  {
    id: 1,
    name: "Now",
    title: "Triage and routing",
    lines: [
      "Strictly below 0.6 is held for review",
      "emergency sets queue to senior_agent",
      "Export not run. No gold accuracy",
    ],
    needs: "A labelled sample, and a workflow run against a real queue.",
  },
  {
    id: 2,
    name: "Next",
    title: "NBA and churn",
    lines: [
      "POST /score on 7,043 IBM rows",
      "Holdout ROC-AUC 0.846001, PR-AUC 0.656070",
      "Lift 2.806733. Floors 0.82, 0.63, and 2.60",
    ],
    needs: "An operator extract, a refit, and a new pin.",
  },
  {
    id: 3,
    name: "Later",
    title: "Self-healing journeys",
    lines: [
      "4,000 synthetic journeys, seed 20260929",
      "Placeholder payback 8.47 months, year-1 ROI 0.4175",
      "The closed loop is not built",
    ],
    needs: "Operator clocks, operator costs, and the route change.",
  },
];

export const NOTES: Record<number, string> = {
  4: "The multi-head model card says gold accuracy, macro-F1, emergency recall, and the false-emergency rate are not documented. Smoke floors minEmergencyRecall 0.01 and maxFalseEmergencyRate 0.99 are harness-health thresholds, not model quality.",
  5: "Issue confidence strictly below 0.6 is held for review. A score of exactly 0.6 is accepted: the comparison in lib/trust.ts at commit 809bccd61077898849c428f37521fa198f7c7bf6 is strict <.",
  6: "In workflows/n8n_emergency_escalation.json, urgency emergency writes queue senior_agent. Any other urgency writes standard_automation_path. The workflow README says the file has not been imported or executed, and active is false. Precision 0.40, recall 0.75, and prevalence 0.08 in assumptions.yaml are illustrative placeholders.",
  7: "Precision and recall leave assumptions.yaml only after a labelled sample is written down. They are still placeholders.",
  9: "POST /score returns churn_probability, top_reasons, clv_proxy, addon_propensities, and next_best_action. For the committed IBM-sample customer 5343-SGUBI, churn_probability is 0.122990 and next_best_action.action is no_action. The action comes from config/nba_rules.yaml, not an uplift model.",
  10: "gates.yaml fails CI when holdout ROC-AUC, PR-AUC, or top-decile lift fall below 0.82, 0.63, and 2.60. The recomputed gradient-boosting row is ROC-AUC 0.846001, PR-AUC 0.656070, and top-decile lift 2.806733, against a dummy prior at ROC-AUC 0.500000. Those numbers are the IBM holdout, not an operator result. Fairness gaps are not floors.",
  11: "Fairlearn groups are gender and SeniorCitizen only. When SeniorCitizen is 1 (286 held-out rows), the demographic parity difference against SeniorCitizen 0 is 0.223259. The README says these measurements are not a CI gate and not a certificate.",
  12: "The IBM metrics stay IBM metrics until an operator extract, a refit, and a new pin exist. responsible-ai-pack pins telco-churn-nba-engine at 21f6115931f4358ebc7cc87d9ba1f4d87fd015aa.",
  14: "Journey KPIs are computed on a seeded synthetic log (seed 20260929, 4,000 journeys). Charts are labelled SYNTHETIC. Bitext supplies the intent taxonomy. pm4py is not used. The process view is a DuckDB directly-follows table.",
  15: "Every input in assumptions.yaml is an illustrative placeholder. On those placeholders the base bot scenario shows payback 8.47 months and year-1 ROI 0.4175. There is no Streamlit app.",
  16: "config/synthetic.yaml and assumptions.yaml still need operator measurements. Until that swap, the rates and the payback stay synthetic or illustrative.",
  17: "No repo implements a loop that changes the next route when a digital attempt fails.",
  18: "Declined in the journey README. pm4py is not used.",
  19: "Declined in the ROI README. There is no Streamlit app.",
};

export const OBJECTIVES: {
  id: string;
  title: string;
  keyResults: { id: string; target: string; shown: string }[];
}[] = [
  {
    id: "1",
    title:
      "A routing note a reviewer can defend without a fake accuracy number.",
    keyResults: [
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
    id: "2",
    title: "A next-best action with a gate in front of the score.",
    keyResults: [
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
    id: "3",
    title: "Journey changes follow an operator log, not a synthetic clock.",
    keyResults: [
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
        target:
          "A failed digital attempt changes the next route in a named pilot path.",
        shown: "No repo implements that change.",
      },
    ],
  },
];
