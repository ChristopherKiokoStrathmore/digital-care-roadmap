# Pilot / proof-of-concept charter

Template for a personal portfolio pilot. Copy it, fill the blanks, and leave a blank empty when the number is not in one of the public repos. This is not an employer charter and it authorises no production traffic.

## Header

| Field | Entry |
| --- | --- |
| Pilot name | |
| Horizon (1 triage, 2 NBA, or 3 journeys) | |
| Owner | |
| Start / decision date | |
| Starting repo | |
| Pinned commit | |

## Hypothesis

One sentence. Name the decision the pilot would change, and the demo it starts from.

## What already exists

Quote only a figure that the pinned README or metrics file prints. Write the dataset next to it (IBM sample, synthetic log, or illustrative assumption).

## Data this pilot still needs

| Need | Source (blank until named) | In a public repo today? |
| --- | --- | --- |
| | | No |

Do not paste customer records, credentials, or employer extracts into the portfolio repos.

## Out of scope

- Treating a smoke-test floor as model quality.
- Quoting a synthetic rate or an assumption-file output as an operator result.
- A production route, a live n8n execution, or a self-healing loop, unless this charter's decision date records that the run happened.

## Illustrative success signals

These are targets for the filled-in pilot. They are not results.

| Signal | Illustrative target | How it would be counted |
| --- | --- | --- |
| | | |

## Stop rule

Stop the pilot when a gated metric falls under the floor written for that model, when the labelled sample is smaller than the charter requires, or when the only available numbers are still the public demo's.

## Decision

| Option | Chosen? | Note |
| --- | --- | --- |
| Keep the demo as a demo | | |
| Replace assumptions with the named extract and rerun | | |
| Stop | | |

## Worked example (not a live pilot)

Horizon 1, starting from [care-automation-roi](https://github.com/ChristopherKiokoStrathmore/care-automation-roi) and [MULTI-HEAD-](https://github.com/ChristopherKiokoStrathmore/MULTI-HEAD-).

Hypothesis: an `emergency` label can be branched to a senior queue in the committed n8n export, without quoting a measured accuracy.

What already exists: the export has not been imported or executed. MULTI-HEAD publishes no gold accuracy. `assumptions.yaml` holds illustrative precision 0.40, recall 0.75, and prevalence 0.08.

Data still needed: a labelled operator sample, and an n8n instance. Both blank here.

Illustrative target, not a result: the import test shows `emergency` to `senior_agent`, and the write-up still says accuracy is not documented.
