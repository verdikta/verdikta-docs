# AGENTS.md — Verdikta Documentation

Read this file before changing documentation, site configuration, issues, or
Project metadata for this repository. Human contributors should follow the same
backlog rules.

## Repository ownership

`verdikta-docs` owns the unified documentation site and cross-cutting Verdikta
documentation. Component-specific documentation should normally be changed in
the component repository and consumed here through the documentation system.

The canonical backlog operating procedure lives in
[`docs/backlog-workflow.md`](docs/backlog-workflow.md). Keep repository-local
agent instructions concise and keep detailed cross-organization process changes
in that canonical guide.

## Verdikta backlog workflow (mandatory)

- Project: [Verdikta Master Backlog](https://github.com/orgs/verdikta/projects/1)
- Canonical guide: [Backlog and issue workflow](docs/backlog-workflow.md)

Repository issues are the source of truth for work. The Project provides shared
Status, Readiness, Priority, Size, Area, and roadmap progress. Never create a
duplicate issue just to make work visible in the Project.

### Navigate the backlog

- **Top Priorities** answers what Verdikta should work on next.
- **Agent Queue** shows `Ready` + `Todo` work, but is not automatic permission
  to execute it.
- **Execution Board** tracks active work by Status.
- **Blocked** shows work requiring intervention.
- **Roadmap** shows cross-repository initiatives and child progress.
- **Master Backlog** is the complete inventory.

### Before starting work

1. Read the full issue, its parent initiative, dependencies, linked PRs, and
   repository instructions.
2. Search this repository and the organization for duplicates or superseding
   work.
3. Confirm the issue is in the Master Backlog and is owned by this repository.
4. Confirm `Readiness = Ready`. If scope, acceptance criteria, validation, or a
   publishing decision is missing, keep or set `Needs Triage` and resolve the
   gap instead of guessing.
5. Confirm the requested action, permissions, and risk make autonomous work
   appropriate. Agent Queue membership alone is insufficient.
6. Assign the implementing GitHub identity when practical and set
   `Status = In Progress` only when work actually begins.

### While working and when finishing

- Keep the issue's Scope and acceptance criteria aligned with the implementation.
- Link the PR to the issue; use `Closes #123` only when completion of that PR
  will satisfy the issue.
- When blocked, set `Readiness = Blocked`, keep the truthful Status, and record
  the blocker and removal condition in the issue.
- Set `Status = Review` when the implementation or deliverable awaits review.
- Set `Status = Done` and close the issue only after acceptance criteria and
  validation are complete and accepted.
- A merged PR alone is not proof that the issue is done.

### Creating or maintaining issues

- Implementation issues live here; roadmap initiative containers live in
  `verdikta-roadmap` and carry the `initiative` label.
- Search before creating. Prefer extending the canonical issue over filing a
  differently worded duplicate.
- New intake begins as `Status = Inbox`, `Readiness = Needs Triage`.
- Mark work Ready only when its Goal, Context, Acceptance criteria, Validation,
  and in/out Scope are objective enough to execute without guessing.
- Use native parent/sub-issue relationships for cross-repository traceability.
- Priority is Verdikta-wide, not repository-local.
- Preserve the difference between execution Status and Readiness.
- GitHub Assignee is the owner; do not add Owner Type.
- Do not add calendar dates unless explicitly requested.
- Do not copy Verdikta Bounties lifecycle state into GitHub.
- Summarize proposed changes and obtain approval before bulk issue or Project
  mutations.

### Required Ready issue structure

```markdown
## Goal

## Context

## Acceptance criteria

- [ ] Clear, testable condition

## Validation

## Scope

In scope:

- ...

Out of scope:

- ...
```

Use Project fields exactly as defined in the canonical guide: Status describes
execution; Readiness describes workability; Priority is global importance; Size
is rough effort; Area is functional domain.
