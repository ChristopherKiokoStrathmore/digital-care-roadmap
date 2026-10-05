export const ROADMAP_REPO =
  "https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap";

export const SERIES = [
  {
    name: "telco-churn-nba-engine",
    url: "https://github.com/ChristopherKiokoStrathmore/telco-churn-nba-engine",
  },
  {
    name: "responsible-ai-pack",
    url: "https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack",
  },
  {
    name: "omnichannel-care-analytics",
    url: "https://github.com/ChristopherKiokoStrathmore/omnichannel-care-analytics",
  },
  {
    name: "care-automation-roi",
    url: "https://github.com/ChristopherKiokoStrathmore/care-automation-roi",
  },
] as const;

export const RELATED_REPOS = [
  ...SERIES,
  {
    name: "MULTI-HEAD-",
    url: "https://github.com/ChristopherKiokoStrathmore/MULTI-HEAD-",
  },
] as const;

export const ISSUES_URL = `${ROADMAP_REPO}/issues`;

export const SPRINT_PLANS_URL = `${ROADMAP_REPO}/blob/main/docs/sprint-plans.md`;

export const PILOT_CHARTER_URL = `${ROADMAP_REPO}/blob/main/docs/pilot-charter.md`;

export function issueUrl(issueNumber: number): string {
  return `${ROADMAP_REPO}/issues/${issueNumber}`;
}

export function repoUrl(name: string): string | null {
  const match = RELATED_REPOS.find((repo) => repo.name === name);
  return match ? match.url : null;
}
