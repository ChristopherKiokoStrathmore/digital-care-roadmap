export const LESSONS = [
  "I keep the churn train/test split leak-free. The split is drawn before imputation, scaling, encoding, or the survival curve, and preprocessing stays inside a pipeline so held-out rows cannot change what was learned.",
  "I fail the build in CI when the saved churn model's holdout ROC-AUC, PR-AUC, or top-decile lift falls below the floors in gates.yaml (0.82, 0.63, and 2.60 on the IBM artifact).",
  "I label synthetic data everywhere it appears, including the journey charts, so a reader can see that the log is synthetic.",
  "I keep illustrative inputs explicit in config. Cost and containment figures stay in assumptions.yaml, and the placeholder label stays on each one.",
  "I test README numbers against committed outputs, so a figure in the write-up has to match the file the run produced.",
];

export const LIMITATIONS = [
  "This roadmap sequences public demos. It is not a production operating plan.",
  "Illustrative OKR targets and the 1-5 scores are planning labels in this repo. They are not measurements.",
  "Lessons learned are engineering notes from building the four demos. They are not operator results, and they do not add a metric.",
  "The closed loop in Later is not implemented.",
  "Projects 1-4 use the IBM US sample, a synthetic journey log, Bitext intent names, a short Twitter preview, and labelled cost assumptions. None of that is operator customer data.",
  "The backlog is the GitHub Issues list. A Projects board is produced by scripts/create_board.sh when it is run with a token that has project scope.",
  "This repo does not add a new model, a new dataset, or a new metric.",
];

export const FIGURES = {
  hero: {
    src: "/figures/hero.png",
    alt: "Four unordered care demos, the score-and-sequence method, and the Now / Next / Later result",
  },
  roadmap: {
    src: "/figures/roadmap.png",
    alt: "Now, Next, Later: triage and routing, NBA and churn, self-healing journeys",
  },
  okrs: {
    src: "/figures/okrs.png",
    alt: "Three OKRs: illustrative target beside what the demos already show",
  },
  backlog: {
    src: "/figures/backlog-quadrant.png",
    alt: "14 stories plotted on the value and effort scores in backlog.csv",
  },
  sprints: {
    src: "/figures/sprints.png",
    alt: "Sprint 1 triage stories and Sprint 2 NBA stories",
  },
} as const;
