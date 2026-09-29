# Two sprint plans

Independent portfolio plans. These sprints were not run. The git history of Projects 1-4 does not record sprint ceremonies, and this file does not invent any. Each story checks a public demo, or it names operator data the demo does not have.

Acceptance criteria use Given / When / Then. Issue links are the backlog items in this repository. Labels and milestones are applied by `scripts/create_board.sh`, which has not been run.

## Sprint 1 - Triage routing contract

Goal: a reader can see what the triage demo does, and what it must not be quoted as.

| Story | Issue |
| --- | --- |
| State the triage quality gap before a route uses the label | [#4](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/4) |
| Keep issue scores below 0.6 on the review path | [#5](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/5) |
| Branch an emergency label in the n8n export | [#6](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/6) |

Out of this sprint: measuring precision and recall ([#7](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/7)). That stays blocked until a labelled sample exists.

### State the triage quality gap before a route uses the label

As a reviewer, I want the routing note to say what MULTI-HEAD does not publish, so a smoke-test floor is not treated as accuracy.

- Given [MODEL_CARD_MULTIHEAD.md](https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack/blob/0b0d32df9886223e5ebb05daa12183fda15cb941/MODEL_CARD_MULTIHEAD.md), when a reader looks for held-out accuracy, macro-F1, emergency recall, or a false-emergency rate on gold labels, then the card says those figures are not documented in the source repo.
- Given the smoke floors quoted on that card, when they are `minEmergencyRecall` 0.01 and `maxFalseEmergencyRate` 0.99, then the card says they are harness-health thresholds, not model quality.
- Given the card, when someone asks whether the pack scored the live API, then the card says it did not.

### Keep issue scores below 0.6 on the review path

As a care reviewer, I want a low issue-confidence score held for a person, so the demo does not auto-route it.

- Given an issue confidence strictly below 0.6, when the [MULTI-HEAD-](https://github.com/ChristopherKiokoStrathmore/MULTI-HEAD-) demo renders the prediction, then it shows needs review and does not present the row as auto-routed.
- Given a score of exactly 0.6, when the comparison in `lib/trust.ts` at commit `809bccd61077898849c428f37521fa198f7c7bf6` is strict `<`, then that score is accepted.
- Given the model card, when the reviewer role after the banner is absent from the source repo, then the card leaves that role as not documented.

### Branch an emergency label in the n8n export

As a routing designer, I want the committed n8n file to send an `emergency` label to a senior queue, so the branch can be reviewed before any live import.

- Given [workflows/n8n_emergency_escalation.json](https://github.com/ChristopherKiokoStrathmore/care-automation-roi/blob/dcc01d2d2b538b075f223e0066d12f5e112a0db5/workflows/n8n_emergency_escalation.json), when `urgency` equals `emergency`, then the matching Set node writes `queue` = `senior_agent`.
- Given any other urgency label, when the IF node does not match, then the other Set node writes `queue` = `standard_automation_path`.
- Given [workflows/README.md](https://github.com/ChristopherKiokoStrathmore/care-automation-roi/blob/dcc01d2d2b538b075f223e0066d12f5e112a0db5/workflows/README.md), when a reader asks whether the file has been imported or executed, then the README says it has not.
- Given the file's `active` flag, when it is read, then the flag is `false`.

## Sprint 2 - NBA demo behind the published gates

Goal: the IBM-sample score, the rule, and the governance pack stay tied together. Operator refit is out of the sprint ([#12](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/12)).

| Story | Issue |
| --- | --- |
| Serve one-customer next-best action from POST /score | [#9](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/9) |
| Gate held-out ROC-AUC, PR-AUC, and top-decile lift | [#10](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/10) |
| Publish the gender and SeniorCitizen check with the score | [#11](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues/11) |

### Serve one-customer next-best action from POST /score

As a retention analyst, I want one customer scored with a churn probability, a CLV proxy, and one action, so the rule can be read without a batch job.

- Given `examples/score_request.json` in [telco-churn-nba-engine](https://github.com/ChristopherKiokoStrathmore/telco-churn-nba-engine), when `POST /score` runs, then the body includes `churn_probability`, `top_reasons`, `clv_proxy`, `addon_propensities`, and `next_best_action`.
- Given the committed example for customer `5343-SGUBI`, when the response is the saved one, then `churn_probability` is 0.122990 and `next_best_action.action` is `no_action`.
- Given the README, when the action is explained, then it comes from `config/nba_rules.yaml` (first match wins), not from an uplift model.
- Given the limitations, when the table is the IBM US sample, then the response is not described as an operator customer's score.

### Gate held-out ROC-AUC, PR-AUC, and top-decile lift

As a reviewer, I want CI to fail when the saved churn model's holdout metrics drop under the written floors, so a swapped artifact cannot pass quietly.

- Given `gates.yaml` in [responsible-ai-pack](https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack), when `scripts/check_gates.py` runs, then ROC-AUC must be at least 0.82, PR-AUC at least 0.63, and top-decile lift at least 2.60.
- Given the recomputed gradient-boosting row, when it is compared at six decimals with upstream `reports/metrics.json`, then ROC-AUC is 0.846001, PR-AUC is 0.656070, and top-decile lift is 2.806733.
- Given a metric under its floor, when CI runs the gate step, then the job fails.
- Given the fairness gaps, when the gate file is read, then those gaps are not floors.

The successful run on commit `345b7efdeaea8d8dd047ecfe8fda07882d44de02` is [Actions run 36568296535](https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack/actions/runs/36568296535).

### Publish the gender and SeniorCitizen check with the score

As a reviewer, I want the group metrics that the IBM file can support sitting next to the score, so a parity gap is visible before anyone widens use.

- Given the held-out rows, when Fairlearn metrics are reported, then the groups are gender and SeniorCitizen only.
- Given the published table, when SeniorCitizen is 1 (286 held-out rows), then the demographic parity difference against SeniorCitizen 0 is 0.223259.
- Given the README, when a reader looks for a fairness certificate, then the text says these measurements are not a CI gate and not a certificate.
