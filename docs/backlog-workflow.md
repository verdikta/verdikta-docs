# Verdikta backlog and issue workflow

This guide is the canonical operating procedure for humans and automated agents
creating, selecting, implementing, or maintaining work across the Verdikta
GitHub organization.

The objective is deliberately simple:

> Maintain one organization-wide view that clearly shows the highest-value
> actionable work across all Verdikta repositories.

Use the [Verdikta Master Backlog](https://github.com/orgs/verdikta/projects/1)
as the shared command center. Repository issues remain the canonical record of
the work itself; the Project supplies organization-wide workflow and priority
metadata. Do not create a duplicate issue merely to make work appear in the
Project.

## Where work belongs

### Cross-repository initiatives

Large outcomes involving more than one repository use a parent issue in
[`verdikta-roadmap`](https://github.com/verdikta/verdikta-roadmap/issues) with
the `initiative` label.

The roadmap repository is a home for initiative containers, not ordinary
implementation tasks. Add the repository-owned implementation issues as native
GitHub sub-issues of the initiative so the Roadmap view can report progress.

### Actionable issues

Implementation work belongs in the repository where the change will be made.
If an outcome requires changes in three repositories, create one initiative and
three repository-owned child issues rather than a single vague task or three
copies of the same issue.

| Repository | Owns work involving |
| --- | --- |
| `verdikta-agents` | Agent framework, runtime, web/API surfaces, identity, wallets, policies, and agent contracts |
| `verdikta-applications` | Reference applications, bounty escrow, bounty API/UI, dashboards, and example integrations |
| `verdikta-arbiter` | Arbiter AI node, external adapter, Chainlink node, operator contract, installer, and operator tooling |
| `verdikta-dispatcher` | Aggregation, reputation, oracle selection, protocol settlement, and dispatcher contracts |
| `verdikta-common` | Shared packages, ClassID data, schemas, manifest handling, validation, and reusable utilities |
| `verdikta-site` | Public website, product positioning, public content, RAG material, and conversion flows |
| `verdikta-docs` | Cross-cutting documentation site and documentation-system changes |
| `verdikta-roadmap` | Cross-repository parent initiatives only |

Component-specific documentation normally stays with the component repository.
Use `verdikta-docs` when the documentation change is cross-cutting or changes
the unified documentation system itself.

### Pull requests

Pull requests implement repository issues.

- Link every substantive PR to its issue.
- Use `Closes #123` for an issue in the same repository or
  `Closes verdikta/repository#123` across repositories when appropriate.
- A merged PR does not make an issue complete unless its acceptance criteria
  and validation requirements have been satisfied.
- Close the issue and set the Project item to Done only when the outcome has
  been accepted.

## Project fields

Keep the schema small. Do not invent a new field until repeated use reveals a
specific operational question that the existing fields cannot answer.

### Status: execution state

| Value | Meaning |
| --- | --- |
| `Inbox` | Newly captured and not yet processed |
| `Todo` | Accepted work that has not started |
| `In Progress` | Actively being worked on |
| `Review` | Implementation or deliverable awaits review |
| `Done` | Completed and accepted |

### Readiness: suitability to work

| Value | Meaning |
| --- | --- |
| `Needs Triage` | Missing scope, priority, repository, acceptance criteria, or another important decision |
| `Ready` | Sufficiently clear and unblocked |
| `Blocked` | Cannot proceed because of a dependency, decision, access issue, or external condition |
| `Icebox` | Retained but intentionally outside near-term consideration |

Status and Readiness answer different questions. An issue can correctly be
`Status = In Progress` and `Readiness = Blocked`. Record the blocker in the
issue body or a current comment; do not create a new Readiness value for each
blocking reason.

### Priority: Verdikta-wide importance

Priority is an organization-level GitHub issue field and is therefore stored on
the issue and shared across organization Projects.

| Value | Meaning |
| --- | --- |
| `P0 Critical` | Outage, security issue, funds at risk, severe production problem, or immediate launch blocker |
| `P1 High` | Important to the current strategic objective and should be addressed soon |
| `P2 Normal` | Valuable planned work |
| `P3 Low` | Useful but not currently important |
| `Icebox` | Intentionally deferred |

Priority is global. A P1 documentation or website issue may rank above a P2
protocol issue when it creates more value for Verdikta.

### Size: rough effort

Use `XS`, `S`, `M`, `L`, or `XL`. Size is a rough comparison aid, not a
commitment or calendar forecast.

### Area: functional domain

Use one of `Protocol`, `Arbiters`, `Applications`, `Agents`, `Documentation`,
`Website`, `Growth`, `BizDev`, or `Operations`. Area describes the kind of work;
Repository describes where it is implemented.

### Fields not used

Do not add or populate Start date, Target date, Owner Type, Bounty Status,
Strategic Bet, Impact, Urgency, Confidence, Score, or External Visibility unless
Verdikta explicitly changes this operating model.

- GitHub Assignee is the canonical owner.
- Verdikta Bounties owns bounty lifecycle state; do not reproduce it in GitHub.
- Dates are used only when explicitly requested for a real operational need.

## Project views

| View | Use it for |
| --- | --- |
| **Master Backlog** | Complete cross-repository inventory and detailed filtering |
| **Top Priorities** | The global answer to “What should Verdikta work on next?”; implementation issues, not roadmap containers |
| **Execution Board** | Active work grouped by Status |
| **My Tasks** | Work assigned to the signed-in GitHub user |
| **Agent Queue** | Clear, unblocked `Readiness = Ready` and `Status = Todo` work |
| **Blocked** | Work requiring a decision, dependency, access change, or other intervention |
| **By Area** | Distribution of work across functional domains |
| **Roadmap** | Initiatives and native sub-issue progress |

An item appearing in Agent Queue is not automatic authorization for autonomous
execution. Inspect the issue, repository instructions, permissions, risk, and
acceptance criteria first.

## Required issue quality

Do not mark an issue Ready until it has objective completion and validation
conditions. Use this structure:

```markdown
## Goal

Describe the outcome that should exist when this issue is complete.

## Context

Explain why the work matters and link relevant issues, documentation,
discussions, contracts, or prior pull requests.

## Acceptance criteria

- [ ] Clear, testable condition
- [ ] Clear, testable condition
- [ ] Clear, testable condition

## Validation

Describe how a human or agent can verify completion.

## Scope

In scope:

- ...

Out of scope:

- ...
```

Requests such as “improve onboarding,” “fix documentation,” or “make consensus
better” remain Needs Triage until the expected outcome is testable.

## Intake and triage

When capturing new work:

1. Search the target repository, the organization, and the Master Backlog for
   an existing issue, including differently worded or closed work.
2. Decide whether the item is a cross-repository initiative, a repository-owned
   task, a duplicate, rejected work, or Icebox material.
3. Create the issue in the implementation repository. Create a roadmap parent
   only for a genuinely cross-repository outcome.
4. Add the issue to the Master Backlog with `Status = Inbox` and
   `Readiness = Needs Triage`.
5. Add Goal, Context, Acceptance criteria, Validation, and Scope.
6. Set global Priority, Size, and Area. Confirm the repository is correct.
7. Add the native parent/sub-issue relationship when applicable.
8. Set `Readiness = Ready` only when the work can proceed without guessing.
9. Set `Status = Todo` when Verdikta accepts the work into the active backlog.

Do not use an issue in `verdikta-roadmap` as a substitute for a missing
implementation issue.

## Execution workflow

Before starting work, a human or agent must:

1. Read the repository-root `AGENTS.md` and other repository instructions.
2. Read the complete issue, its parent initiative, linked dependencies, and
   relevant prior PRs or discussions.
3. Confirm the issue is the canonical, non-duplicate record for the work.
4. Confirm `Readiness = Ready`, or explicitly resolve the triage/blocking gap.
5. Confirm the requested action and permissions make the work safe to execute;
   Agent Queue membership alone is not enough.
6. Assign the implementing GitHub identity when practical and set
   `Status = In Progress` when work actually begins.

During work:

- Keep Scope and acceptance criteria current when evidence changes the plan.
- Link important decisions and implementation PRs from the issue.
- If blocked, set `Readiness = Blocked`, keep the truthful execution Status,
  and record the blocker, owner, and removal condition.
- When the blocker is removed, return Readiness to Ready.
- Do not silently expand an issue into materially different work; create or
  propose the appropriate sibling issue.

When implementation or a deliverable awaits review, set `Status = Review`.
When the accepted outcome and validation are complete, set `Status = Done` and
close the underlying issue when appropriate.

## Maintaining backlog quality

Anyone editing issues or Project metadata must preserve these rules:

- Search before creating; never duplicate work across repositories.
- Keep actionable work in its implementation repository.
- Use native parent/sub-issue relationships for meaningful traceability.
- Preserve the distinction between Status and Readiness.
- Rank value across Verdikta, not merely within the local repository.
- Record blocking reasons in the issue, not in new schema values.
- Do not assign calendar dates, duplicate bounty state, or add ownership fields.
- Do not close an issue solely because a PR merged.
- Summarize and obtain approval before bulk issue or Project mutations.

Useful inspection commands include:

```bash
gh project list --owner verdikta
gh project item-list 1 --owner verdikta --limit 200
gh issue list --repo verdikta/REPOSITORY --state open
gh search issues "SEARCH TERMS" --owner verdikta
```

The GitHub web interface, connected GitHub applications, GraphQL/REST APIs, or
the GitHub CLI may be used. Verify write operations by reading the resulting
issue, native relationship, and Project fields back from GitHub.
