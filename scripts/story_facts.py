"""Copy the story figures are allowed to show.

Every numeric claim is checked against the README, the backlog, and the docs.
Scores come from backlog.csv. Nothing in this module is a measured operator result.
"""

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CAVEAT = (
    "OKR targets and scores are illustrative planning values, not achieved results."
)

QUESTION = "Which care-analytics capability should a telco build first?"
QUESTION_TAIL = "How would you know it worked?"

SERIES = [
    "telco-churn-nba-engine",
    "responsible-ai-pack",
    "omnichannel-care-analytics",
    "care-automation-roi",
]

# Short names are the labels in the README value table.
SHORT = {
    4: "Triage quality gap",
    5: "Abstain at 0.6",
    6: "n8n emergency branch",
    7: "Labelled triage sample",
    9: "POST /score",
    10: "CI gates",
    11: "Fairness table",
    12: "Operator churn refit",
    14: "Synthetic journey KPIs",
    15: "Assumption ROI",
    16: "Operator journey swap",
    17: "Self-healing loop",
    18: "pm4py",
    19: "Streamlit",
}

# Status words from the README table, not a new scale.
STATUS = {
    4: "Demo exists",
    5: "Demo exists",
    6: "Export, not run",
    7: "Needs operator data",
    9: "Demo exists",
    10: "Demo exists",
    11: "Demo exists",
    12: "Needs operator data",
    14: "Demo exists",
    15: "Demo exists",
    16: "Needs operator data",
    17: "Not built",
    18: "Declined in the journey README",
    19: "Declined in the ROI README",
}

# Large type on the result panel. These are the leading digits of the IBM
# holdout figures printed in full on the Next lane: ROC-AUC 0.846001 and
# top-decile lift 2.806733.
HERO_STATS = (
    ("0.846", "ROC-AUC"),
    ("2.8x", "top-decile lift"),
)

HORIZONS = [
    {
        "key": "NOW",
        "title": "Triage and routing",
        "lines": [
            "Strictly below 0.6 is held for review",
            "emergency sets queue to senior_agent",
            "Export not run. No gold accuracy",
        ],
    },
    {
        "key": "NEXT",
        "title": "NBA and churn",
        "lines": [
            "POST /score on 7,043 IBM rows",
            "Holdout ROC-AUC 0.846001, PR-AUC 0.656070",
            "Lift 2.806733. Floors 0.82, 0.63, and 2.60",
        ],
    },
    {
        "key": "LATER",
        "title": "Self-healing journeys",
        "lines": [
            "4,000 synthetic journeys, seed 20260929",
            "Placeholder payback 8.47 months, year-1 ROI 0.4175",
            "The closed loop is not built",
        ],
    },
]

OKRS = [
    {
        "n": "1",
        "title": "A routing note a reviewer can defend without a fake accuracy number.",
        "title_lines": [
            "A routing note a reviewer can defend",
            "without a fake accuracy number.",
        ],
        "krs": [
            (
                "KR1",
                'The routing note cites "not documented" for gold accuracy, and does not cite the smoke floors as quality.',
                "The multi-head model card already says this.",
            ),
            (
                "KR2",
                "An import test of the n8n file, on a non-production n8n, shows emergency to senior_agent.",
                "The file exists. It has not been run.",
            ),
            (
                "KR3",
                "Precision and recall leave assumptions.yaml only after a labelled sample is written down.",
                "They are still placeholders.",
            ),
        ],
    },
    {
        "n": "2",
        "title": "A next-best action with a gate in front of the score.",
        "krs": [
            (
                "KR1",
                "A pilot score returns churn probability, a CLV proxy, and one action from the published rule table.",
                "POST /score does this for one IBM-sample customer.",
            ),
            (
                "KR2",
                "CI fails if holdout ROC-AUC, PR-AUC, or top-decile lift fall below 0.82, 0.63, and 2.60.",
                "Those floors are in gates.yaml for the IBM artifact.",
            ),
            (
                "KR3",
                "A model card and the gender / SeniorCitizen table ship with the score before an agent sees it.",
                "The pack has both, for the IBM sample only.",
            ),
        ],
    },
    {
        "n": "3",
        "title": "Journey changes follow an operator log, not a synthetic clock.",
        "krs": [
            (
                "KR1",
                "Time-to-first-response, repeat contact, and digital-to-call are computed on an operator log.",
                "They are computed on the synthetic log only.",
            ),
            (
                "KR2",
                "Cost and containment inputs are replaced from operator sources, and the placeholder label comes off only after that swap.",
                "The label is still on every input.",
            ),
            (
                "KR3",
                "A failed digital attempt changes the next route in a named pilot path.",
                "No repo implements that change.",
            ),
        ],
    },
]

SPRINTS = [
    {
        "n": "1",
        "title": "Triage routing contract",
        "goal": "A reader can see what the triage demo does, and what it must not be quoted as.",
        "issues": [4, 5, 6],
        "out": "Out of this sprint: measuring precision and recall (#7), until a labelled sample exists.",
    },
    {
        "n": "2",
        "title": "NBA demo behind the published gates",
        "goal": "The IBM-sample score, the rule, and the governance pack stay tied together.",
        "issues": [9, 10, 11],
        "out": "Out of this sprint: the operator refit (#12).",
    },
]

METHOD = [
    ("backlog.csv", "17 issues (#3 to #19)", "3 epics, 14 stories"),
    ("Value versus effort", "Scores on a 1 to 5 scale", "Do first, major bet, reconsider"),
    ("Now / Next / Later", "Triage and routing", "NBA and churn, then journeys"),
    ("Two sprint plans", "and a pilot charter", "These sprints were not run."),
    ("Three OKRs", "Illustrative targets", "Not achieved results"),
]


def load_rows():
    with (ROOT / "backlog.csv").open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def stories():
    rows = []
    for row in load_rows():
        if row["type"] != "story":
            continue
        issue = int(row["issue_number"])
        rows.append(
            {
                "issue": issue,
                "title": row["title"],
                "short": SHORT[issue],
                "value": int(row["value"]),
                "effort": int(row["effort"]),
                "quadrant": row["quadrant"],
                "status": row["status"],
                "status_label": STATUS[issue],
                "horizon": row["horizon"],
                "sprint": row["sprint"],
            }
        )
    return rows


def epics():
    return [row for row in load_rows() if row["type"] == "epic"]


def band(value, effort):
    """Region implied by the divider between scores 2 and 3.

    Checked against the quadrant column so the chart cannot disagree with the sheet.
    """
    high_value = value >= 3
    high_effort = effort >= 3
    if high_value and not high_effort:
        return "do-first"
    if high_value and high_effort:
        return "major-bet"
    if not high_value and high_effort:
        return "reconsider"
    return "fill-in"


def corpus():
    parts = [(ROOT / "README.md").read_text(encoding="utf-8")]
    parts.append((ROOT / "backlog.csv").read_text(encoding="utf-8"))
    for path in (ROOT / "docs").glob("*.md"):
        parts.append(path.read_text(encoding="utf-8"))
    return "\n".join(parts)
