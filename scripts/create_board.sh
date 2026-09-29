#!/usr/bin/env bash
# Create a user-level GitHub Project (v2) and attach the backlog issues.
#
# The token that opened issues #3-#19 could not create a Project for
# ChristopherKiokoStrathmore (createProjectV2: permission denied), and it
# could not create labels or milestones (HTTP 403). It also could not edit
# or close issues #1 and #2, which are permission probes and not backlog items.
#
# Run this once, as a user who is allowed to own the Project:
#   gh auth refresh -s project,repo
#   ./scripts/create_board.sh
#
# There is no board until this script succeeds. Do not invent a board URL.

set -euo pipefail

OWNER="${OWNER:-ChristopherKiokoStrathmore}"
REPO="${REPO:-ChristopherKiokoStrathmore/digital-care-roadmap}"
TITLE="${TITLE:-Digital care roadmap}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! gh auth status >/dev/null 2>&1; then
  echo "gh is not logged in." >&2
  exit 1
fi

# Best-effort. The setup token could not close these. A user token can.
gh issue close 1 --repo "$REPO" --reason "not planned" \
  --comment "Permission probe, not a backlog item. The backlog starts at #3." || true
gh issue close 2 --repo "$REPO" --reason "not planned" \
  --comment "Permission probe, not a backlog item. The backlog starts at #3." || true

gh label create epic --repo "$REPO" --color 5319e7 --description "Horizon-sized backlog item" --force
gh label create story --repo "$REPO" --color 0E8A16 --description "User story with acceptance criteria" --force
gh label create horizon-1 --repo "$REPO" --color FBCA04 --description "Triage and routing" --force
gh label create horizon-2 --repo "$REPO" --color 1D76DB --description "NBA and churn" --force
gh label create horizon-3 --repo "$REPO" --color D93F0B --description "Self-healing journeys" --force
gh label create needs-operator-data --repo "$REPO" --color B60205 --description "Needs an operator extract these repos do not have" --force
gh label create demo-exists --repo "$REPO" --color C5DEF5 --description "A public demo already covers the check" --force
gh label create declined --repo "$REPO" --color EEEEEE --description "A source README already records this as not done" --force

create_milestone() {
  local title="$1"
  local description="$2"
  local code
  code="$(gh api --method POST "repos/${REPO}/milestones" \
    -f title="$title" -f state="open" -f description="$description" \
    --silent 2>/dev/null && echo ok || true)"
  if [[ "$code" != "ok" ]]; then
    echo "Milestone '$title' was not created (it may already exist)."
  fi
}

create_milestone "Sprint 1" "Planning milestone for the triage-routing stories. Not a record of a sprint that already ran."
create_milestone "Sprint 2" "Planning milestone for the NBA and churn stories. Not a record of a sprint that already ran."
create_milestone "Later" "Backlog past the two written sprints. Several items need operator data."

python3 - "$ROOT/backlog.csv" "$REPO" << 'PY'
import csv, subprocess, sys
path, repo = sys.argv[1], sys.argv[2]
with open(path, newline="", encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        number = row["issue_number"]
        labels = [part for part in row["labels"].split(";") if part]
        command = ["gh", "issue", "edit", number, "--repo", repo]
        if labels:
            command.extend(["--add-label", ",".join(labels)])
        if row["milestone"]:
            command.extend(["--milestone", row["milestone"]])
        subprocess.run(command, check=True)
PY

EXISTING="$(gh project list --owner "$OWNER" --format json --limit 100)"
NUMBER="$(
  TITLE="$TITLE" EXISTING="$EXISTING" python3 - << 'PY'
import json, os
raw = os.environ.get("EXISTING") or "{}"
data = json.loads(raw)
rows = data.get("projects", data if isinstance(data, list) else [])
match = [row for row in rows if row.get("title") == os.environ["TITLE"]]
print(match[0]["number"] if match else "")
PY
)"

if [[ -z "$NUMBER" ]]; then
  CREATED="$(gh project create --owner "$OWNER" --title "$TITLE" --format json)"
  NUMBER="$(python3 -c 'import json,sys; data=json.loads(sys.stdin.read()); print(data["number"])' <<<"$CREATED")"
  echo "Created project number $NUMBER"
else
  echo "Reusing project number $NUMBER"
fi

gh project link "$NUMBER" --owner "$OWNER" --repo "$REPO"

python3 - "$ROOT/backlog.csv" "$OWNER" "$NUMBER" << 'PY'
import csv, subprocess, sys
path, owner, number = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path, newline="", encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        url = f"https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/{row['issue_number']}"
        subprocess.run(
            ["gh", "project", "item-add", number, "--owner", owner, "--url", url],
            check=True,
        )
PY

gh project view "$NUMBER" --owner "$OWNER" --format json --jq '{number:.number,url:.url,title:.title}'
echo "Board created or updated. Put that url in the README. Until this script prints a url, the board does not exist."
